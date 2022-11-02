const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	console.log(res.session);
	res.render("index", { session: req.session });
});

module.exports = router;
