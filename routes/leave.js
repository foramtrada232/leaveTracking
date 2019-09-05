const express = require("express");

const router = express.Router();

// Controllers
const LeaveController = require("../controller/leave.controller");

// Validations
// const UserValidation = require("../validations/UserValidations");

router.post("/add-leave", LeaveController.addLeave);
router.get("/get-pendingLeave", LeaveController.getPendingLeaves);
router.get("/get-all-leaves", LeaveController.getAllLeaves);
router.get("/get-leave-by-userId/:userId", LeaveController.getLeaveByUserId);
router.put("/leave-update-by-status", LeaveController.updateLeaveByStatus);
router.get("/get-leave-by-month", LeaveController.getLeaveByMonth)

module.exports = router;
