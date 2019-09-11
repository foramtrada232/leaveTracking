/** User Mongo DB model	*/

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({

	name: { type: String },
	email: { type: String },
	password: { type: String },
	profilePhoto: { type: String, default: '' },
	dob: { type: Date },
	designation: { type: String, default: 'user' },
	location: { type: String },
	dateOfJoining: { type: Date },
	phone: { type: Number },
	total_leave: { type: Number, default: 0 }
});

UserSchema.pre('save', function (next) {
	const user = this;
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			console.log("pass:", user.password)
			next();
		});
	});
});

module.exports = mongoose.model("users", UserSchema);
