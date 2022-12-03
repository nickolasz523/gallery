const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
	workshopName: String,
	workshopUser: String,
});

const Workshop = mongoose.model("Workshop", workshopSchema);
module.exports = Workshop;
