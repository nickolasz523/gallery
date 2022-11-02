const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = null;
	}
	res.redirect("/");
});

module.exports = router;
