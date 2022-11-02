const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	res.render("user/register", { user: new User(), session: req.session });
});

router.post("/", (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password,
		accountType: req.body.accountType,
	});
	user.save((err, newUser) => {
		if (err) {
			res.status(500);
			console.log(err);
			res.render("user/register", {
				user: user,
				errorMessage:
					"Error creating user account. Perhaps the username is already taken?",
				session: req.session,
			});
		} else {
			req.session.loggedin = true;
			req.session.username = user.username;
			// console.log(user);
			res.status(200);
			res.redirect("/");
		}
	});
});

module.exports = router;
