const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Art = require("../models/art");
const Workshop = require("../models/workshop");

router.get("/", (req, res) => {
	res.redirect("/users/" + req.session.username);
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
			let art = await Art.find({ artist: paramUsername });
			if (paramUsername === req.session.username) {
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
	} catch (err) {
		res.sendStatus(500, "Error looking for user.");
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
			res.status(500);
			res.end();
		}
	} else {
		res.status(403);
		res.redirect("/users/" + req.params.username);
	}
});

router.get("/:username/notifications", async (req, res) => {
	if (req.session.username === req.params.username) {
		try {
			let user = await User.findOne({ username: req.params.username });
			res.render("users/notifications", {
				notifications: user.notifications,
				session: req.session,
			});
		} catch (err) {
			res.status(500);
			res.end();
		}
	} else {
		res.status(403);
		res.redirect("/users/" + req.params.username);
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

router.get("/:username/createworkshop", async (req, res) => {
	paramUsername = req.params.username;
	let user;
	if (paramUsername === req.session.username) {
		try {
			user = await User.findOne({ username: paramUsername });
		} catch {
			res.status(500);
			res.end();
			return;
		}
		console.log(user.workshops);
		res.render("users/createworkshop", {
			session: req.session,
			user: user,
			workshops: user.workshops,
		});
	} else {
		res.status(403);
		res.redirect("/users/" + paramUsername);
	}
});

router.post("/:username/workshop", async (req, res) => {
	paramUsername = req.params.username;
	let user;
	let newid = mongoose.Types.ObjectId();
	if (paramUsername === req.session.username) {
		try {
			user = await User.findOne({ username: paramUsername });
		} catch {
			res.status(500);
			res.send("Server error");
			return;
		}
	} else {
		res.status(403);
		res.send("You are not authorized to view this page.");
		return;
	}
	// check if workshop name is unique
	console.log(user.workshops);

	for (let i = 0; i < user.workshops.length; i++) {
		if (user.workshops[i].workshopName == req.body.workshopName) {
			res.status(400);
			res.send("Workshop name already exists.");
			return;
		}
	}

	let workshop = new Workshop({
		_id: newid,
		workshopName: req.body.workshopName,
		workshopUser: req.session.username,
	});
	try {
		await workshop.save();
	} catch (err) {
		console.log(err);
		res.status(500);
		res.send("Server error");
		return;
	}
	try {
		await user.workshops.push({
			workshopName: req.body.workshopName,
			_id: newid,
		});
		await user.save();
	} catch (err) {
		res.status(500);
		res.send("Server error");
		console.log(err);
		return;
	}

	let followers = user.followers;
	for (let i = 0; i < followers.length; i++) {
		let follower = await User.findOne({ username: followers[i] });
		try {
			await follower.notifications.push({
				notificationType: "workshop",
				user: req.session.username,
				notificationID: newid,
				notificationName: req.body.workshopName,
			});
			await follower.save();
		} catch (err) {
			console.log(err);
			res.status(500);
			res.send("Server error");
			return;
		}
	}

	res.status(201);
	res.end();
});

router.delete("/:username/notifications/delete", async (req, res) => {
	let user;
	// delete users notifications
	try {
		user = await User.findOne({ username: req.session.username });
	} catch {
		res.status(500);
		res.send("Server error");
		return;
	}
	try {
		await user.updateOne({
			$set: { notifications: [] },
		});
	} catch {
		res.status(500);
		res.send("Server error");
		return;
	}
	res.status(200);
	res.end();
});

router.get("/:username/workshops", async (req, res) => {
	paramUsername = req.params.username;
	let user;
	let workshops;
	try {
		user = await User.findOne({ username: paramUsername });
	} catch {
		res.status(500);
		res.end();
		return;
	}
	try {
		workshops = await Workshop.find({ workshopUser: paramUsername });
	} catch {
		res.status(500);
		res.end();
		return;
	}

	res.render("users/workshops", {
		session: req.session,
		user: user,
		workshops: workshops,
	});
});
module.exports = router;
