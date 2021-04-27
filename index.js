require("dotenv").config();

const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST_NAME || "localhost";

const usersRoute = require("./routes/users.route");
const eventsRoute = require("./routes/events.route");
const friendsRoute = require("./routes/friends.route");
const messagesRoute = require("./routes/messages.route");

app.use(express.static("public"));
app.use(express.json());

app.use("/users", usersRoute);
// app.use("/events", eventsRoute);
// app.use("/friends", friendsRoute);
// app.use("/messages", messagesRoute);

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
