const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// GREAT for all AJAX requests
app.use(bodyParser.urlencoded({ extended: true }));

// GREAT for httpie / postman / SOME AJAX requests
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use("/users", userRoutes);

module.exports = app;
