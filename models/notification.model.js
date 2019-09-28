var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SendnotificationSchema = new Schema({

	createdAt:{type:Date, expires: 60, default:Date.now()},
	createdTime: {type: String},
	title:{type:String },
	body: {type:String},
	
})

module.exports = mongoose.model('notification', SendnotificationSchema);	
