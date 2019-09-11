// Service
const LeaveService = require('../services/LeaveService');
const NotificationService = require('../services/NotificationService');

//Model
const UserModel = require("../models/user.model");

/**
 * Add passport details & passport
 */
addLeave = function (req, res) {
    let date = req.body.date.split("/");
    var result = date.map(Number);
    UserModel.findOne({'email':req.user.email}).exec((err,user) => {
        if (err) return rea.status(500).json({ message: 'Login User not found.' })
        else {
            const userId = user._id;
            const leaveData = {
                date: { year: result[2], month: result[0], date: result[1] },
                noOfDays: req.body.noOfDays,
                reason: req.body.reason,
                extraHours: req.body.extraHours,
                userId: userId
            }
            console.log("REQUESTED USER:",req.user);
            console.log("leaveData:", leaveData)
            LeaveService.addLeave(leaveData).then((response) => {
                UserModel.find({ designation: 'admin' }).exec((err, admin) => {
                    if (err) return rea.status(500).json({ message: 'Admin not found.' })
                    else {
                        console.log("admin:", admin)
                        // if (admin.deviceToken) {
                        UserModel.find({ '_id': leaveData.userId }).exec((err, user) => {
                            if (user) {
                                console.log("user:", user)
                                const obj = {
                                    'to': admin[0].email,
                                    'notification': {
                                        title: 'Leave Notification',
                                        body: user[0].name + ' has applied for leave.',
                                    },
                                    'data': {
                                        // profilePhoto: userres.data.profilePhoto,
                                        // userData: userres.data
                                    }
                                }
                                console.log('obj============>', obj)
                                NotificationService.sendNotification(obj);
                            }
                        })
                        // }
                    }
                })
                return res.status(200).json({ message: response.message, data: response.data });
            }).catch((error) => {
                console.log('error:', error);
                return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
            })
        }
    })
},

    getPendingLeaves = function (req, res) {
        LeaveService.getPendingLeaves().then((response) => {
            return res.status(200).json({ message: response.message, data: response.data });
        }).catch((error) => {
            console.log('error:', error);
            return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
        })
    },

    getApprovedLeaves = function (req, res) {
        LeaveService.getApprovedLeaves().then((response) => {
            return res.status(200).json({ message: response.message, data: response.data });
        }).catch((error) => {
            console.log('error:', error);
            return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
        })
    }

getAllLeaves = function (req, res) {
    LeaveService.getAllLeaves().then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
},

    getLeaveByUserId = function (req, res) {
        const userId = req.params.userId;
        LeaveService.getLeaveByUserId(userId).then((response) => {
            return res.status(200).json({ message: response.message, data: response.data });
        }).catch((error) => {
            console.log('error:', error);
            return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
        })
    }

updateLeaveByStatus = function (req, res) {
    const leaveData = {
        leaveId: req.body.leaveId,
        status: req.body.status
    }
    LeaveService.updateLeaveByStatus(leaveData).then((response) => {
        console.log("RESPONSE:", response);
        UserModel.find({ '_id': response.data.userId }).exec((err, user) => {
            console.log("userrrr:",user)
            if (user) {
                if (response.data.status == 'Approved') {
                    console.log("user:", user)
                    const obj = {
                        'to': user[0].email,
                        'notification': {
                            title: 'Leave Notification',
                            body: 'Your leave has been approved.',
                        },
                        'data': {
                            // profilePhoto: userres.data.profilePhoto,
                            // userData: userres.data
                        }
                    }
                    console.log('obj============>', obj)
                    NotificationService.sendNotification(obj);
                } else {
                    const obj = {
                        'to': user[0].email,
                        'notification': {
                            title: 'Leave Notification',
                            body: 'Your leave has been rejected.',
                        },
                        'data': {
                            // profilePhoto: userres.data.profilePhoto,
                            // userData: userres.data
                        }
                    }
                    console.log('obj============>', obj)
                    NotificationService.sendNotification(obj);
                }

            }
        })
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

getLeaveByMonthAndUserId = function (req, res) {
    const leaveData = {
        userId: req.body.userId,
        month: Number(req.body.month)
    }
    LeaveService.getLeaveByMonthAndUserId(leaveData).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

getLeavesByYearAndUserId = function (req, res) {
    const leaveData = {
        userId: req.body.userId,
        year: Number(req.body.year)
    }
    LeaveService.getLeavesByYearAndUserId(leaveData).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

leaveUpdateByMonthAndyear = function (req, res) {
    let currentDate = new Date().toLocaleDateString();
    let date = currentDate.split("/");
    console.log("response:", date)
    let previous = new Date();
    previous.setDate(previous.getDate() - 1);
    let year = previous.getFullYear();
    console.log(year);
    const leaveData = {
        date: date,
        year: year
    }
    LeaveService.leaveUpdateByMonthAndyear(leaveData).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

tomorrowNotPresentUserList = function (req, res) {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    console.log("date:", nextDay);
    let month = nextDay.getMonth();
    let date = nextDay.getDate();
    let year = nextDay.getFullYear();
    console.log("DATE:", date);
    // let array = Object.values(tomorrow);
    const leaveDate = {
        year: year,
        month: month + 1,
        date: date,
    }
    console.log("Month:", typeof leaveDate.month);
    LeaveService.tomorrowNotPresentUserList(leaveDate).then((response) => {
        console.log("response",response);
        // UserModel.find({designation : 'admin'}).exec((err,admin) => {
        //     if (admin) {
        //                 const obj = {
        //                     'to': admin[0].email,
        //                     'notification': {
        //                         title: 'Leave Notification',
        //                         body: user[0].name + ' has applied for leave.',
        //                     },
        //                     'data': {
        //                         // profilePhoto: userres.data.profilePhoto,
        //                         // userData: userres.data
        //                     }
        //                 }
        //                 console.log('obj============>', obj)
        //                 NotificationService.sendNotification(obj);
        //     }
        // })
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

getTodayNotPresentUsers = function (req, res) {
    let today = new Date();
    console.log("today:", today);
    let month = today.getMonth();
    let date = today.getDate();
    let year = today.getFullYear();
    console.log("DATE:", date);
    const currentDate = {
        year: year,
        month: month + 1,
        date: date,
    }
    console.log("currentDate:", typeof currentDate.year);
    LeaveService.getTodayNotPresentUsers(currentDate).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

getMonthlyReportOfAllUsers = function (req, res) {
    let month = Number(req.body.month);
    LeaveService.getMonthlyReportOfAllUsers(month).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

getYearlyReportOfAllUsers = function (req, res) {
    let year = Number(req.body.year);
    LeaveService.getYearlyReportOfAllUsers(year).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

leaveReasonByUserId = function (req, res) {
    let today = new Date();
    console.log("today:", today);
    let month = today.getMonth();
    let date = today.getDate();
    let year = today.getFullYear();
    console.log("DATE:", date);
    const leaveData = {
        year: year,
        month: month + 1,
        date: date,
        userId: req.body.userId
    }
    LeaveService.leaveReasonByUserId(leaveData).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
}

module.exports = {

    addLeave: addLeave,
    getPendingLeaves: getPendingLeaves,
    getApprovedLeaves: getApprovedLeaves,
    getAllLeaves: getAllLeaves,
    getLeaveByUserId: getLeaveByUserId,
    updateLeaveByStatus: updateLeaveByStatus,
    getLeaveByMonthAndUserId: getLeaveByMonthAndUserId,
    getLeavesByYearAndUserId: getLeavesByYearAndUserId,
    leaveUpdateByMonthAndyear: leaveUpdateByMonthAndyear,
    tomorrowNotPresentUserList: tomorrowNotPresentUserList,
    getTodayNotPresentUsers: getTodayNotPresentUsers,
    getMonthlyReportOfAllUsers: getMonthlyReportOfAllUsers,
    getYearlyReportOfAllUsers: getYearlyReportOfAllUsers,
    leaveReasonByUserId: leaveReasonByUserId


}



// if (date[3] != year && date[1] == 1) {
//     UserModel.updateMany({ $inc: { total_leave: 1.5 } }).exec((err, user) => {
//         if (err) {
//             console.log("err:", err)
//             return res.status(500).send(err);
//         } else {
//         if(date[3] != year){
//            UserModel.find().then((users) => {
//                console.log("first user:",users)
//                users.forEach((user) => {
//                    var updated = Math.ceil(user.total_leave/2);
//                    console.log("updated:",updated)
//                    UserModel.update({_id:user._id},{$set:{total_leave:updated}}).exec((err,upUser) => {
//                        if (err) {
//                            console.log("err:",err);
//                        } else {
//                            console.log("upUser:",upUser)
//                        }
//                    })
//                    console.log("USER:",user);
//                })
//             })
//                 //  UserModel.update({ $divide:  [total_leave, 2] })
//                 //     .exec((err, user) => {
//                 //         if (err) {
//                 //             console.log("ERROR:",err)
//                 //             return res.status(500).json({ message:'Internal server error' });
//                 //         } else {
//                 //             console.log("USER:", user)
//                 //             return res.status(200).json({ message: 'Updated Sucessfully.' });
//                 //         }
//                 //     })
//         }
//         }
//     })


// UserModel.aggregate([
    //     {$match : {}},
    //     { $project: { name: 1, total_leave: { $divide: [ "$total_leave", 2 ] } } }
    //     //  { $divide:  {total_leave: 2 }})
    // ]).exec((err, user) => {
    //                 if (err) {
    //                     console.log("ERROR:",err)
    //                     return res.status(500).json({ message:'Internal server error' });
    //                 } else {
    //                     console.log("USER:", user)
    //                     return res.status(200).json({ message: 'Updated Sucessfully.' });
    //                 }
    //             })