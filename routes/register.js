const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	if (req.session.loggedin) {
		res.redirect("/");
		return;
	}
	res.render("account/register", { user: new User(), session: req.session });
});

router.post("/", (req, res) => {
	console.log(req.body);
	const user = new User({
		username: req.body.username,
		password: req.body.password,
		accountType: req.body.accountType,
	});
	user.save((err, newUser) => {
		console.log(newUser);
		if (err) {
			res.status(500);
			console.log(err);
			res.render("account/register", {
				user: user,
				errorMessage:
					"Error creating user account. Perhaps the username is already taken?",
				session: req.session,
			});
		} else {
			req.session.loggedin = true;
			req.session.username = newUser.username;
			res.status(200);
			res.redirect("/");
		}
	});
});

module.exports = router;
