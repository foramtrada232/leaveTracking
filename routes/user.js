const express = require("express");

const router = express.Router();

// Controllers
const UserController = require("../controller/user.controller");

// Validations
const UserValidation = require("../validations/UserValidations");

router.post("/signup", UserController.signup);
router.post("/login", UserValidation.login, UserController.login);

module.exports = router;
