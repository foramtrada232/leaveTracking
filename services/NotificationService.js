const FCM = require('fcm-node')
const serverKey = "AAAA58Ba4vA:APA91bFd-mfLLHeRQgM76Vo1b82akaITNfDQw6SK7kd3h1BQkJwKgx81zGd60ke378WJh5S2zVbpzT_7mqFOUAUmznyAgkS9QhaRdHM_4VZeyi81Z3QbIfMZBfFfBSTGJ7wZoooC6Z29";
const fcm = new FCM(serverKey)

// Database model
const NotificationModel = require("../models/notification.model");

// const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//     to: 'dUzs8pLYycQ:APA91bF-te6FIHDjSg6bbUBUtpNfrjd6OHWqiNXAwlrVJPbom7RQTM1xiRh1_wvlpxPTc3F4AOtL0M9GChJSunI7XB5JiucsECsi7xvEDEYctSTwhi7lU8xZkTr3oRlM2GTTSSXK2jmv',
//     // collapse_key: 'AIzaSyBCNCtszUkbcgOURxvWFS_py4bs61HvfGk',

//     notification: {
//         title: 'Title of your push notification',
//         body: 'Body of your push notification'
//     }
// }
module.exports.sendNotification = (message) => {
    console.log("MESSAGE:",message)

    fcm.send(message, function (err, response) {
        console.log("ERROR:",err);
        console.log("RESPONSE:",response)
        if (err) {
            console.log("Something has gone wrong!", err)
        } else {
            if (message.notification.title == "Tomorrow Absent user" || "Leave Application") {
                var today = new Date();
                var h = today.getHours();
                var m = today.getMinutes();
                message.notification['createdTime'] = h + ":" + m;
                NotificationModel.create(message.notification).then((user) => {
                    console.log(user)
                    // res.status(201).json({message: "Notification created successfully." });
                }).catch((error) => {
                    console.log("error: ", error);
                    // res.status(500).json( {message: "Notification not created." });
                })
            }
            console.log("Successfully sent with response: ", response)
        }
    })

}