// Service
const LeaveService = require('../services/LeaveService');

/**
 * Add passport details & passport
 */
addLeave = function (req, res) {
	console.log('req.body=================>', req.body);
	const leaveData =req.body;
	LeaveService.addLeave(leaveData).then((response) => {
		return res.status(200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
	})
},

getPendingLeaves = function(req,res){
    LeaveService.getPendingLeaves().then((response) => {
		return res.status(200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
	})
},

getAllLeaves = function(req,res){
    LeaveService.getAllLeaves().then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
    })
},

getLeaveByUserId = function(req,res){
    const userId = req.params.userId;
    LeaveService.getLeaveByUserId(userId).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
    })
}

updateLeaveByStatus = function(req,res){
    const leaveData = {
          leaveId : req.body.leaveId,
          status : req.body.status
    }
    LeaveService.updateLeaveByStatus(leaveData).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
    })
}

getLeaveByMonth = function(req,res) {
    const leaveData = {
        userId : req.body.userId,
        month : req.body.month
    }
    LeaveService.getLeaveByMonth(leaveData).then((response) => {
        return res.status(200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
    })
}

module.exports = {
    addLeave : addLeave,
    getPendingLeaves : getPendingLeaves,
    getAllLeaves : getAllLeaves,
    getLeaveByUserId : getLeaveByUserId,
    updateLeaveByStatus : updateLeaveByStatus,
    getLeaveByMonth : getLeaveByMonth
}