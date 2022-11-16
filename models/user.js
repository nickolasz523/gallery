const mongoose = require("mongoose");
//requrie art schema
const Art = require("./art");

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
			default: [],
		},
	],
	art: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Art",
		},
	],
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Art",
			default: [],
		},
	],
	followers: [
		{
			type: String,
			default: [],
		},
	],
});

module.exports = mongoose.model("User", userSchema);
