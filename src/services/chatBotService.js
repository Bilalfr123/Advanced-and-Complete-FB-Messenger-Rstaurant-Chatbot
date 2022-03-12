import { promiseImpl } from "ejs";
import request from "request";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
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
let sendResponseWelcomeNewCustomer = (username, sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            };

            //send a welcome message
         
            await sendMessage(sender_psid, response_first);

            //send a image with button view main menu
            await sendMessage(sender_psid, response_second);

            resolve("done!")
        } catch (e) {
            reject(e);
        }

    });
};
let sendGuideToUseBot = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response1 = {
                "text" : "Hi there! I'm a chatbot building with Node.js platform.\nSo, What can I do? 😎" +
                    "\n\nFirst, I can show you the restaurant's menu: lunch, dinner and pub menu, etc. " +
                    "\n\nThen, you can make a reservation. No worry, it isn't a 'real' restaurant. Feel free to test me. 😊"
            };
            // let response2 = {
            //     text: "Second, I can understand the sentences with meaning 'greetings', 'thanks' and 'bye'." +
            //         "\n\nE.g: If you say 'What's up 🇺🇸' or 'hola 🇪🇸' or 'hallo 🇩🇪', I know that it's a 'greetings' sentence. The same thing with 'thanks' and 'bye' sentences." +
            //         "\n\nTry to say: hello, bye, thanks a lot, Bonjour 🇫🇷, etc. you will understand what I mean. 😗"
            // };
            let response3 = {
                text:  "Finally, remember I'm just a bot. So, That 's what can do for you today. 🤠" 
            };
            let response5 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Back to main menu or make a reservation ?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            // await sendTypingOn(sender_psid);
            // await sendMessage(sender_psid, response2);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);
         

            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};
let sendMainMenu = (sender_psid)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let response_second = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Our menus",
                                "subtitle": "We are pleased to offer you a wide-range of menu for lunch or dinner.",
                                "image_url": "https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "LUNCH MENU",
                                        "payload": "LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "DINNER MENU",
                                        "payload": "DINNER_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "PUB MENU",
                                        "payload": "PUB_MENU",
                                    }
                                ],
                            },    {
                                "title": "Hours",
                                "subtitle": "MON-FRI 10AM - 11PM  | SAT 5PM - 10PM | SUN 5PM - 9PM",
                                "image_url": " https://bit.ly/imageOpening",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "RESERVE A TABLE",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            },

                            {
                                "title": "Banquet Rooms",
                                "subtitle": "Restaurant accommodates up to 300 seated guests and similar at cocktail receptions",
                                "image_url": " https://bit.ly/imageShowRooms",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW ROOMS",
                                        "payload": "SHOW_ROOMS",
                                    }
                                ],
                            } ]
                    }
                }
            };


         

            //send a image with button view main menu
            sendMessage(sender_psid, response_second);

            resolve("done!")
        } catch (e) {
            reject(e);
        }

    });
}

let sendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Appetizers",
                                "image_url": "https://bit.ly/imageAppetizer",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW APPETIZERS",
                                        "payload": "SHOW_APPETIZERS",
                                    }
                                ],
                            },

                            {
                                "title": "Entree Salad",
                                "image_url": "https://bit.ly/imageSalad",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW ENTREE SALAD",
                                        "payload": "SHOW_ENTREE_SALAD",
                                    }
                                ],
                            },

                            {
                                "title": "Fish and Shell Fish",
                                "image_url": "https://bit.ly/imageFish",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW FISH",
                                        "payload": "SHOW_FISH",
                                    }
                                ],
                            },

                            {
                                "title": "Skeens Classics",
                                "subtitle": "and Dry-aged on Premise",
                                "image_url": "https://bit.ly/imageClassics",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW CLASSICS",
                                        "payload": "SHOW_CLASSICS",
                                    }
                                ],
                            },

                            {
                                "title": "Go back",
                                "image_url": " https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "BACK TO MAIN MENU",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "RESERVE A TABLE",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            }
                        ]
                    }
                }
            };
         sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};
let sendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "text": "Lump crab cocktail\n$25.00"
            };
            let response2 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://djfoodie.com/wp-content/uploads/Crab-Cocktail-3-800.jpg"
                    }
                }
            };

            let response3 = {
                "text": "House cured salmon\n$16.00"
            };
            let response4 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://www.thespruceeats.com/thmb/rys3IyH2DB6Ma_r4IQ6emN-2jYw=/4494x3000/filters:fill(auto,1)/simple-homemade-gravlax-recipe-2216618_hero-01-592dadcba64743f98aa1f7a14f81d5b4.jpg"
                    }
                }
            };

            let response5 = {
                "text": "Steamed Whole Maine Lobsters\n$35.00"
            };
            let response6 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://portcitydaily.com/wp-content/uploads/For-the-Shell-of-It.jpg"
                    }
                }
            };

            let response7 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Back to main menu or make a reservation ?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response6);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);

            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let sendPubMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "text": "Hamburger with French Fries\n$19.50"
            };
            let response2 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://previews.123rf.com/images/genmike/genmike1411/genmike141100010/33951440-burger-and-french-fries.jpg"
                    }
                }
            };

            let response3 = {
                "text": "Ham and Cheese on a Baguette as Salad or Sandwich\n$21.00"
            };
            let response4 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/Blackforesthamcheesebfd18d.jpg"
                    }
                }
            };

            let response5 = {
                "text": "Braised short rib salad\n$29.50"
            };
            let response6 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/ribs_0.jpg?itok=bOf0t_NF"
                    }
                }
            };

            let response7 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Back to main menu or make a reservation ?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response6);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};
let handleShowRooms = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Bull Moose Room",
                                "subtitle": "The room is suited for parties of up to 25 people",
                                "image_url": "https://bit.ly/showRoom1",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW DESCRIPTION",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Lillie Langstry Room",
                                "subtitle": "The room is suited for parties of up to 35 people",
                                "image_url": "https://bit.ly/showRoom2",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW DESCRIPTION",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Lincoln Room",
                                "subtitle": "The room is suited for parties of up to 45 people",
                                "image_url": "https://bit.ly/showRoom3",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW DESCRIPTION",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Go back",
                                "image_url": " https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "BACK TO MAIN MENU",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "RESERVE A TABLE",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            }
                        ]
                    }
                }
            };

            //send a welcome message
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let showRoomDetail = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url":  " https://bit.ly/imageToSend" //add gif
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `The rooms is suited for parties up to 45 people.`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done!");
        }catch (e) {
            reject(e);
        }
    })
};

let sendAppetizers = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
try{
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Little Neck Clams on the Half Shell",
                                "subtitle": "Dozen - $20.00",
                                "image_url": "https://bit.ly/appetizers1",
                            },

                            {
                                "title": "Fresh Oysters",
                                "subtitle": "1/2 Dozen - $21.00 | Dozen - $40.00",
                                "image_url": "https://bit.ly/appetizers2",
                            },

                            {
                                "title": "Lobster Salad",
                                "subtitle": "Half Lobster with Avocado and Grapefruit",
                                "image_url": "https://bit.ly/appetizers3",
                            },

                            {
                                "title": "Go back",
                                "image_url": " https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "BACK TO LUNCH MENU",
                                        "payload": "BACK_TO_LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "BACK TO MAIN MENU",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "RESERVE A TABLE",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            }
                        ]
                    }
                }
            };
            await sendMessage(sender_psid, response);
        }catch(e){
            reject(e)
        }
    });
}
let sendSalad = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": 'https://bit.ly/imageToSend'
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Entree Salad \n$25.00`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "BACK TO LUNCH MENU",
                                "payload": "BACK_TO_LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};

let sendFish = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": 'https://bit.ly/imageToSend'
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Fish fry \n$60.00`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "BACK TO LUNCH MENU",
                                "payload": "BACK_TO_LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};

let sendClassic = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": 'https://bit.ly/imageToSend'
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Perfect oven baked fries \n$30.00`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "BACK TO LUNCH MENU",
                                "payload": "BACK_TO_LUNCH_MENU",
                            },
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};
let handleReservation = (username,sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
     
            let response = { text: `Hi ${username}, What time and date you would like to reserve a table ?\n\nThe time format should be like tomorrow at 12:20AM or any time of your choice` };
            let response1 = { text: `P.S: You must type time in this format  "2:30 AM" ` };
            await sendMessage(sender_psid, response);
            await sendMessage(sender_psid, response1);
        } catch (e) {
            reject(e);
        }
    });
};
let sendMessageAskingPhoneNumber = (sender_psid) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "messaging_type": "RESPONSE",
        "message": {
            "text": "Thank you. And what's the best phone number for us to reach you at?\n\nThe phone format should be like one of following:\n +92-3106037890\n +923106037890\n 3106037890 ",
            "quick_replies": [
                {
                    "content_type": "user_phone_number",
                }
            ]
        }
    }
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
let askQuantity = async(sender_psid)=>{
    let request_body = {
        "recipient":{
            "id":sender_psid
          },
          "messaging_type": "RESPONSE",
          "message":{
            "text": "Your party size ?:",
            "quick_replies":[
              {
                "content_type":"text",
                "title":"1-2",
                "payload":"SMALL",
                "image_url":"http://example.com/img/red.png"
              },{
                "content_type":"text",
                "title":"4-5",
                "payload":"MEDIUM",
                "image_url":"http://example.com/img/green.png"
              }
              ,{
                "content_type":"text",
                "title":"9-10",
                "payload":"LARGE",
                "image_url":"http://example.com/img/green.png"
              }
            ]
          }
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
    
}
let sendMessageDoneReserveTable = async (sender_psid) => {
    try {
        let response = {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://bit.ly/giftDonalTrump"
                }
            }
        };
  
        await sendMessage(sender_psid, response);

        //get facebook username
        let username = await getFacebookUsername(sender_psid);

        //send another message
        let response2 = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": `Done! \nOur reservation team will contact you as soon as possible ${username}.\n \nWould you like to check our Main Menu?`,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "SHOW MAIN MENU",
                            "payload": "MAIN_MENU"
                        },
                        {
                            "type":"phone_number",
                            "title":"☎ HOT LINE",
                            "payload":"+923106037805"
                        },
                        {
                            "type": "postback",
                            "title": "START OVER",
                            "payload": "RESTART_CONVERSATION"
                        }
                    ]
                }
            }
        };
        await sendMessage(sender_psid, response2);
    } catch (e) {
        console.log(e);
    }
};
let livechat = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = getFacebookUsername(sender_psid)
            let usernameBold= username.bold()
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Talk to an agent",
                                "subtitle": `Hey ${usernameBold}, please wait a while till someone gets back to you.Would you like to check our Main Menu or make a Reservation?`,
                                "image_url": "https://media.istockphoto.com/photos/managing-the-days-inquiries-picture-id938430346?k=20&m=938430346&s=612x612&w=0&h=-5azqEhroazZL-ofgB_UWwQe9JMFDar4KnhB8VZiSeU=",
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
            };
         sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};
let sendMessageDefaultForTheBot = (sender_psid) => {
    return new Promise (async (resolve, reject) => {
        try{
            //send a media template
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `"Sorry, I'm just a bot, man ^^ \nYou can test me with all these buttons or try to make a reservation.`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },   {
                                "type": "postback",
                                "title": "RESERVE A TABLE",
                                "payload": "RESERVE_TABLE",
                            },
                            {
                                "type": "postback",
                                "title": "START OVER",
                                "payload": "RESTART_CONVERSATION"
                            }
                        ]
                    }
                }
            };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};
let sendUsername = (username,sender_psid) => {
    return new Promise (async (resolve, reject) => {
        try{
let response1 = {
    'text' : `Hey, i know your name is ${username}`
}
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};
let sendStopAbuse = (sender_psid) => {
    return new Promise (async (resolve, reject) => {
        try{
let response1 = {
    'text' : `Hey dont say that bad word!`
}
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            resolve("done");
        }catch (e) {
            reject(e);
        }
    });
};
//like call send api
let sendMessage = (sender_psid, response) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response,
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                console.log(res)
                console.log(body)
                if (!err) {
                    console.log("message sent!");
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};
let sendTypingOn = (sender_psid) => {
    return new Promise ((resolve, reject) => {
       try{
           let request_body = {
               "recipient": {
                   "id": sender_psid
               },
               "sender_action":"typing_on"
           };

           // Send the HTTP request to the Messenger Platform
           request({
               "uri": "https://graph.facebook.com/v6.0/me/messages",
               "qs": { "access_token": PAGE_ACCESS_TOKEN },
               "method": "POST",
               "json": request_body
           }, (err, res, body) => {
               if (!err) {
                   resolve('done!')
               } else {
                   reject("Unable to send message:" + err);
               }
           });
       } catch (e) {
           reject(e);
       }
    });
};
let markMessageSeen = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "sender_action":"mark_seen"
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        }catch (e) {
          reject(e);
        }
    });
};
let sendNotificationToTelegram = (user) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                chat_id: process.env.TELEGRAM_GROUP_ID,
                parse_mode: "HTML",
                text: `
| --- <b>A new reservation</b> --- |
| ------------------------------------------------|
| 1. Username: <b>${user.name}</b>   |
| 2. Phone number: <b>${user.phoneNumber}</b> |
| 4. Quantity: <b>${user.quantity}</b> |
| 5. Created at: ${user.createdAt} |
| ------------------------------------------------ |                           
`
// | 3. Time: <b>${user.time}</b> |
            };

            // Send the HTTP request to the Telegram
            request({
                "uri": `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
        getFacebookUsername:getFacebookUsername,
        sendResponseWelcomeNewCustomer:sendResponseWelcomeNewCustomer,
        sendGuideToUseBot:sendGuideToUseBot,
        sendMainMenu:sendMainMenu,
        sendLunchMenu:sendLunchMenu,
        handleShowRooms:handleShowRooms,
        showRoomDetail:showRoomDetail,
        sendDinnerMenu:sendDinnerMenu,
        sendPubMenu:sendPubMenu,
        sendAppetizers:sendAppetizers,
        sendSalad:sendSalad,
        sendFish:sendFish,
        sendClassic:sendClassic,
        handleReservation:handleReservation,
        askQuantity:askQuantity,
        sendMessageAskingPhoneNumber:sendMessageAskingPhoneNumber,
        sendMessageDoneReserveTable:sendMessageDoneReserveTable,
        sendTypingOn:sendTypingOn,
        markMessageSeen:markMessageSeen,
        sendNotificationToTelegram:sendNotificationToTelegram,
        sendMessageDefaultForTheBot:sendMessageDefaultForTheBot,
        sendUsername:sendUsername,
        sendStopAbuse:sendStopAbuse,
        livechat:livechat
};