require("dotenv").config();
import request from "request";
import moment from "moment";
import chatBotService from '../services/chatBotService'
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomepage = (req, res) => {
    return res.render("homepage.ejs");
};

let getWebhook = (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = MY_VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

};
function firstTrait(nlp, name) {
    return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
  }
  let handleMessage = async (sender_psid, message) => {
    //checking quick reply
    if (message && message.quick_reply && message.quick_reply.payload) {
        if (message.quick_reply.payload === "SMALL" || message.quick_reply.payload === "MEDIUM" || message.quick_reply.payload === "LARGE") {
            //asking about phone number
            if (message.quick_reply.payload === "SMALL") user.quantity = "1-2 people";
            if (message.quick_reply.payload === "MEDIUM") user.quantity = "2-5 people";
            if (message.quick_reply.payload === "LARGE") user.quantity = "More than 5 people";
            // await chatBotService.markMessageSeen(sender_psid);
            // await chatBotService.sendTypingOn(sender_psid);
            await chatBotService.sendMessageAskingPhoneNumber(sender_psid);
            return;
        }
        // pay load is a phone number
        if (message.quick_reply.payload !== " ") {
            //done a reservation
            // npm install --save moment to use moment
            user.phoneNumber = message.quick_reply.payload;
            // user.createdAt = moment(Date.now()).zone("+07:00").format('MM/DD/YYYY h:mm A');
            //send a notification to Telegram Group chat by Telegram bot.
            // await chatBotService.sendNotificationToTelegram(user);

            // send messages to the user
            // await chatBotService.markMessageSeen(sender_psid);
            // await chatBotService.sendTypingOn(sender_psid);
            // await chatBotService.sendMessageAskingPhoneNumber(sender_psid);
        }
        return;
    }

    //handle text message
    let entity = handleMessageWithEntities(message);
    let locale = entity.locale;

    // await chatBotService.sendTypingOn(sender_psid);
    // await chatBotService.markMessageSeen(sender_psid);

    if (entity.name === "wit$datetime:datetime") {
        //handle quick reply message: asking about the party size , how many people
        user.time = moment(entity.value).zone("+07:00").format('MM/DD/YYYY h:mm A');

        await chatBotService.sendMessageAskingQuality(sender_psid);
    } else if (entity.name === "wit$phone_number:phone_number") {
        //handle quick reply message: done reserve table

        user.phoneNumber = entity.value;
        // user.createdAt = moment(Date.now()).zone("+07:00").format('MM/DD/YYYY h:mm A');
        //send a notification to Telegram Group chat by Telegram bot.
        // await chatBotService.sendNotificationToTelegram(user);

        // send messages to the user
        // await chatBotService.sendMessageDoneReserveTable(sender_psid);

    } else if (entity.name === "wit$greetings") {
        // await homepageService.sendResponseGreetings(sender_psid, locale);
    } else if (entity.name === "wit$thanks") {
        // await homepageService.sendResponseThanks(sender_psid, locale);
    } else if (entity.name === "wit$bye") {
        // await homepageService.sendResponseBye(sender_psid, locale);
    } else {
        //default reply
        // await chatBotService.sendMessageDefaultForTheBot(sender_psid);
    }

    //handle attachment message
};

let handleMessageWithEntities = (message) => {
    let entitiesArr = [ "wit$datetime:datetime", "wit$phone_number:phone_number", "wit$greetings", "wit$thanks", "wit$bye" ];
    let entityChosen = "";
    let data = {}; // data is an object saving value and name of the entity.
    entitiesArr.forEach((name) => {
        let entity = firstTrait(message.nlp, name.trim());
        if (entity && entity.confidence > 0.8) {
            entityChosen = name;
            data.value = entity.value;
        }
    });

    data.name = entityChosen;

    // checking language
    if (message && message.nlp && message.nlp.detected_locales) {
        if (message.nlp.detected_locales[0]) {
            let locale = message.nlp.detected_locales[0].locale;
            data.locale = locale.substring(0, 2)
        }

    }
    return data;
};
// Handles messages events
// let handleMessage =async (sender_psid, message) => {
//     //checking if the message is quick reply with options
//     if (message && message.quick_reply && message.quick_reply.payload) {
      
//         if (message.quick_reply.payload === "SMALL" || message.quick_reply.payload === "MEDIUM" || message.quick_reply.payload === "LARGE") {
           
//             // await chatBotService.sendMessageAskingPhoneNumber(sender_psid);
//             await chatBotService.askQuantity(sender_psid)
//         return
//         }
//         return
//     }

// //     let entity = handleMessageWithEntities(message);
// //     if (entity.name === "wit$greetings") {
// //         //handle quick reply message: asking about the party size , how many people


// //         await chatBotService.askQuantity(sender_psid)
// //     } 
// // let handleMessageWithEntities = (message) => {
// //     let entitiesArr = [ "wit$datetime:datetime", "wit$phone_number:phone_number", "wit$greetings", "wit$thanks", "wit$bye" ];
// //     let entityChosen = "";
// //     let data = {}; // data is an object saving value and name of the entity.
// //     entitiesArr.forEach((name) => {
// //         let entity = firstTrait(message.nlp, name.trim());
// //         if (entity && entity.confidence > 0.8) {
// //             entityChosen = name;
// //             data.value = entity.value;
// //         }
// //     });

// //     data.name = entityChosen;
// //     return data
// // };
//     let response;
// let entitiesArr = [ "wit$greetings", "wit$thanks",];
//     let entityChosen = "";
//     entitiesArr.forEach((name) => {
//         let entity = firstTrait(message.nlp, name);
//         if (entity && entity.confidence > 0.8) {
//             entityChosen = name;
//         }
//     });

//     if(entityChosen === ""){
//         //default
//         response = {
//                                 "text": `Please send me correct info as asked!`
//                             }
//     }else{
//        if(entityChosen === "wit$greetings"){
// await chatBotService.askQuantity(sender_psid)
//        }
//        if(entityChosen === "wit$thanks"){
//            //send thanks message
//            response = {
//             "text": `You are welcome! `
//         }
//     }
// }
//  callSendAPI(sender_psid, response);
// };

// Handles messaging_postbacks events
let handlePostback = async(sender_psid, received_postback) => {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    // switch (payload) {
    //     case "GET_STARTED":
    //     case "RESTART_CONVERSATION":
       
    //         break;
    // }
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
     else if (payload === 'GET_STARTED_PAYLOAD') {
          //get facebook username
          let username = await chatBotService.getFacebookUsername(sender_psid);
          console.log(username)
          //send welcome response to users

          await chatBotService.sendResponseWelcomeNewCustomer(username, sender_psid);
    }
    else if (payload === 'MAIN_MENU') {
       await chatBotService.sendMainMenu(sender_psid);
   }
     else if (payload === 'LUNCH_MENU') {
        await chatBotService.sendLunchMenu(sender_psid);
    }
     else if (payload === 'DINNER_MENU') {
        await chatBotService.sendDinnerMenu(sender_psid);
    }
     else if (payload === 'PUB_MENU') {
        await chatBotService.sendPubMenu(sender_psid);
     }
     else if (payload === "SHOW_APPETIZERS"){
        await chatBotService.sendAppetizers(sender_psid);
    }
     else if (payload === "RESERVE_TABLE"){
        let username = await chatBotService.getFacebookUsername(sender_psid);
        await chatBotService.handleReservation(username,sender_psid);
    }
     else if (payload === "BACK_TO_LUNCH_MENU"){
        await chatBotService.sendLunchMenu(sender_psid);
    }
     else if (payload === 'BACK_TO_MAIN_MENU') {
        await chatBotService.sendMainMenu(sender_psid);
    }
    // Send the message to acknowledge the postbal
    callSendAPI(sender_psid, response);
};


let handleSetupInfor =async (req,res)=>{
    //call fb api

     // Send the HTTP request to the Messenger Platform
   let request_body = {
    "get_started":{
        "payload":"GET_STARTED_PAYLOAD"
      }, "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
           
                {
                    "type": "web_url",
                    "title": "Shop now",
                    "url": "https://www.originalcoastclothing.com/",
                    
                },
                {
                    "type": "web_url",
                    "title": "Get Lost",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "full"
                },{
                    "type":"postback",
                    "title":"Restart Conversation",
                    "payload":"RESTART_CONVERSATION"
                  }
            ]
        }
    ],  "whitelisted_domains":[
        "https://dark-restaurant-bot.herokuapp.com/",

 
    ]
   };

    return new Promise((resolve,reject)=>{
        try{
            request({
                "uri": "https://graph.facebook.com/v13.0/me/messenger_profile?access_token=<PAGE_ACCESS_TOKEN>",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, response, body) => {
                console.log(`start`)
                console.log(`LOgs setup persistent menu and get started button: `, response)
                console.log(`end--------------`)
                if (!err) {
                    return res.send("setup done!")
                } else {
                    return res.send("Something went wrong with server please check logs....")
                }
            });
        }catch(e){
            reject(e)
        }
    })
}
  
// Sends response messages via the Send API
let callSendAPI = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

module.exports = {
    getHomepage: getHomepage,
    getWebhook: getWebhook,
    postWebhook: postWebhook,
    handleSetupInfor:handleSetupInfor,
};
