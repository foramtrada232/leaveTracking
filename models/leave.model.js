/** User Mongo DB model	*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaveSchema = new mongoose.Schema({

    userId : { type: Schema.Types.ObjectId, ref: 'User' },
	date: {type:Object,required: true},
    noOfDays: {type:Schema.Types.Mixed}, //{type:Number,default:null},
    shortLeave: {type:Number, default: null},
    reason: { type: String, required: true },
    extraHours: {type: String},
    approvedBy: {type: String, default:null},
    status: {type: String, default:'pending'}
});


module.exports = mongoose.model("leave", LeaveSchema);
