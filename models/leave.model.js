/** User Mongo DB model	*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaveSchema = new mongoose.Schema({

    userId : { type: Schema.Types.ObjectId, ref: 'User' },
	date: {type:Object,required: true},
	noOfDays: {type:Number,required: true},
    reason: { type: String, required: true },
    extraHours: {type: String},
    status: {type: String, default:'pending'}
});


module.exports = mongoose.model("leave", LeaveSchema);
