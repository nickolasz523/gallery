const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	res.send("page for users");
});

router.get("/:username", (req, res) => {
	paramUsername = req.params.username;
	User.findOne({ username: paramUsername }, (err, userFound) => {
		if (err) {
			res.status(500);
			console.log(err);
		}
		if (!userFound) {
			res.status(404);
			res.render("users/notFound", {
				username: paramUsername,
				errorMessage: "User not found.",
				session: req.session,
			});
		} else {
			if (paramUsername === req.session.username) {
				res.status(200);
				res.render("users/profile", {
					user: userFound,
					session: req.session,
				});
			} else {
				res.status(200);
				res.render("users/otherUser", {
					user: userFound,
					session: req.session,
				});
			}
		}
	});
});

router.post("/:username/:type", (req, res) => {
	paramUsername = req.params.username;
	paramType = req.params.type;

	if (req.session.username === paramUsername) {
		console.log(paramType);
		if (paramType !== "patron" && paramType !== "artist") {
			console.log("redirecting");
			res.redirect("/users/" + paramUsername);
		}
		User.findOne({ username: paramUsername }, (err, userFound) => {
			if (err) {
				res.status(500);
				console.log(err);
			}
			if (!userFound) {
				res.status(404);
				res.render("users/notFound", {
					username: paramUsername,
					errorMessage: "User not found.",
					session: req.session,
				});
			} else {
				console.log("worked?");
				userFound.accountType = paramType;
				userFound.save((err, updatedUser) => {
					if (err) {
						res.status(500);
						console.log(err);
					}
					res.redirect("/users/" + paramUsername);
				});
			}
		});
	}
});

router.get("/:username/:type", (req, res) => {
	console.log("mhm");
	paramUsername = req.params.username;
	paramType = req.params.type;

	res.redirect("/users/" + paramUsername);
});

module.exports = router;
