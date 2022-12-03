const mongoose = require("mongoose");
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

	comments: [
		{
			art: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Art",
			},
			comment: String,
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
	notifications: [
		{
			user: String,
			notificationType: String,
			notificationID: mongoose.Schema.Types.ObjectId,
			notificationName: String,
		},
		{ default: [] },
	],

	workshops: [
		{
			workshopName: String,
		},
	],
	enrolledWorkshops: [
		{
			workshopName: String,
		},
	],
});

module.exports = mongoose.model("User", userSchema);
