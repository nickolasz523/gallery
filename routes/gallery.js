const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Art = require("../models/art");
mongoose = require("mongoose");

router.get("/", async (req, res) => {
	if (req.session.loggedin) {
		if (!req.query.page) {
			req.query.page = 1;
		}

		if (
			req.query.type != "name" &&
			req.query.type != "artist" &&
			req.query.type != "category" &&
			req.query.type != "medium" &&
			req.query.type != "year"
		) {
			req.query.type = "artist";
		}

		console.log(req.query.type);

		if (req.query.type == "year") {
			req.query.search = parseInt(req.query.search);
		}

		let type = req.query.type.toLowerCase();
		if (!req.query.search) {
			let art = await Art.find({})
				.skip((req.query.page - 1) * 10)
				.limit(10);
			let count = await Art.countDocuments({});
			res.render("gallery/gallery", {
				session: req.session,
				gallery: art,
				count: count,
				page: req.query.page,
			});
		} else {
			try {
				let art = await Art.find({
					[type]: { $regex: req.query.search, $options: "i" },
				})

					.skip((req.query.page - 1) * 10)
					.limit(10);
				let count = await Art.countDocuments({
					[type]: { $regex: req.query.search, $options: "i" },
				});
				res.render("gallery/gallery", {
					gallery: art,
					session: req.session,
					count: count,
					page: req.query.page,
				});
				console.log("yo");
			} catch (err) {
				console.log(err);
				res.sendStatus(500, "Server error");
			}
		}
	} else {
		res.redirect("/login");
	}
});

router.put("/:id/comment", async (req, res) => {
	let id = req.params.id;
	let comment = req.body.comment;
	let user = req.body.user;

	let newId = mongoose.Types.ObjectId();
	console.log(newId);
	if (comment === "" || user === "") {
		res.status(400);
		res.send("Comment must have text and user");
		return;
	}

	try {
		await Art.findByIdAndUpdate(id, {
			$push: { comments: { _id: newId, user: user, comment: comment } },
		});
		await User.findOneAndUpdate(
			{ username: user },
			{ $push: { comments: { _id: newId, art: id, comment: comment } } }
		);
	} catch (err) {
		res.sendStatus(500);
		return;
	}
	// console.log(newId);
	res.status(200);
	res.send(newId);
});

router.put("/:id/like", async (req, res) => {
	let id = req.params.id;
	let user = req.body.user;
	try {
		let art = await Art.findById(id);
		let userServer = await User.findOne({ username: user });
		if (art.likes.includes(user)) {
			await art.updateOne({ $pull: { likes: user } });
			await userServer.updateOne({ $pull: { likes: id } });
		} else {
			await art.updateOne({ $push: { likes: user } });
			await userServer.updateOne({ $push: { likes: id } });
		}
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
		return;
	}
	res.status(200);
	res.send();
});

router.delete("/:id/delete", async (req, res) => {
	let artid = req.params.id;
	let commentid = req.body.commentid;
	let user = req.body.user;
	try {
		let art = await Art.findById(artid);
		let userServer = await User.findOne({ username: user });
		await art.updateOne({ $pull: { comments: { _id: commentid } } });
		await userServer.updateOne({ $pull: { comments: { _id: commentid } } });
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
		return;
	}
	res.sendStatus(200);
});

router.post("/upload", async (req, res) => {
	let newId = mongoose.Types.ObjectId();
	if (!req.session.loggedin) {
		res.redirect("/login");
	}
	console.log();
	if (
		req.body.imgLink == "" ||
		req.body.imgName == "" ||
		req.body.imgYear == "" ||
		req.body.imgCategory == "" ||
		req.body.imgMedium == "" ||
		req.body.imgDescription == ""
	) {
		res.status(400);
		res.send("Please fill out all fields");
	}
	try {
		//make sure user is artist
		let user = await User.findOne({ username: req.session.username });
		if (user.accountType == "patron") {
			res.sendStatus(403, "You are not an artist");
			return;
		}
		//make sure name is unique
		let name = req.body.imgName;
		let findName = await Art.findOne({ name: name });
		if (findName) {
			res.status(400);
			res.send("Name already exists");
			res.end();
			return;
		}

		let newArt = {
			_id: newId,
			artist: req.session.username,
			image: req.body.imgLink,
			name: name,
			year: req.body.imgYear,
			category: req.body.imgCategory,
			medium: req.body.imgMedium,
			description: req.body.imgDescription,
			likes: [],
			comments: [],
		};
		await Art.create(newArt);
		await User.findOneAndUpdate(
			{ username: req.session.username },
			{ $push: { art: newId } }
		);

		//add notifications in all followers accounts
		let followers = user.followers;
		// change from object to array
		let followersArray = Object.keys(followers).map(
			(key) => followers[key]
		);

		for (let i = 0; i < followersArray.length; i++) {
			follower = await User.findOne({
				username: followersArray[i],
			});
			console.log(follower.username);
			await follower.updateOne({
				$push: {
					notifications: {
						notificationType: "art",
						user: req.session.username,
						notificationID: newId,
						notificationName: name,
					},
				},
			});
		}
	} catch (err) {
		res.sendStatus(500, "Server error");
		console.log(err);
		return;
	}
	res.status(201);
	res.send();
});

router.get("/search", async (req, res) => {
	req.query.search = req.query.search.toLowerCase();
	req.query.type = req.query.type.toLowerCase();
	let type = req.query.type;

	console.log("searching for " + req.query.search);
	console.log("searching for " + req.query.type);

	if (type != "name" && type != "artist" && type != "category") {
		res.sendStatus(400, "Invalid search type");
		res.end();
	}
});

router.get("/:id", async (req, res) => {
	if (!req.session.loggedin) {
		res.redirect("/login");
		return;
	}
	let id = req.params.id;
	let art;
	try {
		art = await Art.findById(id);
	} catch (err) {
		res.sendStatus(500);
		return;
	}
	if (!art) {
		res.sendStatus(404);
		return;
	}
	res.status(200);
	art = [art];
	res.render("gallery/gallery", { gallery: art, session: req.session });
});

module.exports = router;
