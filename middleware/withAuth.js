const jwt = require('jsonwebtoken');
const CYPHERKEY = process.env.CYPHERKEY;

const withAuth = function (req, res, next) {
  const token = req.headers.token;
  // console.log("headers:",req.headers)
  // console.log("token:",token)
  if (!token) {
    res.status(401).json({message:'Unauthorized: No token provided'});
  } else {
    jwt.verify(token, CYPHERKEY, function (err, decoded) {
      if (err) {
        res.status(401).json({message:'Unauthorized: Invalid token'});
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = withAuth;