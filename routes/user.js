const express = require("express");
const router = express.Router();
const fileUpload = require('../middleware/fileUpload');
const authValidate = require('../middleware/authValidate');
const withAuth = require('../middleware/withAuth');

// Controllers
const UserController = require("../controller/user.controller");

// Validations
const UserValidation = require("../validations/UserValidations");

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/logout",authValidate.validateToken,UserController.logOut);
// router.use([validateToken]);
router.get("/get-all-users",authValidate.validateToken, UserController.getAllUsers);
router.get("/get-user-by-id",authValidate.validateToken, UserController.getSingleUser);
router.get("/get-user-by-id/:userId",authValidate.validateToken, UserController.getSingleUserById);
router.get("/update-user", fileUpload.upload('profilePhoto'), UserController.updateUser);
router.get("/get-all-notification", UserController.getAllNotifications);

module.exports = router;
