const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("user/register");
});

router.post("/", (req, res) => {
	res.send("Register");
});

module.exports = router;
