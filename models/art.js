const mongoose = require("mongoose");

const artSchema = new mongoose.Schema(
	{
		name: String,
		artist: String,
		year: String,
		category: String,
		medium: String,
		description: String,
		image: String,
	},
	{ collection: "art" }
);

module.exports = mongoose.model("Art", artSchema);
