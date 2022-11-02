const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	if (req.session.loggedin) {
		// res.render("user/profile", { session: req.session });
		res.redirect("/");
		return;
	}
	res.render("user/login", { user: new User(), session: req.session });
});

router.post("/", (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password,
	});
	User.findOne(
		{ username: req.body.username, password: req.body.password },
		(err, userFound) => {
			if (err) {
				res.status(500);
				console.log(err);
			}
			if (!userFound) {
				res.status(404);
				res.render("user/login", {
					user: user,
					errorMessage: "Invalid username or password.",
					session: req.session,
				});
			} else {
				req.session.loggedin = true;
				req.session.username = user.username;
				// console.log(user);
				res.status(200);
				res.redirect("/");
				// res.render("index", { user: userFound, session: req.session });
			}
		}
	);
});

module.exports = router;
