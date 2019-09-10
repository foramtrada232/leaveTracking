const express = require("express");

const router = express.Router();

// Controllers
const LeaveController = require("../controller/leave.controller");

// Validations
// const UserValidation = require("../validations/UserValidations");

router.post("/add-leave", LeaveController.addLeave);
router.get("/get-pending-leaves", LeaveController.getPendingLeaves);
router.get("/get-approved-leaves", LeaveController.getApprovedLeaves);
router.get("/get-all-leaves", LeaveController.getAllLeaves);
router.get("/get-leave-by-userId/:userId", LeaveController.getLeaveByUserId);
router.put("/leave-update-by-status", LeaveController.updateLeaveByStatus);
router.get("/get-leave-by-month", LeaveController.getLeaveByMonthAndUserId);
router.get("/get-leave-by-year",LeaveController.getLeavesByYearAndUserId);
router.put("/add-monthly-leave", LeaveController.leaveUpdateByMonthAndyear);
router.get("/tomrrow-not-present-users",LeaveController.tomorrowNotPresentUserList);
router.get("/get-today-not-present-users",LeaveController.getTodayNotPresentUsers);
router.post("/get-monthly-report",LeaveController.getMonthlyReportOfAllUsers);
router.post("/get-yearly-report",LeaveController.getYearlyReportOfAllUsers);
router.post("/leaveReason-by-userId",LeaveController.leaveReasonByUserId);

module.exports = router;
