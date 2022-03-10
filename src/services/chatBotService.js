import { promiseImpl } from "ejs";
import request from "request";
let getFacebookUsername = (sender_psid) => {
    return new Promise((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
        request({
            "uri": uri,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                //convert string to json object
                body = JSON.parse(body);
                let username = `${body.last_name} ${body.first_name}`;
                resolve(username);
            } else {
                reject("Unable to send message:" + err);
            }
        });
    });
};
let sendResponseWelcomeNewCustomer = async(username,sender_psid)=>{
return new promise(async(resolve,reject) =>{
    let response_first = { "text": `Welcome ${username} to Dark's Restaurant` };
    let response_second = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Dark's restaurant",
                        "subtitle": "My restaurant is legendary, its classic wine collection equally so.",
                        "image_url": "https://bit.ly/imageToSend",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            },
                            {
                                "type": "postback",
                                "title": "GUIDE TO USE THIS BOT",
                                "payload": "GUIDE_BOT",
                            }
                        ],
                    } ]
            }
        }
    }
              //send a welcome message
           
              await sendMessage(sender_psid, response_first);
  
              //send a image with button view main menu
              await sendMessage(sender_psid, response_second);
})
}

//like call send api
let sendMessage = (sender_psid, response) => {
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
        getFacebookUsername:getFacebookUsername,
        sendResponseWelcomeNewCustomer:sendResponseWelcomeNewCustomer
};