const express = require('express');
const path = require('path');
const mongoose = require("./database"); // Database connection will still be made
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = 3000;

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, { pingTimeout: 60000 });


app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "cheese and potato",
    resave: true,
    saveUninitialized: false
}));

app.get("/chats", (req, res, next) => {
    var payload = {
        pageTitle: "Chats" 
    };
    res.status(200).render("chats", payload);
});