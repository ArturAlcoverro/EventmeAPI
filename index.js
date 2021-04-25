require("dotenv").config();

const express = require("express");
const app = express();

const usersRoute = require("./routes/users.route");
const usersRoute = require("./routes/events.route");
const usersRoute = require("./routes/friends.route");

app.use(express.static("public"));
app.use(express.json());

const port = process.env.PORT || 3000;
const host = process.env.HOST_NAME || "localhost";

app.use("/api/users", usersRoute);
app.use("/api/videogames", videogameRoute);
app.use("/api/scores", scoreRoute);

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
    console.log(`http://${host}:${port}/api/users/`);
    console.log(`http://${host}:${port}/api/users/3`);
    console.log(`http://${host}:${port}/api/videogames/`);
    console.log(`http://${host}:${port}/api/videogames/3`);
    console.log(`http://${host}:${port}/api/videogames/97`);
    console.log(`http://${host}:${port}/api/videogames/load`);
    console.log(`http://${host}:${port}/api/scores/puntua/3/3/5`);
});
