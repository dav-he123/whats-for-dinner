("use strict");

// Basic express setup:

const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let sides = [
  "Miso Glazed Carrots",
  "Coleslaw",
  "Garden Salad",
  "Crispy Potatoes",
  "Sweet Potato Tots",
  "Coconut Rice",
  "Caeser Salad",
  "Shrimp Summer Rolls",
  "Garlic Butter Mushrooms",
  "Hush Puppies",
];

let mains = [
  "Spaghetti and Meatballs",
  "Pineapple Chicken",
  "Shakshuka",
  "Thai Yellow Curry",
  "Bibimbap",
  "Chicken Parmesean",
  "Butternut Squash Soup",
  "BBQ Chicken Burgers",
  "Ramen",
  "Empanadas",
  "Chicken Fried Rice",
  "Sheet Pan Fajitas",
  "Margarita Pizza",
];

let desserts = [
  "Apple Pie",
  "Lemon Meringue Pie",
  "Black Forest Cake",
  "Banana Bread",
  "Peach Cobbler",
  "Cheesecake",
  "Funfetti Cake",
  "Baklava",
  "Flan",
  "Macarons",
  "Macaroons",
  "Chocolate Cupcakes",
  "Pavlova",
  "Pumpkin Pie",
  "Key Lime Pie",
  "Tart Tatin",
  "Croissants",
  "Eclairs",
];

let fav = ["Chicken", "Mashed Potatoes"];

let randMeals = { meal: "", category: "" };

app.get("/favrecipes", (req, res) => {
  res.render("favourites", { fav: fav });
});

app.get("/home", (req, res) => {
  console.log(randMeals);

  res.render("main", randMeals);
});

app.post("/home/randomselection", (req, res) => {
  console.log(req.body);
  randMeals["category"] = req.body.full_course_meal_type;
  randMeals["meal"] = randSelect(req.body.full_course_meal_type);
  res.redirect("/home");
});

app.post("/favrecipes/addfavrecipe", (req, res) => {
  console.log("YOLO1");
  console.log(req);
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

const randSelect = function (mealtype) {
  let selectedMeal;

  if (mealtype == "Dessert") {
    selectedMeal = desserts[Math.floor(Math.random() * desserts.length)];
  } else if (mealtype == "Main Dish") {
    selectedMeal = mains[Math.floor(Math.random() * mains.length)];
  } else if (mealtype == "Side") {
    selectedMeal = sides[Math.floor(Math.random() * sides.length)];
  } else if (mealtype == "Entire Meal") {
    selectedMeal =
      mains[Math.floor(Math.random() * mains.length)] +
      " with a side of " +
      sides[Math.floor(Math.random() * sides.length)] +
      " and " +
      desserts[Math.floor(Math.random() * desserts.length)] +
      " for dessert";
  } else {
    selectedMeal = "Please select an option before proceeding!";
  }

  return selectedMeal;
};
