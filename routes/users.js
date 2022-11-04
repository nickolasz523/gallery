const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	res.send("page for users");
});

router.get("/:username", async (req, res) => {
	paramUsername = req.params.username;
	try {
		const user = await User.findOne({ username: req.params.username });
		if (user == null) {
			res.status(404);
			res.render("users/notFound", {
				username: paramUsername,
				errorMessage: "User not found.",
				session: req.session,
			});
		} else {
			res.status(200);
			if (paramUsername === req.session.username) {
				res.render("users/profile", {
					user: user,
					session: req.session,
				});
			} else {
				res.render("users/otherUser", {
					user: user,
					session: req.session,
				});
			}
		}
	} catch {
		res.status(500);
		console.log("error looking for user");
	}
});

router.put("/:username/update/:type", async (req, res) => {
	paramUsername = req.params.username;
	paramType = req.params.type;
	let user;
	if (paramUsername === req.session.username) {
		try {
			user = await User.findOne({ username: paramUsername });
			user.accountType = paramType;
			await user.save();
		} catch {
			res.status(500);
		}
	} else {
		res.status(403);
	}
	res.redirect("/users/" + paramUsername);
});

router.get("/:username/:type", (req, res) => {
	paramUsername = req.params.username;
	paramType = req.params.type;

	res.redirect("/users/" + paramUsername);
});

module.exports = router;
