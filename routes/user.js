const express = require("express");
const router = express.Router();
const fileUpload = require('../middleware/fileUpload');
const authValidate = require('../middleware/authValidate');

// Controllers
const UserController = require("../controller/user.controller");

// Validations
const UserValidation = require("../validations/UserValidations");

router.post("/signup", UserController.signup);
router.post("/login",  UserController.login);
// router.use([validateToken]);
router.get("/get-all-users",authValidate.validateToken, UserController.getAllUsers);
router.get("/get-user-by-id",authValidate.validateToken, UserController.getSingleUser);
router.put("/update-user", fileUpload.upload('profilePhoto'), UserController.updateUser);

module.exports = router;
