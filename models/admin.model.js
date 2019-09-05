/** User Mongo DB model	*/

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const AdminSchema = new mongoose.Schema({

	email: {type:String,required: true},
	name: {type:String,required: true},
	password: { type: String, required: true }

});


AdminSchema.pre('save', function (next) {
	const admin = this;
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(admin.password, salt, function (err, hash) {
			if (err) return next(err);
			admin.password = hash;
			console.log("pass:",admin.password)
			next();
		});
	});
 });

module.exports = mongoose.model("admin", AdminSchema);
