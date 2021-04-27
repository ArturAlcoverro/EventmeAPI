require("dotenv").config();

const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST_NAME || "localhost";

const usersRoute = require("./routes/users.route");
const eventsRoute = require("./routes/events.route");
const friendsRoute = require("./routes/friends.route");
const messagesRoute = require("./routes/messages.route");

app.use(express.json());

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
