const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");

const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const usersRouter = require("./routes/users");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));

mongoose.connect("mongodb://localhost:27017/gallery", {
	useNewUrlParser: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/users", usersRouter);

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
