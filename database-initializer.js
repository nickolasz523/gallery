let fs = require("fs");

let art = JSON.parse(fs.readFileSync("./public/database/art.json"));
let users = JSON.parse(fs.readFileSync("./public/database/users.json"));
//"artist":"Arthur Bozonnet","attack":3,"cardClass":"MAGE","health":2,"name":"Fallen Hero","rarity":"RARE"
let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
let db;

for (let i = 0; i < art.length; i++) {
	art[i]["_id"] = new mongo.ObjectID(art[i]["_id"]["$oid"]);
	for (let j = 0; j < art[i].comments.length; j++) {
		art[i].comments[j]["_id"] = mongo.ObjectID(
			art[i].comments[j]["_id"]["$oid"]
		);
	}
}

for (let i = 0; i < users.length; i++) {
	users[i]["_id"] = mongo.ObjectID(users[i]["_id"]["$oid"]);
	for (let j = 0; j < users[i].art.length; j++) {
		users[i].art[j] = mongo.ObjectID(users[i].art[j]["$oid"]);
	}
	for (let j = 0; j < users[i].likes.length; j++) {
		users[i].likes[j] = mongo.ObjectID(users[i].likes[j]["$oid"]);
	}
	for (let j = 0; j < users[i].comments.length; j++) {
		users[i].comments[j].art = mongo.ObjectID(
			users[i].comments[j].art["$oid"]
		);
		users[i].comments[j]["_id"] = new mongo.ObjectID(
			users[i].comments[j]["_id"]["$oid"]
		);
	}
	console.log(users[i].comments);
	for (let j = 0; j < users[i].workshops.length; j++) {
		users[i].workshops[j]["_id"] = mongo.ObjectID(
			users[i].workshops[j]["_id"]["$oid"]
		);
	}
	for (let j = 0; j < users[i].notifications.length; j++) {
		users[i].notifications[j]["_id"] = mongo.ObjectID(
			users[i].notifications[j]["_id"]["$oid"]
		);
		users[i].notifications[j]["notificationID"] = mongo.ObjectID(
			users[i].notifications[j]["notificationID"]["$oid"]
		);
	}
}

// console.log(users);
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
					"Successfuly inserted " + result.insertedCount + " art."
				);
				process.exit();
			});
		});

		db.dropCollection("users", function (err, result) {
			if (err) {
				console.log(
					"Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)"
				);
			} else {
				console.log("Cleared art collection.");
			}

			db.collection("users").insertMany(users, function (err, result) {
				if (err) throw err;
				console.log(
					"Successfuly inserted " + result.insertedCount + " users."
				);
				process.exit();
			});
		});
	}
);
