// Database model
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const CYPHERKEY = process.env.CYPHERKEY;
const ObjectId = require('mongodb').ObjectId;


/** 
 * @param {object} userData user details 
 */
const signup = (userData) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userData.email }).exec((err, foundUser) => {
            if (err) {
                reject({ status: 500, message: 'Internal Server Error' })
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
        console.log("data:", userData)
        UserModel.findOneAndUpdate({ email: userData.email }, { $set: { deviceToken: userData.deviceToken } }, { upsert: true, new: true }).exec((err, user) => {
            if (err) {
                reject({ status: 500, message: 'Internal Server Error' });
            } else if (!user) {
                reject({ status: 404, message: 'No user found' });
            } else if (user) {
                console.log("password:", user)
                const passwordIsValid = bcrypt.compareSync(userData.password, user.password);
                console.log(passwordIsValid)
                // user.save();
                console.log(user.password + userData.password)
                if (!passwordIsValid) {
                    reject({ status: 401, message: "password is not valid", token: null });
                }
                const token = jwt.sign({ email: user.email }, CYPHERKEY, {
                    expiresIn: 86400
                });
                console.log("token:", token)
                resolve({ status: 200, message: "login successfull", token: token, designation: user.designation });
            } else {
                reject({ status: 404, message: 'Internal Server Error' });
            }
        })
    })
}

/**
 * @param {String} userId
 * Log Out
 */
const logOut = (email) => {
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ 'email': email }, { $set: { deviceToken: '' } }, { upsert: true, new: true }, function (err, user) {
            if (err) {
                reject({ status: 500, message: 'Internal Serevr Error' });
            } else {
                console.log('post============>', user);
                resolve({ status: 200, message: 'Log Out Successfully', data: user });
            }
        })
    })

}

 
  /**
   * @param {object} userId wise get user details 
   */
const getSingleUser = (user) => {
    return new Promise((resolve, reject) => {
        UserModel.aggregate([
            {
                $match: { 'email': user.email }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    name: 1,
                    phone: 1,
                    designation: 1,
                    location: 1,
                    dob: 1,
                    dateOfJoining: 1,
                    total_leave: 1,
                    profilePhoto: 1
                }
            }
        ]).exec((err, user) => {
            if (err) {
                reject({ status: 500, message: 'Internal Server Error' });
            } else if (user) {
                resolve({ status: 200, data: user[0] });
            } else {
                reject({ status: 404, message: 'No User found.' });
            }
        })
    })
}

/** Get All users */
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        UserModel.aggregate([
            {
                $match: {}
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    name: 1,
                    phone: 1,
                    designation: 1,
                    location: 1,
                    dateOfJoining: 1,
                    dob: 1,
                    profilePhoto: 1,
                    total_leave: 1
                }
            }
        ]).exec((err, users) => {
            if (err) {
                reject({ status: 500, message: 'Internal Server Error' });
            } else if (users) {
                console.log("users:", users)
                resolve({ status: 200, meassage: 'Get All Users.', data: users });
            } else {
                reject({ status: 404, message: 'No User found.' });
            }
        })
    })
}

/**
*@param {object} userData
*Update User Service
*/
const updateUser = (userData) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ name: userData.name })
            .exec((err, foundUser) => {
                if (err) {
                    console.log('err==================>', err);
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else if (!foundUser) {
                    UserModel.findOneAndUpdate({ _id: userData.userId }, { $set: { userName: userData.name } }, { upsert: true, new: true }, function (err, user) {
                        if (err) {
                            console.log('err================>', err)
                            reject({ status: 500, message: 'Internal Serevr Error' });
                        } else {
                            console.log('user======================>', user);
                            console.log("req.file", userData.file);
                            if (userData.file) {
                                userData.profilePhoto = userData.path;
                                console.log("path", userData.profilePhoto);
                            } else {
                                userData.profilePhoto = user.profilePhoto;
                                console.log("PATH:", userData.profilePhoto)
                            }
                            UserModel.findOneAndUpdate({ _id: userData.userId }, { $set: { name: userData.name, profilePhoto: userData.profilePhoto } }, { upsert: true, new: true }, function (err, user) {
                                if (err) {
                                    reject({ status: 500, message: 'Internal Serevr Error' });
                                } else {
                                    console.log("user========================>", user);
                                    resolve({ status: 200, message: 'user data Fetched', data: user });
                                    // res.status(200).send(user)
                                }
                            })
                        }
                    })
                } else {
                    console.log('foundUser==================>', foundUser);
                    if (foundUser._id == userData.userId) {
                        console.log("======================");
                        UserModel.findOneAndUpdate({ _id: userData.userId }, { $set: { name: userData.name } }, { upsert: true, new: true }, function (err, user) {
                            if (err) {
                                reject({ status: 500, message: 'Internal Serevr Error' });
                            } else {
                                console.log('user======================>', user);
                                console.log("req.file", userData.file);
                                if (userData.file) {
                                    userData.profilePhoto = userData.fileName;
                                } else {
                                    userData.profilePhoto = user.profilePhoto
                                }
                                UserModel.findOneAndUpdate({ _id: userData.userId }, { $set: { name: userData.name, profilePhoto: userData.profilePhoto } }, { upsert: true, new: true }, function (err, user) {
                                    if (err) {
                                        reject({ status: 500, message: 'Internal Serevr Error' });
                                    } else {
                                        console.log("user========================>", user);
                                        resolve({ status: 200, message: 'user data Fetched', data: user });
                                    }
                                })
                            }
                        })

                    } else {
                        console.log("Try other UserName")
                        resolve({ status: 409, message: 'Try other username.....' });
                        // res.status(409).send("Try other username.....")
                    }
                }
            })
    })

}
/**
 * Get user by userId
 * @param {String} userId 
 */
const getSingleUserById = (userId) => {
    console.log(userId);
    return new Promise((resolve, reject) => {
        UserModel.aggregate([
            {
                $match: { '_id': ObjectId(userId) }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    name: 1,
                    phone: 1,
                    designation: 1,
                    location: 1,
                    dob: 1,
                    dateOfJoining: 1,
                    salary: 1,
                    profilePhoto: 1,
                    total_leave: 1
                }
            },
            // {
            //     $unwind: {
            //         path: '$root',
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
        ]).exec((err, user) => {
            if (err) {
                reject({ status: 500, message: 'Internal Server Error' });
            } else if (user) {
                console.log("user=======>", user)
                resolve({ status: 200, data: user[0] });
            } else {
                reject({ status: 404, message: 'No User found.' });
            }
        })
    })
}

module.exports = {
    signup: signup,
    login: login,
    logOut: logOut,
    getSingleUser: getSingleUser,
    getAllUsers: getAllUsers,
    updateUser: updateUser,
    getSingleUserById: getSingleUserById
}

