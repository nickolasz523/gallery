const express = require("express");
const app = express();
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/gallery", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter);

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
