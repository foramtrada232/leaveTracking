var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SendnotificationSchema = new Schema({

	createdAt:{type:Date,default:Date.now(),expires:86400},
	createdTime: {type: String},
	title:{type:String },
	body: {type:String},
	
})

module.exports = mongoose.model('notification', SendnotificationSchema);	
