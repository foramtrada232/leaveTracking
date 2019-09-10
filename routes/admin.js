const express = require("express");
const router = express.Router();
const withAuth = require('../middleware/withAuth');

// Controllers
const AdminController = require("../controller/admin.controller");

// Validations
const AdminValidation = require("../validations/AdminValidations");

router.post("/signup",AdminController.signUp);
router.post("/login", AdminValidation.login,AdminController.login);
// router.get("/get-all-users",withAuth,AdminController.getAllUsers);
// router.get('/get-user-by-id/:userId',AdminController.getSingleUser);


module.exports = router;
