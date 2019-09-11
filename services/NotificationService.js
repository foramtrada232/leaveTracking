const FCM = require('fcm-node')
const serverKey = "AAAAtqBIJy4:APA91bFU97lhNn3Nv3llmUl7tJigihHUAAkvan8CcCEzaSFiU4ZxN9udNx6jQQgaL2np6d_JFMppMD_h2pkxqcubXtiwEDfupEwEXaexQXFmoiizwPD15IurWtMK_xyQOIBlpKBanfJ_";
const fcm = new FCM(serverKey)

// const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//     to: 'dUzs8pLYycQ:APA91bF-te6FIHDjSg6bbUBUtpNfrjd6OHWqiNXAwlrVJPbom7RQTM1xiRh1_wvlpxPTc3F4AOtL0M9GChJSunI7XB5JiucsECsi7xvEDEYctSTwhi7lU8xZkTr3oRlM2GTTSSXK2jmv',
//     // collapse_key: 'AIzaSyBCNCtszUkbcgOURxvWFS_py4bs61HvfGk',

//     notification: {
//         title: 'Title of your push notification',
//         body: 'Body of your push notification'
//     }
// }
module.exports.sendNotification = (message) => {
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err)
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })

}