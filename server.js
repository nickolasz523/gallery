const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

mongoose.connect("mongodb://localhost:27017/gallery", {
	useNewUrlParser: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter);
app.use("/register", registerRouter);

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
