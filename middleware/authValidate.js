const jwt = require("jsonwebtoken");
/**
 * Function To Validation Of JWT Token
 * @param {authorization} - AccessToken
 * @returns {User} - Decoded User Detail
 */
module.exports.validateToken = async (req, res, next) => {
    const authorization  = req.headers.token;
    console.log("authorization:",authorization)
    new Promise(async (resolve, reject) => {
        if (authorization && authorization !== "") {
            jwt.verify(authorization, process.env.CYPHERKEY, (err, decoded) => {
                if (err) {
                    console.log("errrrrr:",err)
                    reject({ status: false, message: "Failed to authenticate token.", });
                } else {
                    req.user = decoded;
                    resolve({ status: true, user: decoded, });
                }
            });
        } else {
            reject({ status: false, message: "You Need To Login First", });
        }
    }).then(({ status, message, user }) => {
        req.user = (status) ? user : null;
        (status) ? next() : res.status(200).json({ status, message, user });
    }).catch(({ status, message }) => {
        res.status(401).json({ status, message });
    })
};