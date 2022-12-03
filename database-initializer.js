cards.forEach((card) => {
	delete card.collectible;
	delete card.cost;
	delete card.dbfId;
	delete card.flavor;
	delete card.id;
	delete card.mechanics;
	delete card.set;
	delete card.text;
	delete card.type;
});

console.log(cards);

//"artist":"Arthur Bozonnet","attack":3,"cardClass":"MAGE","health":2,"name":"Fallen Hero","rarity":"RARE"
let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect(
	"mongodb://127.0.0.1:27017/",
	{ useNewUrlParser: true },
	function (err, client) {
		if (err) throw err;

		db = client.db("t8");
		db.dropCollection("cards", function (err, result) {
			if (err) {
				console.log(
					"Error dropping collection. Likely case: collection did not exist (don't worry unless you get other errors...)"
				);
			} else {
				console.log("Cleared cards collection.");
			}

			db.collection("cards").insertMany(cards, function (err, result) {
				if (err) throw err;
				console.log(
					"Successfuly inserted " + result.insertedCount + " cards."
				);
				process.exit();
			});
		});
	}
);
