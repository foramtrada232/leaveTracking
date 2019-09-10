
// Service
const UserService = require('../services/UserService')

module.exports = {

	/** 
	 * user sign up 
	 */
	signup(req, res) {
		const userData = req.body
		console.log("userData:,", userData)
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
	login(req, res) {
		const userData = {
			email: req.body.email,
			password: req.body.password
		}
		UserService.login(userData).then((response) => {
			return res.status(response.status ? response.status : 200).json({ message: response.message, token: response.token });
		}).catch((error) => {
			console.log('error:', error);
			return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
		})
	},

/** 
 * get all user
 */
getAllUsers (req, res) {
	UserService.getAllUsers().then((response) => {
		return res.status(response.status ? response.status : 200).json({ message: response.message, data: response.data });
	}).catch((error) => {
		console.log('error:', error);
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
	})
},

/**
 * userId wise get user details
 */
getSingleUser(req, res) {
	const userId = req.params.userId;
	UserService.getSingleUser(userId).then((response) => {
		return res.status(response.status ? response.status : 200).json({ message: response.message, data: response.data })
	}).catch((error) => {
		return res.status(error.status ? error.status : 500).json({ message: error.message ? error.message : 'internal server error' });
	})
},
}
