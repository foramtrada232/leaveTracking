// Database model
const LeaveModel = require("../models/leave.model");
const UserModel = require("../models/user.model");

//service
const NotificationService = require('../services/NotificationService');

const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;
/**
 * @param {Object} leaveData details of user for passport
 */
const addLeave = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData)
        LeaveModel.create(leaveData).then((leave) => {
            /** Warning Notification when user apply more days leave then remaining leave */
            UserModel.findById({ _id: leaveData.userId }).exec((err, user) => {
                if (err) {
                    reject({ status: 500, message: 'User Not found.' })
                } else {
                    console.log("user:", user);
                    // if (leave.noOfDays > user.total_leave) {
                    //     const obj = {
                    //         'to': user.deviceToken,
                    //         'notification': {
                    //             title: 'Leave Application',
                    //             body: user.name + 'your 18 leave is completed.',
                    //         },
                    //         'data': {
                    //             // userData:user
                    //         }
                    //     }
                    //     console.log('obj============>', obj)
                    //     NotificationService.sendNotification(obj);
                    //     console.log("warning");
                    // } else {
                    //     console.log("No warning");
                    // }
                }
            })
            resolve({ status: 201, message: "Leave added successfully." });
        }).catch((error) => {
            console.log("error:", error);
            reject({ status: 500, message: 'Leave not added. Please try again.' });
        })
    })
}

/**Admin get all pending leaves */
const getPendingLeaves = () => {
    return new Promise((resolve, reject) => {
        LeaveModel.aggregate([{
            $match: { status: "pending" },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userId'
            }
        },
        {
            $project: {
                _id: 1,
                status: 1,
                tasks: 1,
                date: 1,
                noOfDays: 1,
                shortLeave: 1,
                reason: 1,
                extraHours: 1,
                userId: {
                    name: '$userId.name',
                    total_leave: '$userId.total_leave'
                }
            }
        },
        {
            $unwind: {
                path: '$userId',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$userId.name',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$userId.total_leave',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: { 'date.year': 1, 'date.month': 1, 'date.date': 1 }
        },
        ]).exec((err, resp) => {
            if (err) {
                console.log("err:", err)
                reject({ status: 500, message: "Pending Leave not found" });
            } else {
                resolve({ status: 200, message: "Get Leave Sucessfully.", data: resp });
            }
        })
    })
}

/**Admin get all approved leaves */
const getApprovedLeaves = () => {
    return new Promise((resolve, reject) => {
        LeaveModel.aggregate([
            {
                $match: { status: "Approved" }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    tasks: 1,
                    date: 1,
                    noOfDays: 1,
                    shortLeave: 1,
                    reason: 1,
                    extraHours: 1,
                    userId: {
                        name: '$userId.name',
                        total_leave: '$userId.total_leave'
                    }
                }
            },
            {
                $sort: { 'date.year': 1, 'date.month': 1, 'date.date': 1 }
            },
            {
                $unwind: {
                    path: '$userId',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$userId.name',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$userId.total_leave',
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).exec((err, resp) => {
            if (err) {
                reject({ status: 500, message: "Approved Leaves not found" });
            } else {
                resolve({ status: 200, message: "Get Leaves Sucessfully.", data: resp });
            }
        })
    })
}

/**Admin get all user's leaves */
const getAllLeaves = () => {
    return new Promise((resolve, reject) => {
        LeaveModel.aggregate([
            {
                $match: {}
            },
            {
                $sort: { 'date.year': 1, 'date.month': 1, 'date.date': 1 }
            },
        ]).exec((err, respond) => {
            if (err) {
                console.log("error", err);
                reject({ status: 500, message: "No Leave Found." });
            } else {
                resolve({ status: 200, message: "Get Leave Sucessfully.", data: respond });
            }
        })
    })
}

/**Get leave by user id */
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

/**Leave update by leave status */
const updateLeaveByStatus = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData)
        const day = "";
        LeaveModel.findByIdAndUpdate({ '_id': leaveData.leaveId }, { status: leaveData.status }, { upsert: true, new: true }).exec((err, leave) => {
            if (err) {
                reject({ status: 500, message: "Leave not updated." });
            } else {
                if (leave.status == "Approved") {
                    if (leave.noOfDays) {
                        day = Number(leave.noOfDays);
                    } else if (leave.shortLeave) {
                        day = Number(leave.shortLeave)
                    }
                    console.log("day:", day)
                    UserModel.findOneAndUpdate({ '_id': leave.userId }, { $inc: { total_leave: - day } })
                        .exec((err, user) => {
                            if (err) {
                                reject({ status: 500, message: "User not found." });
                            } else {
                                // let total_leave = user.total_leave - day;
                                console.log("USER:", user)
                                resolve({ status: 200, message: "Leave Approved Sucessfully.", data: leave });
                            }
                        })
                }
                resolve({ status: 200, message: "Leave updated Sucessfully.", data: leave });
            }
        })
    })
}

/**
 * @param {object} leaveData selected month and userId 
 */
const getLeaveByMonthAndUserId = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData)
        LeaveModel.aggregate([ 
            {
                $match : {'userId': leaveData.userId, 'date.month': leaveData.month, 'date.year': leaveData.year, 'status': "Approved"}
            },
            {
                $sort: { 'date.year': 1, 'date.month': 1, 'date.date': 1 }
            }
        ]).exec((err, leave) => {
            if (err) {
                reject({ status: 500, message: "Leave not updated." });
            } else {
                console.log("LEAVE:", leave)
                resolve({ status: 200, message: "Get Leave Sucessfully.", data: leave });
            }
        })
    })
}

/**Get leave by year and userId */
const getLeavesByYearAndUserId = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData)
        LeaveModel.aggregate([
            {
                $match: { 'userId': leaveData.userId, 'date.year': leaveData.year, 'status': "Approved" }
            },
            {
                $sort: { 'date.year': 1, 'date.month': 1, 'date.date': 1 }
            }
        ]).exec((err, leave) => {
            if (err) {
                console.log("err:", err)
                reject({ status: 500, message: "Leave not found." });
            } else {
                console.log("LEAVE:", leave)
                resolve({ status: 200, message: "Get Leave Sucessfully.", data: leave });
            }
        })
    })
}


/**
 * @param {object} currentDate 
 * today absent user's list*/
const getTodayNotPresentUsers = (currentDate) => {
    return new Promise((resolve, reject) => {
        console.log("currentDate:", currentDate);
        LeaveModel.find({ date: { 'year': currentDate.year, 'month': currentDate.month, 'date': currentDate.date }, status: 'Approved' })
            .exec((err, leave) => {
                if (err) {
                    console.log("err:", err)
                    reject({ status: 500, message: "Leave not found." });
                } else if (leave) {
                    LeaveModel.aggregate([
                        {
                            $match: { date: { 'year': currentDate.year, 'month': currentDate.month, 'date': currentDate.date }, status: 'Approved' }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'userId'
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                status: 1,
                                tasks: 1,
                                date: 1,
                                noOfDays: 1,
                                reason: 1,
                                extraHours: 1,
                                userId: {
                                    name: '$userId.name',
                                }
                            }
                        },
                        {
                            $unwind: {
                                path: '$userId',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $unwind: {
                                path: '$userId.name',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]).exec((err, leaves) => {
                        console.log("leaves:", leaves)
                        if (err) {
                            reject({ status: 500, message: "Leave not found." });
                        } else {
                            resolve({ status: 200, message: "Leave found.", data: leaves });
                        }
                    })
                    console.log("leave:", leave);
                } else {
                    reject({ status: 500, message: "Leave not found." });
                }
            })
    })
}

/**
 * @param {Number} month 
 * wise get report of all user's */
const getMonthlyReportOfAllUsers = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("month match thay che ke nai ====????????", leaveData);
        LeaveModel.aggregate([
            {
                $match: { 'date.month': leaveData.month, 'date.year': leaveData.year, 'status': "Approved" }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    date: 1,
                    noOfDays: 1,
                    shortLeave: 1,
                    reason: 1,
                    userId: {
                        name: '$userId.name',
                    }
                }
            },
            {
                $sort: { 'date.year': 1, 'date.month': 1, 'date.date': 1 }
            },
            {
                $unwind: {
                    path: '$userId',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$userId.name',
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).exec((err, report) => {
            if (err) {
                console.log("err:", err)
                reject({ status: 500, message: "Report not found." });
            } else {
                console.log("report:", report);
                resolve({ status: 200, message: "Report found Sucessfully.", data: report });
            }
        })
    })
}

/**
 * @param {Number} year 
 * wise get all user's leave report */
const getYearlyReportOfAllUsers = (year) => {
    return new Promise((resolve, reject) => {
        console.log("year", year);
        // LeaveModel.find({ 'date.year': year })
        LeaveModel.aggregate([
            {
                $match: { 'date.year': year, 'status': "Approved" }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    date: 1,
                    noOfDays: 1,
                    shortLeave: 1,
                    reason: 1,
                    userId: {
                        name: '$userId.name',
                    }
                }
            },
            {
                $sort: { 'date.year': 1, 'date.month': 1, 'date.date': 1 }
            },
            {
                $unwind: {
                    path: '$userId',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$userId.name',
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).exec((err, report) => {
            if (err) {
                console.log("err:", err)
                reject({ status: 500, message: "Report not found." });
            } else {
                console.log("report:", report);
                resolve({ status: 200, message: "Report found Sucessfully.", data: report });
            }
        })
    })
}

/**
 * @param {object} leaveData 
 * wise get leave reason*/
const leaveReasonByUserId = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData.year);
        LeaveModel.find({ 'userId': leaveData.userId, 'date.year': leaveData.year, 'date.month': leaveData.month, 'date.date': leaveData.date })
            .exec((err, leave) => {
                if (err) {
                    console.log("err:", err)
                    reject({ status: 500, message: "Leave not found." });
                } else if (leave) {
                    console.log("leave:", leave);
                    resolve({ status: 200, message: "Leave found.", data: leave });
                } else {
                    reject({ status: 500, message: "Leave not found." });
                }
            })
    })
}

/**
 * @param {object} userData wise edit profile
 */
const editLeaveByAdmin = (leaveData) => {
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ _id: leaveData.userId }, { $set: { total_leave: leaveData.total_leave } }, { upsert: true, new: true }).exec((err, updatedUser) => {
            if (err) {
                reject({ status: 500, message: "User not updated." });
            }
            else {
                console.log("updatedUser:", updatedUser)
                resolve({ status: 200, message: 'User Updated Sucessfully.', data: updatedUser });
            }
        })
    })
}

module.exports = {

    addLeave: addLeave,
    getPendingLeaves: getPendingLeaves,
    getAllLeaves: getAllLeaves,
    getLeaveByUserId: getLeaveByUserId,
    updateLeaveByStatus: updateLeaveByStatus,
    getLeaveByMonthAndUserId: getLeaveByMonthAndUserId,
    getLeavesByYearAndUserId: getLeavesByYearAndUserId,
    editLeaveByAdmin: editLeaveByAdmin,
    getTodayNotPresentUsers: getTodayNotPresentUsers,
    getMonthlyReportOfAllUsers: getMonthlyReportOfAllUsers,
    getYearlyReportOfAllUsers: getYearlyReportOfAllUsers,
    getApprovedLeaves: getApprovedLeaves,
    leaveReasonByUserId: leaveReasonByUserId,

}