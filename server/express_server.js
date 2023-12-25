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

let randMeals = { meal: "", category: "" };

let favrecipe = [];

app.get("/favrecipes", (req, res) => {
  res.render("favourites", { favrecipe: favrecipe });
});

app.get("/home", (req, res) => {
  res.render("main", randMeals);
});

app.post("/home/randomselection", (req, res) => {
  randMeals["category"] = req.body.full_course_meal_type;
  randMeals["meal"] = randSelect(req.body.full_course_meal_type);
  res.redirect("/home");
});

app.post("/home/addfavrecipe", (req, res) => {
  if (!favrecipe.includes(randMeals["meal"])) {
    favrecipe.push(randMeals["meal"]);
  }
  res.redirect("/home");
});

app.post("/home/clearfavrecipe", (req, res) => {
  randMeals["meal"] = "";
  randMeals["category"] = "";
  res.redirect("/home");
});

app.post("/home/addnewrecipe", (req, res) => {
  if(req.body.inputtype == "Side") {
    sides.push(req.body.inputname);
  } else if(req.body.inputtype == "Main Dish") {
    mains.push(req.body.inputname);
  } else {
    desserts.push(req.body.inputname);
  }

  res.redirect("/home");
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
