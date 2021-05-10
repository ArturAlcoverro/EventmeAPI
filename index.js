require("dotenv").config();

var compression = require('compression');
var express = require('express');
var app = express();


const fileupload = require("express-fileupload")

const port = process.env.PORT || 3000;
const host = process.env.HOST_NAME || "localhost";

const usersRoute = require("./routes/users.route");
const eventsRoute = require("./routes/events.route");
const friendsRoute = require("./routes/friends.route");
const messagesRoute = require("./routes/messages.route");

app.use(compression());
app.use(express.json());
app.use(fileupload())

app.use('/image', express.static(__dirname + '/uploads'))

app.use("/api/users", usersRoute);
app.use("/api/events", eventsRoute);
app.use("/api/friends", friendsRoute);
app.use("/api/messages", messagesRoute);

app.all("/api/*", (req, res, next) => {
	console.log(req.url);
	next({
		error: "Not found",
	});
});

app.use((err, req, res, next) => {
	console.log("ERROR:", err);
	if (err.status) res.status(err.status)
	res.json(err);
});

app.listen(port, () => {
	console.log(`http://${host}:${port}`);
});

