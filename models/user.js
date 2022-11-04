const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	accountType: {
		type: String,
		default: "patron",
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	following: [
		{
			type: String,
		},
	],
});

module.exports = mongoose.model("User", userSchema);
