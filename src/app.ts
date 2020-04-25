import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import path from "path";
import passport from "passport";
import dotenv from "dotenv";
import fs from "fs";
import * as homeController from "./controllers/home";

if (fs.existsSync(".env")) {
    dotenv.config({ path: ".env" });
} else {
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}

// Create Express server
const SESSION_SECRET = process.env["SESSION_SECRET"];
console.log(SESSION_SECRET);
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
app.get("/", homeController.index);

const onConnection = (socket: any) => {
    socket.on("drawing", (data: any) => socket.broadcast.emit("drawing", data));
};
io.on("connection", onConnection);

export default app;
