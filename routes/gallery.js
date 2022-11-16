const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Art = require("../models/art");

router.get("/", (req, res) => {
	// if (!req.session.loggedin) {
	// 	res.redirect("/login");
	// }
	// else {
	Art.find({}, (err, allArt) => {
		if (err) {
			console.log(err);
		} else {
			res.render("gallery/gallery", {
				gallery: allArt,
				session: req.session,
			});
		}
	});
	// }
});

router.post("/:id/comment", async (req, res) => {
	let id = req.params.id;
	let comment = req.body.comment;
	let user = req.body.user;
	try {
		await Art.findByIdAndUpdate(id, {
			$push: { comments: { user: user, comment: comment } },
		});
	} catch (err) {
		console.log(err);
	}
	res.status(201);
	res.send();
});

module.exports = router;
