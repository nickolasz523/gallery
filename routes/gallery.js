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

router.put("/:id/comment", async (req, res) => {
	let id = req.params.id;
	let comment = req.body.comment;
	let user = req.body.user;
	if (comment === "" || user === "") {
		res.sendStatus(400);
		res.end();
		return;
	}

	try {
		await Art.findByIdAndUpdate(id, {
			$push: { comments: { user: user, comment: comment } },
		});
	} catch (err) {
		res.sendStatus(400);
		res.end();
		return;
	}
	res.status(201);
	res.send();
});

router.put("/:id/like", async (req, res) => {
	let id = req.params.id;
	let user = req.body.user;
	try {
		let art = await Art.findById(id);
		if (art.likes.includes(user)) {
			await art.updateOne({ $pull: { likes: user } });
		} else {
			await art.updateOne({ $push: { likes: user } });
		}
	} catch (err) {
		console.log(err);
	}
	res.status(201);
	res.send();
});

module.exports = router;
