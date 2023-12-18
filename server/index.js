"use strict";

// Basic express setup:

const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/favourites", (req, res) => {
  res.render("favourites", { title: "Express" });
});

app.get("/main", (req, res) => {
  res.render("main", { title: "Express" });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
