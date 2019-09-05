module.exports = {

	/** login validation */
	login(req, res, next) {
		req.checkBody("email", "Email is required").trim().notEmpty();
		req.checkBody("password", "Password is required").trim().notEmpty();

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.status(500).json({
				success: false,
				errors: errors[0].msg,
			}));
	},
};
