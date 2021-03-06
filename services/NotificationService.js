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
    console.log("MESSAGE:", message)

    fcm.send(message, function (err, response) {
        console.log("ERROR:", err);
        console.log("RESPONSE:", response)
        if (err) {
            console.log("Something has gone wrong!", err)
        } else {
            if (message.notification.title == "Tomorrow Absent user" || message.notification.title == "Leave Application") {
                console.log("==============if calling=============")


                var currentTime = new Date();
                let date = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate();

                var currentOffset = currentTime.getTimezoneOffset();

var ISTOffset = 330;   // IST offset UTC +5:30 

var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

// ISTTime now represents the time in IST coordinates

var hoursIST = currentTime.setHours(currentTime.getHours() + 5) ;
var minutesIST = currentTime.setMinutes(currentTime.getMinutes() + 30) ;
console.log("============TIME=============:",hoursIST +":"+ minutesIST);
const hours = currentTime.getHours();
const minute = currentTime.getMinutes();
console.log("MINUTE:",hours +":"+minute)
message.notification['createdTime'] = hours + ":" + minute;
message.notification['createdAt'] = date;
NotificationModel.create(message.notification).then((user) => {
    console.log("Notificatoin data===========>", user);
}).catch((error) => {
    console.log("error: ", error);
})
}
console.log("Successfully sent with response: ", response)
}
})
}



