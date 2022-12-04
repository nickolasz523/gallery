let fs = require("fs");

let art = JSON.parse(fs.readFileSync("./public/database/art.json"));
let users = JSON.parse(fs.readFileSync("./public/database/users.json"));
let workshops = JSON.parse(fs.readFileSync("./public/database/workshops.json"));

//"artist":"Arthur Bozonnet","attack":3,"cardClass":"MAGE","health":2,"name":"Fallen Hero","rarity":"RARE"
let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect(
	"mongodb://127.0.0.1:27017/",
	{ useNewUrlParser: true },
	function (err, client) {
		if (err) throw err;

		db = client.db("gallery");
		db.dropCollection("art", function (err, result) {
			if (err) {
				console.log(
					"Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)"
				);
			} else {
				console.log("Cleared art collection.");
			}

			db.collection("art").insertMany(art, function (err, result) {
				if (err) throw err;
				console.log(
					"Successfuly inserted " + result.insertedCount + " cards."
				);
				process.exit();
			});
		});

		// db.dropCollection("users", function (err, result) {
		// 	if (err) {
		// 		console.log(
		// 			"Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)"
		// 		);
		// 	} else {
		// 		console.log("Cleared users collection.");
		// 	}

		// 	db.collection("users").insertMany(users, function (err, result) {
		// 		if (err) throw err;
		// 		console.log(
		// 			"Successfuly inserted " + result.insertedCount + " cards."
		// 		);
		// 		process.exit();
		// 	});
		// });

		// db.dropCollection("workshops", function (err, result) {
		// 	if (err) {
		// 		console.log(
		// 			"Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)"
		// 		);
		// 	} else {
		// 		console.log("Cleared workshops collection.");
		// 	}

		// 	db.collection("workshops").insertMany(
		// 		workshops,
		// 		function (err, result) {
		// 			if (err) throw err;
		// 			console.log(
		// 				"Successfuly inserted " +
		// 					result.insertedCount +
		// 					" cards."
		// 			);
		// 			process.exit();
		// 		}
		// 	);
		// });
	}
);
