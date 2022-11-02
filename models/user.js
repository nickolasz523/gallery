const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	accountType: {
		type: String,
		default: "artist",
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
});

module.exports = mongoose.model("User", userSchema);
