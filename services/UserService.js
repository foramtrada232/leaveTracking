// Database model
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const CYPHERKEY = process.env.CYPHERKEY;


/** 
 * @param {object} userData user details 
 */
const signup = (userData) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userData.email }).exec((err, foundUser) => {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' })
            } else if (foundUser) {
                resolve({ status: 409, message: 'Email already registerd.' })
            } else {
                UserModel.create(userData).then((user) => {
                    resolve({ status: 201, message: "Register successfully." });
                }).catch((error) => {
                    console.log("error: ", error);
                    reject({ status: 500, message: 'Not registerd. Please try again.' });
                })
            }
        })

    })
}

/**
 * @param {object} userData login details of user
 */
const login = (userData) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userData.email }, function (err, user) {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else if (!user) {
                reject({ status: 404, message: 'No user found' });
            } else if (user) {
                const passwordIsValid = bcrypt.compareSync(userData.password, user.password);
                if (!passwordIsValid) {
                    reject({ status: 401, message: "password is not valid", token: null });
                }
                const token = jwt.sign({ email: user.email }, CYPHERKEY, {
                    expiresIn: 86400
                });
                console.log("token:", token)
                resolve({ status: 200, message: "login successfull", token: token });
            } else {
                reject({ status: 404, message: 'Internal Server Error' });
            }
        });
    })
}


module.exports = {
    signup: signup,
    login: login,
}

