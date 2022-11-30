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
		likes: [
			{
				type: String,
				default: [],
			},
		],
		comments: [{ user: String, comment: String }, { default: [] }],
		default: [],
	},
	{ collection: "art" }
);

module.exports = mongoose.model("Art", artSchema);
