const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	res.render("user/login", { user: new User() });
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
				});
			} else {
				// console.log(user);
				res.status(200);
				res.redirect("/");
			}
		}
	);
});

module.exports = router;
