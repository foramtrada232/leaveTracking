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
        LeaveModel.create(leaveData).then((leave) => {
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
                }
                else {
                    resolve({ status: 200, message: "Get Leave Sucessfully.", data: resp });
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
                }
                else {
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
                }
                else {
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
                resolve({ status: 200, message: "Leave updated Sucessfully.", data: leave });
            }
        })
    })
}

const getLeaveByMonth = (leaveData) => {
    return new Promise((resolve, reject) => {
        console.log("leaveData:", leaveData)
        LeaveModel.aggregate([
            {
                $match: {
                    'userId': ObjectId(leaveData.userId)
                }
            }
        ]).exec((err, leave) => {
            if (err) {
                reject({ status: 500, message: "Leave not updated." });
            } else {
                for (let i = 0; i < leave.length; i++) {
                    if (leave[i].date.getMonth() == leaveData.month) {
                        console.log("month:", leave[i])
                    }
                }
                resolve({ status: 200, message: "Get Leave Sucessfully.", data: leave });
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
    getLeaveByMonth: getLeaveByMonth
}
