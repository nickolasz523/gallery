const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	if (req.session.loggedin) {
		req.session.save(() => {
			res.redirect("/");
		});
	} else {
		res.render("account/login", { user: new User(), session: req.session });
	}
});

router.post("/", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({ username, password }, (err, userFound) => {
		if (err) {
			res.status(500);
			console.log(err);
			res.send();
		}
		if (!userFound) {
			req.session.loggedin = false;
			req.session.username = null;
			res.status(403);
			res.send();
		} else {
			req.session.loggedin = true;
			req.session.username = username;
			res.status(201);
			console.log("ended");
			res.send();
		}
	});
});

module.exports = router;
