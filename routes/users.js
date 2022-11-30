const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Art = require("../models/art");

router.get("/", (req, res) => {
	res.send("page for users");
});

router.get("/:username", async (req, res) => {
	paramUsername = req.params.username;
	let user;
	try {
		user = await User.findOne({ username: req.params.username });
		if (user == null) {
			res.status(404);
			res.render("users/notFound", {
				username: paramUsername,
				errorMessage: "User not found.",
				session: req.session,
			});
		} else {
			res.status(200);
			let art = await Art.find({ artist: paramUsername });
			if (paramUsername === req.session.username) {
				//find art that user has in art
				res.render("users/profile", {
					user: user,
					session: req.session,
					gallery: art,
				});
			} else {
				const selfUser = await User.findOne({
					username: req.session.username,
				});
				res.render("users/otherUser", {
					user: user,
					session: req.session,
					selfUser: selfUser,
					gallery: art,
				});
			}
		}
	} catch {
		res.status(500);
		console.log("error looking for user");
	}
});

router.get("/:username/reviews", async (req, res) => {
	if (req.session.username === req.params.username) {
		try {
			let art = await Art.find({
				$or: [
					{ likes: req.params.username },
					{ comments: { $elemMatch: { user: req.params.username } } },
				],
			});
			res.render("users/reviews", { gallery: art, session: req.session });
		} catch (err) {
			res.sendStatus(500, "Error finding art.");
		}
	} else {
		res.status(403);
		res.send("You do not have permission to view this page.");
	}
});

router.put("/:username/update/:type", async (req, res) => {
	paramUsername = req.params.username;
	paramType = req.params.type;
	let user;
	if (paramUsername === req.session.username) {
		try {
			user = await User.findOne({ username: paramUsername });
			user.accountType = paramType;
			await user.save();
		} catch {
			res.status(500);
		}
	} else {
		res.status(403);
	}
	res.redirect("/users/" + paramUsername);
});

// router.get("/:username/:type", (req, res) => {
// 	paramUsername = req.params.username;
// 	paramType = req.params.type;

// 	res.redirect("/users/" + paramUsername);
// });

router.get("/:username/following", async (req, res) => {
	paramUsername = req.params.username;
	let user;
	let following;
	let errorMessage = "";
	if (paramUsername === req.session.username) {
		try {
			user = await User.findOne({ username: paramUsername });
			following = user.following;
			console.log(following);
			if (following.length === 0) {
				errorMessage = "You are not following anyone.";
			}
		} catch {
			res.status(500);
			res.end();
		}
	} else {
		res.status(403);
		errorMessage = "You are not authorized to view this page.";
	}

	res.render("users/following", {
		session: req.session,
		following: following,
		user: user,
		errorMessage: errorMessage,
	});
});

router.put("/:username/follow", async (req, res) => {
	paramUsername = req.params.username;
	let user;
	let selfUser;
	if (paramUsername !== req.session.username) {
		try {
			user = await User.findOne({ username: paramUsername });
			selfUser = await User.findOne({ username: req.session.username });
		} catch {
			res.status(500);
			res.end();
			return;
		}
		if (selfUser.following.includes(paramUsername)) {
			res.status(400);
			res.end();
			return;
		}

		try {
			await selfUser.following.push(paramUsername);
			await user.followers.push(req.session.username);
			await selfUser.save();
			await user.save();
		} catch {
			res.status(500);
			res.end();
			return;
		}
		res.status(201);

		res.end();
	} else {
		res.status(400);
		res.send();
		return;
	}
});

router.put("/:username/unfollow", async (req, res) => {
	paramUsername = req.params.username;
	let user;
	let selfUser;
	if (paramUsername !== req.session.username) {
		try {
			user = await User.findOne({ username: paramUsername });
			selfUser = await User.findOne({ username: req.session.username });
		} catch {
			res.status(500);
			res.send();
			return;
		}
		if (selfUser.following.includes(paramUsername)) {
			try {
				await selfUser.updateOne({
					$pull: { following: paramUsername },
				});
			} catch {
				res.status(500);
				res.send();
				return;
			}
			if (user.followers.includes(req.session.username)) {
				try {
					await user.updateOne({
						$pull: { followers: req.session.username },
					});
				} catch {
					res.status(500);
					res.send();
					return;
				}
			}
			res.status(201);
			res.send();
			return;
		}
	} else {
		res.status(400);
		res.send();
		return;
	}
});

module.exports = router;
