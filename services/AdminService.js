// Database model
const AdminModel = require("../models/admin.model");
const UserModel = require("../models/user.model");

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const CYPHERKEY = process.env.CYPHERKEY;
const clc = require("cli-color");
const SALT_WORK_FACTOR = 10;

module.exports = {

    /**
     * @param {object} adminData login details of admin
     */
    login: (adminData) => {
        return new Promise((resolve, reject) => {
            console.log("adminData:", adminData)
            AdminModel.findOne({ email: adminData.email }, function (err, admin) {
                console.log("admin:", admin);
                if (err) {
                    console.log("err:",err);
                    reject({ status: 500, message: 'Internal Serevr Error' });
                } else if (!admin) {
                    reject({ status: 404, message: 'No admin found' });
                } else if (admin) {
                    const passwordIsValid = bcrypt.compareSync(adminData.password, admin.password);
                    console.log('valid password:', passwordIsValid);
                    if (!passwordIsValid) {
                        reject({ status: 401, message: "password is not valid", token: null });
                    }
                    const token = jwt.sign({ email: admin.email }, CYPHERKEY, {
                        expiresIn: 86400
                    });
                    // const response = { data: admin, token: token };
                    resolve({ status: 200, message: "login successfull",token:token});
                } else {
                    reject({ status: 404, message: 'Internal Server Error' });
                }
            });
        })
    },

    // /**
    //  * @param {object} userId wise get user details 
    //  */
    // getSingleUser: (userId) => {
    //     return new Promise((resolve, reject) => {
    //         UserModel.aggregate([
    //             {
    //                 $match: { '_id': ObjectId(userId) }
    //             },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     email: 1,
    //                     name: 1,
    //                     phone: 1,
    //                     designation: 1,
    //                     location: 1,
    //                     dob: 1,
    //                     dateOfJoining: 1,
    //                     salary: 1,
    //                 }
    //             }
    //         ]).exec((err, user) => {
	// 			if (err) {
	// 				reject({ status: 500, message: 'Internal Serevr Error' });
	// 			} else if (user){
    //                 resolve({ status: 200, data:user});
	// 			} else {
    //                 reject({ status: 404, message: 'No User found.' });
	// 			}
	// 		})
    //     })
    // }
}

