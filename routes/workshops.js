const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Workshop = require("../models/workshop");

router.get("/", (req, res) => {
	if (req.session.loggedin) {
		res.redirect("/workshops/" + req.session.username);
	} else {
		res.redirect("/login");
	}
});

router.put("/:id/enroll", async (req, res) => {
	let id = req.params.id;
	try {
		let workshop = await Workshop.findById(id);
		let userServer = await User.findOne({ username: req.session.username });
		if (userServer.enrolledWorkshops.includes(id)) {
			await userServer.updateOne({ $pull: { enrolledWorkshops: id } });
		} else {
			await userServer.updateOne({ $push: { enrolledWorkshops: id } });
		}
	} catch (err) {
		res.status(500);
		res.send("Couldnt find workshop or user");
		res.end();
	}
	res.status(204);
	res.send();
});

module.exports = router;
