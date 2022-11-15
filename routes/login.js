const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	if (req.session.loggedin) {
		res.redirect("/");
	} else {
		res.render("account/login", { user: new User(), session: req.session });
	}
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
				req.session.loginErrorMessage = "Invalid username or password";
				res.redirect("/login");
				// res.render("account/login", {
				// 	user: user,
				// 	errorMessage: "Invalid username or password.",
				// 	session: req.session,
				// });
			} else {
				req.session.loggedin = true;
				req.session.username = user.username;
				req.session.loginErrorMessage = "";
				res.status(200);
				res.redirect("/");
			}
		}
	);
});

module.exports = router;
