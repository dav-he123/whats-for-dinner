"use strict";

// Basic express setup:

const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// The in-memory database of recipes. It's a basic object with an array in it.
// const db = require("./lib/in-memory-db");

// The `data-helpers` module provides an interface to the database of recipes.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
// const DataHelpers = require("./lib/data-helpers.js")(db);

// Update the dates for the initial tweets (data-files/initial-tweets.json).
// require("./lib/date-adjust")();

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
// const recipesRoutes = require("./routes/recipes")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
// app.use("/recipes", recipesRoutes);

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
