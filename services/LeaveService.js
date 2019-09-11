// Database model
const LeaveModel = require("../models/leave.model");
const UserModel = require("../models/user.model");

const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;

/**
 * @param {Object} leaveData details of user for passport
 */
const addLeave = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:",leaveData)
        LeaveModel.create(leaveData).then((leave) => {
            /** Warning Notification when user apply more days leave then remaining leave */
            UserModel.findById({ _id: leaveData.userId }).exec((err, user) => {
                if (err) {
                    reject({ status: 500, message: 'User Not found.' })
                } else {
                    console.log("user:", user);
                    if (leave.noOfDays > user.total_leave) {
                        console.log("warning");
                    } else {
                        console.log("No warning");
                    }
                }
            })
            resolve({ status: 201, message: "Leave added successfully." });
        }).catch((error) => {
            console.log("error:", error);
            reject({ status: 500, message: 'Leave not added. Please try again.' });
        })
    })
}

const getPendingLeaves = () => {
    return new Promise((resolve, reject) => {
        LeaveModel.find({ status: "pending" })
            .exec((err, resp) => {
                if (err) {
                    reject({ status: 500, message: "Pending Leave not found" });
                } else {
                    resolve({ status: 200, message: "Get Leave Sucessfully.", data: resp });
                }
            })
    })
}

const getApprovedLeaves = () => {
    return new Promise((resolve, reject) => {
        LeaveModel.find({ status: "Approved" })
            .exec((err, resp) => {
                if (err) {
                    reject({ status: 500, message: "Approved Leaves not found" });
                } else {
                    resolve({ status: 200, message: "Get Leaves Sucessfully.", data: resp });
                }
            })
    })
}

const getAllLeaves = () => {
    return new Promise((resolve, reject) => {
        LeaveModel.find({})
            .exec((err, respond) => {
                if (err) {
                    console.log("error", err);
                    reject({ status: 500, message: "No Leave Found." });
                } else {
                    resolve({ status: 200, message: "Get Leave Sucessfully.", data: respond });
                }
            })
    })
}

const getLeaveByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        LeaveModel.find({ userId: userId })
            .exec((err, respond) => {
                if (err) {
                    console.log("error", err);
                    reject({ status: 500, message: "No Leave Found." });
                } else {
                    resolve({ status: 200, message: "Get Leave Sucessfully.", data: respond });
                }
            })
    })
}

const updateLeaveByStatus = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData)
        LeaveModel.findByIdAndUpdate({ '_id': leaveData.leaveId }, { status: leaveData.status }, { upsert: true, new: true }).exec((err, leave) => {
            if (err) {
                reject({ status: 500, message: "Leave not updated." });
            } else {
                if (leave.status == "Approved") {
                    const day = leave.noOfDays;
                    console.log("day:",day)
                    UserModel.findOneAndUpdate({ '_id': leave.userId }, { $inc: { total_leave: - day } })
                        .exec((err, user) => {
                            if (err) {
                                reject({ status: 500, message: "User not found." });
                            } else {
                                // let total_leave = user.total_leave - day;
                                console.log("USER:", user)
                                resolve({ status: 200, message: "Leave updated Sucessfully.", data: leave });
                            }
                        })
                }
                resolve({ status: 200, message: "Leave updated Sucessfully.", data: leave });
            }
        })
    })
}

const getLeaveByMonthAndUserId = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData)
        LeaveModel.find({'userId':leaveData.userId,'date.month': leaveData.month}).exec((err, leave) => {
            if (err) {
                reject({ status: 500, message: "Leave not updated." });
            } else {
                console.log("LEAVE:",leave)
                resolve({ status: 200, message: "Get Leave Sucessfully.", data: leave });
            }
        })
    })
}

const getLeavesByYearAndUserId = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData)
        LeaveModel.find({'userId':leaveData.userId,'date.year':leaveData.year}).exec((err, leave) => {
            if (err) {
                reject({ status: 500, message: "Leave not found." });
            } else {
                console.log("LEAVE:",leave)
                resolve({ status: 200, message: "Get Leave Sucessfully.", data: leave });
            }
        })
    })
}

const leaveUpdateByMonthAndyear = (leaveData) => {
    return new Promise((resolve, reject) => {
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
                UserModel.updateMany({ $inc: { total_leave: 1.5 } }).exec((err, user) => {
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
            UserModel.updateMany({ $inc: { total_leave: 1.5 } }).exec((err, user) => {
                if (err) {
                    console.log("err:", err)
                    reject({ status: 500, message: "Leave not updated." });
                } else {
                    console.log("USER:", user);
                    resolve({ status: 200, message: "Leave updated Sucessfully.", data: user });
                }
            })
        } else {
            resolve({ status: 200, message: "Leave not updated." });
        }
    })
}

const tomorrowNotPresentUserList = (leaveDate) => {
    return new Promise((resolve, reject) => {
        LeaveModel.find( {'date.year':leaveDate.year, 'date.month': leaveDate.month, 'date.date': leaveDate.date, 'status': 'Approved' })
        .exec((err, leave) => {
            if (err) {
                console.log("err:",err)
                reject({ status: 500, message: "Leave not found." });
            } else if(leave){
                console.log("leave:", leave);
                resolve({ status: 200, message: "Leave found." ,data: leave});
            } else {
                reject({ status: 500, message: "Leave not found." }); 
            }
        })
    })
}

const getTodayNotPresentUsers = (currentDate) => {
    return new Promise((resolve, reject) => {
        console.log("currentDate:",currentDate.year);
        LeaveModel.find( { date: { 'year':currentDate.year, 'month': currentDate.month, 'date': currentDate.date } })
        .exec((err, leave) => {
            if (err) {
                console.log("err:",err)
                reject({ status: 500, message: "Leave not found." });
            } else if(leave){
                console.log("leave:", leave);
                resolve({ status: 200, message: "Leave found." ,data: leave});
            } else {
                reject({ status: 500, message: "Leave not found." });
            }
        })
    })
}

const getMonthlyReportOfAllUsers = (month) => {
    return new Promise((resolve, reject) => {
        console.log("month",month);
        LeaveModel.find( {'date.month': month})
        .exec((err, report) => {
            if (err) {
                console.log("err:",err)
                reject({ status: 500, message: "Report not found." });
            } else {
                console.log("report:", report);
                resolve({ status: 200, message: "Report found Sucessfully." ,data: report});
            }
        })
    })
}

const getYearlyReportOfAllUsers = (year) => {
    return new Promise((resolve, reject) => {
        console.log("year",year);
        LeaveModel.find( {'date.year': year})
        .exec((err, report) => {
            if (err) {
                console.log("err:",err)
                reject({ status: 500, message: "Report not found." });
            } else {
                console.log("report:", report);
                resolve({ status: 200, message: "Report found Sucessfully." ,data: report});
            }
        })
    })
}

const leaveReasonByUserId = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:",leaveData.year);
        LeaveModel.find( {'userId':leaveData.userId, 'date.year':leaveData.year, 'date.month': leaveData.month, 'date.date': leaveData.date })
        .exec((err, leave) => {
            if (err) {
                console.log("err:",err)
                reject({ status: 500, message: "Leave not found." });
            } else if(leave){
                console.log("leave:", leave);
                resolve({ status: 200, message: "Leave found." ,data: leave});
            } else {
                reject({ status: 500, message: "Leave not found." });
            }
        })
    })
}

module.exports = {
    addLeave : addLeave,
    getPendingLeaves : getPendingLeaves,
    getAllLeaves : getAllLeaves,
    getLeaveByUserId : getLeaveByUserId,
    updateLeaveByStatus : updateLeaveByStatus,
    getLeaveByMonthAndUserId : getLeaveByMonthAndUserId,
    getLeavesByYearAndUserId : getLeavesByYearAndUserId,
    leaveUpdateByMonthAndyear : leaveUpdateByMonthAndyear,
    tomorrowNotPresentUserList : tomorrowNotPresentUserList,
    getTodayNotPresentUsers : getTodayNotPresentUsers,
    getMonthlyReportOfAllUsers : getMonthlyReportOfAllUsers,
    getYearlyReportOfAllUsers : getYearlyReportOfAllUsers,
    getApprovedLeaves : getApprovedLeaves,
    leaveReasonByUserId : leaveReasonByUserId,

}
