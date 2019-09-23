// Service
const LeaveService = require('../services/LeaveService');
const NotificationService = require('../services/NotificationService');
var cron = require('node-cron');

//Model
const UserModel = require("../models/user.model");

/**
 * user add leave
 */
// addLeave = function (req, res) {
//     console.log("===============",req.body)
//     // let date = req.body.date.split("/");
//     let date = req.body.date.split("T");

// console.log("+++++++++",date[0].split('-'))
//     console.log('date=>',date,req.body)
//     // var result = date.map(Number);
//     const result = date[0].split("-")
//     console.log("result=======>",result)
//     UserModel.findOne({ 'email': req.user.email }).exec((err, user) => {
//         if (err) return rea.status(500).json({ message: 'Login User not found.' })
//         else {
//             console.log("in else==========>",req.body)
//             const userId = user._id;
//             if (req.body.extraHours) {
//                 console.log("HOURS:", req.body.extraHours);
//                 noOfHours = req.body.noOfDays * 8 - req.body.extraHours;
//                 console.log("noOfHours:", noOfHours)
//             } else {
//                 console.log("req.body==in else======>",req.body.noOfDays);
//                 noOfHours = req.body.noOfDays * 8;
//                 console.log("noOfHours:", noOfHours)
//             }
//             const leaveData = {
//                 // date: { year: result[2], month: result[0], date: result[1] },
//                 date: { year: result[0], month: result[1], date: result[2] },
//                 noOfDays: noOfHours,
//                 reason: req.body.reason,
//                 extraHours: req.body.extraHours,
//                 userId: userId
//             }
//             console.log("REQUESTED USER:", req.user);
//             console.log("leaveData:", leaveData)
//             LeaveService.addLeave(leaveData).then((response) => {
//                 UserModel.find({ designation: 'admin' }).exec((err, admin) => {
//                     if (err) return rea.status(500).json({ message: 'Admin not found.' })
//                     else {
//                         console.log("admin:", admin)
//                         // if (admin.deviceToken) {
//                         UserModel.find({ '_id': leaveData.userId }).exec((err, user) => {
//                             if (user) {
//                                 console.log("user:", user)
//                                 const obj = {
//                                     'to': admin[0].email,
//                                     'notification': {
//                                         title: 'Leave Notification',
//                                         body: user[0].name + ' has applied for leave.',
//                                     },
//                                     'data': {
//                                         // profilePhoto: userres.data.profilePhoto,
//                                         // userData: userres.data
//                                     }
//                                 }
//                                 console.log('obj============>', obj)
//                                 NotificationService.sendNotification(obj);
//                             }
//                         })
//                         // }
//                     }
//                 })
//                 return res.status(200).json({ message: response.message, data: response.data });
//             }).catch((error) => {
//                 console.log('error:', error);
//                 return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
//             })
//         }
//     })
// },

addLeave = function (req, res) {
    console.log("===============",req.body)
    // let date = req.body.date.split("/");
    let date = req.body.date.split("T");

console.log("+++++++++",date[0].split('-'))
    console.log('date=>',date,req.body)
    // var result = date.map(Number);
    const result = date[0].split("-")
    console.log("result=======>",result)
    UserModel.findOne({ 'email': req.user.email }).exec((err, user) => {
        if (err) return rea.status(500).json({ message: 'Login User not found.' })
        else {
            console.log("in else==========>",req.body)
            const userId = user._id;
            if (req.body.extraHours) {
                console.log("HOURS:", req.body.extraHours);
                noOfHours = req.body.noOfDays * 8 - req.body.extraHours;
                console.log("noOfHours:", noOfHours)
            } else {
                console.log("req.body==in else======>",req.body.noOfDays);
                noOfHours = req.body.noOfDays * 8;
                console.log("noOfHours:", noOfHours)
            }
            const leaveData = {
                // date: { year: result[2], month: result[0], date: result[1] },
                date: { year: result[0], month: result[1], date: result[2] },
                noOfDays: noOfHours,
                reason: req.body.reason,
                extraHours: req.body.extraHours,
                userId: userId
            }
            console.log("REQUESTED USER:", req.user);
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

    // get pending leave
    getPendingLeaves = function (req, res) {
        LeaveService.getPendingLeaves().then((response) => {
            return res.status(200).json({ message: response.message, data: response.data });
        }).catch((error) => {
            console.log('error:', error);
            return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
        })
    },

    /**Get all approved leave */
    getApprovedLeaves = function (req, res) {
        LeaveService.getApprovedLeaves().then((response) => {
            return res.status(200).json({ message: response.message, data: response.data });
        }).catch((error) => {
            console.log('error:', error);
            return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
        })
    }

/**get all leaves */
getAllLeaves = function (req, res) {
    LeaveService.getAllLeaves().then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
    }).catch((error) => {
        console.log('error:', error);
        return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
    })
},
    /**get leave by userId */
    getLeaveByUserId = function (req, res) {
        const userId = req.params.userId;
        LeaveService.getLeaveByUserId(userId).then((response) => {
            return res.status(200).json({ message: response.message, data: response.data });
        }).catch((error) => {
            console.log('error:', error);
            return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
        })
    }

/**Leave update by leave status */
updateLeaveByStatus = function (req, res) {
    const leaveData = {
        leaveId: req.body.leaveId,
        status: req.body.status
    }
    LeaveService.updateLeaveByStatus(leaveData).then((response) => {
        console.log("RESPONSE:", response);
        UserModel.find({ '_id': response.data.userId }).exec((err, user) => {
            console.log("userrrr:", user)
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

/**Get leave by month and userId*/
getLeaveByMonthAndUserId = function (req, res) {
    console.log("REQUESTED USER:", req.user)
    UserModel.findOne({ 'email': req.user.email }).exec((err, user) => {
        if (err) return rea.status(500).json({ message: 'Login User not found.' })
        else {
            const userId = user._id;
            const leaveData = {
                userId: userId,
                month: Number(req.body.month),
                year: Number(req.body.year)
            }
            console.log("LEAVEDATA:", leaveData)
            LeaveService.getLeaveByMonthAndUserId(leaveData).then((response) => {
                return res.status(200).json({ message: response.message, data: response.data });
            }).catch((error) => {
                console.log('error:', error);
                return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
            })
        }
    })
}

/**Get leave by year and userId */
getLeavesByYearAndUserId = function (req, res) {
    console.log("REQUESTED USER:", req.user)
    UserModel.findOne({ 'email': req.user.email }).exec((err, user) => {
        if (err) return rea.status(500).json({ message: 'Login User not found.' })
        else {
            const userId = user._id;
            const leaveData = {
                userId: userId,
                year: Number(req.body.year)
            }
            LeaveService.getLeavesByYearAndUserId(leaveData).then((response) => {
                return res.status(200).json({ message: response.message, data: response.data });
            }).catch((error) => {
                console.log('error:', error);
                return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
            })
        }
    })
}

/**Every month or year update user's leave */
cron.schedule('0 0 0 1 1-12 * ', leaveUpdateByMonthAndyear = () => {
        return new Promise((resolve, reject) => {
            let currentDate = new Date('1/1/2018').toLocaleDateString();
            let date = currentDate.split("/");
            let dateToNumber = date.map(Number);
            console.log("response:", dateToNumber)
            let previous = new Date();
            previous.setDate(previous.getDate() - 1);
            let year = previous.getFullYear();
            console.log(year);
            const leaveData = {
                date: dateToNumber,
                year: year
            }
            if (leaveData.date[2] != leaveData.year) {
                console.log("if calling=========>")
                UserModel.find().then((users) => {
                    users.forEach((user) => {
                        let updated = Math.ceil(user.total_leave / 2);
                        console.log("updated:", updated)
                        UserModel.update({ _id: user._id }, { $set: { total_leave: updated } }, { upsert: true, new: true }).exec((err, upUser) => {
                            if (err) {
                                console.log("err:", err);
                                reject({ status: 500, message: "Leave not updated." });
                            } else {
                                console.log("upUser:", upUser);
                            }
                        })
                    })
                    UserModel.updateMany({ $inc: { total_leave: 12 } }).exec((err, user) => {
                        if (err) {
                            console.log("err:", err)
                            reject({ status: 500, message: "Leave not updated." });
                        } else {
                            console.log("USER:", user);
                            resolve({ status: 200, message: "Leave updated Sucessfully.", data: user });
                        }
                    })
                })
            } else if (leaveData.date[1] == 1) {
                console.log("else if calling===========>")
                UserModel.updateMany({ $inc: { total_leave: 12 } }).exec((err, user) => {
                    if (err) {
                        console.log("err:", err)
                        reject({ status: 500, message: "Leave not updated." });
                    } else {
                        console.log("USER:", user);
                        resolve({ status: 200, message: "Leave updated Sucessfully.", data: user });
                    }
                })
            } else {
                console.log("leave not updated.")
                resolve({ status: 200, message: "Leave not updated." });
            }
        })
    })

/** Get Tomorrow not present user's list and send notification to admin */
tomorrowNotPresentUserList = function (req, res) {
            let nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            console.log("date:", nextDay);
            let month = nextDay.getMonth();
            let date = nextDay.getDate();
            let year = nextDay.getFullYear();
            console.log("DATE:", date);
            const leaveDate = {
                year: year,
                month: month + 1,
                date: date,
            }
            console.log("Month:", typeof leaveDate.month);
            LeaveService.tomorrowNotPresentUserList(leaveDate).then((response) => {
                console.log("response", response);
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

/**Get list of today not present users */
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

/**Get monthly leave report of all users */
getMonthlyReportOfAllUsers = function (req, res) {
    console.log("body",req.body)
            let month = Number(req.body.month);
            const leaveData = {
                month: Number(req.body.month),
                year: Number(req.body.year)
            }
            console.log("LEAVEDATA:", leaveData)
            LeaveService.getMonthlyReportOfAllUsers(leaveData).then((response) => {
                return res.status(200).json({ message: response.message, data: response.data });
            }).catch((error) => {
                console.log('error:', error);
                return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
            })
        }

/**Get yearly leave report of all user's */
getYearlyReportOfAllUsers = function (req, res) {
            let year = Number(req.body.year);
            LeaveService.getYearlyReportOfAllUsers(year).then((response) => {
                return res.status(200).json({ message: response.message, data: response.data });
            }).catch((error) => {
                console.log('error:', error);
                return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'Internal server error' });
            })
        }

/**Get leave reason of particular leave of particular user */
leaveReasonByUserId = function (req, res) {
            let today = new Date('8/20/2019');
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
