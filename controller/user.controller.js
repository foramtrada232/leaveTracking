
// Service
const UserService = require('../services/UserService')


/** 
 * user sign up 
 */
signup = function (req, res) {
	const userData = req.body;
	console.log("userData:", userData);
	UserService.signup(userData).then((response) => {
		return res.status(response.status ? response.status : 200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status({ status: 500 }).json({ message: error.message ? error.message : 'internal server error' });
	})
},


	/** 
	 * user login with email
	 */
	login = function (req, res) {
		console.log("BODy============>", req.body)
		const userData = {
			email: req.body.email,
			password: req.body.password,
		}
		if(req.body.deviceToken) {
			userData['deviceToken'] = req.body.deviceToken
		}
		UserService.login(userData).then((response) => {
			return res.status(response.status ? response.status : 200).json({ message: response.message, token: response.token, designation: response.designation });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},

	/**Log Out*/
	logOut = function (req, res) {
	    console.log(req.user)
		const  email  = req.user.email
		UserService.logOut(email).then((response) => {
			return res.status(200).json({ status: 1, message: response.message, data: response.data });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	}

/** 
 * get all user
 */
getAllUsers = function (req, res) {
	UserService.getAllUsers().then((response) => {
		console.log("REQUESTED USER:", req.user);
		return res.status(response.status ? response.status : 200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
	})
},

	/**
	 * userId wise get user details
	 */
	getSingleUser = function (req, res) {
		// const userId = req.params.userId;
		const user = req.user;
		console.log("user:", user)
		UserService.getSingleUser(user).then((response) => {
			return res.status(response.status ? response.status : 200).json({ message: response.message, data: response.data })
		}).catch((error) => {
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},

	/**
	 * Get user By userId
	 */
	getSingleUserById = function (req, res) {
		console.log("userId=======>", req.params.userId);
		UserService.getSingleUserById(req.params.userId).then((response) => {
			return res.status(response.status ? response.status : 200).json({ message: response.message, data: response.data })
		}).catch((error) => {
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	}

/** 
 * update user 
 */
updateUser = function (req, res) {
	const userData = {
		userId: req.body.userId,
		name: req.body.name,
		profilePhoto: req.body.profilePhoto,
	}
	if (req.file) {
		userData.fileName = req.file.filename;
		userData.file = req.file;
	}

	UserService.updateUser(userData).then((response) => {
		return res.status(200).json({ status: response.status, message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
	})
}

module.exports = {
	signup: signup,
	login: login,
	logOut : logOut,
	getAllUsers: getAllUsers,
	getSingleUser: getSingleUser,
	updateUser: updateUser,
	getSingleUserById: getSingleUserById
}
