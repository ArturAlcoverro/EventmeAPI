require("dotenv").config();

const express = require("express");
const app = express();

const fileupload = require("express-fileupload")

const port = process.env.PORT || 3000;
const host = process.env.HOST_NAME || "localhost";

const usersRoute = require("./routes/users.route");
const eventsRoute = require("./routes/events.route");
const friendsRoute = require("./routes/friends.route");
const messagesRoute = require("./routes/messages.route");

app.use(express.json());
app.use(fileupload())

app.get('/upload/:FILENAME', function (req, res) {
	res.download("./uploads/" + req.params.FILENAME)
});

app.post('/upload', function (req, res) {
	let sampleFile;
	let uploadPath;

	if (!req.files || Object.keys(req.files).length === 0) {
		res.status(400).send('No files were uploaded.');
		return;
	}

	console.log(__dirname); // eslint-disable-line

	sampleFile = req.files.sampleFile;

	uploadPath = __dirname + '/uploads/img.jpg';

	sampleFile.mv(uploadPath, function (err) {
		if (err) {
			return res.status(500).send(err);
		}

		res.send('File uploaded to ' + uploadPath);
	});
});

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
	console.log("error", err);
	res.json(err);
});

app.listen(port, () => {
	console.log(`http://${host}:${port}`);
});
