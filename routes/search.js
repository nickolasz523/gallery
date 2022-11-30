const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	if (req.session.loggedin) {
		res.render("gallery/search", { session: req.session });
		res.status(200);
	} else {
		res.redirect("/login");
		res.status(403);
	}
});

module.exports = router;
