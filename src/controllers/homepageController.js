require("dotenv").config();
import request from "request";
import moment from "moment";
import validator from 'validator';
import chatBotService from '../services/chatBotService'
import text from "body-parser/lib/types/text";
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomepage = (req, res) => {
    return res.render("homepage.ejs");
};
let user = {
    name: "",
    phoneNumber: "",
    // time: "",
    quantity: "",
    createdAt: ""
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
  


// Handles messages events
let handleMessage =async (sender_psid, message) => {
    //checking if the message is quick reply with options
    
    if (message && message.quick_reply && message.quick_reply.payload) {
      
        if (message.quick_reply.payload === "SMALL" || message.quick_reply.payload === "MEDIUM" || message.quick_reply.payload === "LARGE") {
            if (message.quick_reply.payload === "SMALL") user.quantity = "1-2 people";
            if (message.quick_reply.payload === "MEDIUM") user.quantity = "2-5 people";
            if (message.quick_reply.payload === "LARGE") user.quantity = "More than 5 people";
            await chatBotService.markMessageSeen(sender_psid);
    await chatBotService.sendTypingOn(sender_psid);
            await chatBotService.sendMessageAskingPhoneNumber(sender_psid);
        return
        }
        if (message.quick_reply.payload !== " ") {
            user.phoneNumber = message.quick_reply.payload;
            user.createdAt = moment(Date.now()).zone("+07:00").format('MM/DD/YYYY h:mm A');
            await chatBotService.sendNotificationToTelegram(user);
            await chatBotService.markMessageSeen(sender_psid);
            await chatBotService.sendTypingOn(sender_psid);
            await chatBotService.sendMessageDoneReserveTable(sender_psid);
        }
       return
    }
    if(message.text){

                    let text = message.text.toLowerCase();
                    let str = message.text;
                    let regex = /^(\+\d{1,3}[- ]?)?\d{10}$/
                    let regex2 = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?((?:A|P)\.?M\.?)$/i
                    if(text.includes('main menu') || text.includes('menu main')){
                        await chatBotService.sendMainMenu(sender_psid);
                    }
                  else  if(text.includes('name')){
                        let username = await chatBotService.getFacebookUsername(sender_psid);
                        await chatBotService.sendUsername(username, sender_psid);
                    }
                  else  if(text.includes('fuck')){
                        await chatBotService.sendStopAbuse(sender_psid);
                    }
                else if(str.split(" ").find(str => str.match(regex)) ){
                    await chatBotService.markMessageSeen(sender_psid);
                            await chatBotService.sendTypingOn(sender_psid);
                            await chatBotService.sendMessageDoneReserveTable(sender_psid);
                }
                else if(str.split(" ").find(str => str.match(regex2)) ){
                    await chatBotService.markMessageSeen(sender_psid);
                            await chatBotService.sendTypingOn(sender_psid);
                          await chatBotService.askQuantity(sender_psid)
                }
                // else if(str.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && ! (str.match(/0{5,}/)) ){
                //     await chatBotService.markMessageSeen(sender_psid);
                //             await chatBotService.sendTypingOn(sender_psid);
                //             await chatBotService.sendMessageDoneReserveTable(sender_psid);
                // }

                    else{
                        //default
                        await chatBotService.sendMessageDefaultForTheBot(sender_psid);
                    }

                }
// let str = message.text
// console.log(str)
// if(str){

  
//     else if(){

//     }
//     else{
//         await chatBotService.sendMessageDefaultForTheBot(sender_psid);
//     }
// }
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
//         if(message.text){

//             let text = message.text.toLowerCase();
//             if(text.includes('main menu') || text.includes('menu main')){
//                 await chatBotService.sendMainMenu(sender_psid);
//             }
//           else  if(text.includes('name')){
//                 let username = await chatBotService.getFacebookUsername(sender_psid);
//                 await chatBotService.sendUsername(username, sender_psid);
//             }
//           else  if(text.includes('fuck')){
//                 await chatBotService.sendStopAbuse(sender_psid);
//             }
//             else{
//                 //default
//                 await chatBotService.sendMessageDefaultForTheBot(sender_psid);
//             }
//         }
//     }else{
//        if(entityChosen === "wit$greetings"){
// await chatBotService.askQuantity(sender_psid)
//        }
//        if(entityChosen === "wit$thanks"){
//            //send thanks message
//            await chatBotService.sendMessageDoneReserveTable(sender_psid);
//     }
// }

// callSendAPI(sender_psid, response);
}

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
    await chatBotService.markMessageSeen(sender_psid);
    await chatBotService.sendTypingOn(sender_psid);
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
     else if (payload === 'GET_STARTED_PAYLOAD') {
          //get facebook username
          let username = await chatBotService.getFacebookUsername(sender_psid);
          console.log(username)
          user.name = username;
          console.log(user.name)
          //send welcome response to users

          await chatBotService.sendResponseWelcomeNewCustomer(username, sender_psid);
    }
     else if (payload === 'RESTART_CONVERSATION') {
        let username = await chatBotService.getFacebookUsername(sender_psid);
          await chatBotService.sendResponseWelcomeNewCustomer(username, sender_psid);
    }
    else if (payload === 'MAIN_MENU') {
       await chatBotService.sendMainMenu(sender_psid);
   }
    else if (payload === 'GUIDE_BOT') {
        await chatBotService.sendGuideToUseBot(sender_psid);
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
     else if (payload === 'SHOW_ROOMS') {
        await chatBotService.handleShowRooms(sender_psid);
     }
     else if (payload === 'SHOW_ROOM_DETAIL') {
        await chatBotService.showRoomDetail(sender_psid);
     }
     else if (payload === "SHOW_APPETIZERS"){
        await chatBotService.sendAppetizers(sender_psid);
    }
     else if (payload === "SHOW_ENTREE_SALAD"){
        await chatBotService.sendSalad(sender_psid);
    }
     else if (payload === "SHOW_FISH"){
        await chatBotService.sendFish(sender_psid);
    }
     else if (payload === "SHOW_CLASSICS"){
        await chatBotService.sendClassic(sender_psid);
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
     else if (payload === 'LIVE_CHAT') {
        await chatBotService.livechat(sender_psid);
    }
    else{
        console.log('err with if else statemnt payload')
    }
    // Send the message to acknowledge the postbal
    callSendAPI(sender_psid, response);
};


let handleSetupInfor =async (req,res)=>{
    //call fb api

     // Send the HTTP request to  Messenger Platform
   let request_body = {
    "get_started":{
        "payload":"GET_STARTED_PAYLOAD"
      }, "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [

                {
                    "type": "postback",
                    "title": "Live Chat",
                    "payload":"LIVE_CHAT"

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
