("use strict");

// Basic express setup:

const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());  

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

let users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
}

app.get("/favrecipes", (req, res) => {

  const templateVars = {
    username: req.cookies.name,
    favrecipe: favrecipe
  };
  res.render("favourites", templateVars);
});

app.get("/home", (req, res) => {

  const templateVars = {
    username: req.cookies.name,
    randMeals: randMeals
  };
  res.render("main", templateVars);
});   

app.get("/register", (req, res) => {
  res.render("registration");
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

app.post("/favrecipes/:favrecipe/delete", (req, res) => {
  removeFavRecipe(req.params.favrecipe);
  res.redirect("/favrecipes")
});

app.post("/home/deleterecipe/:category/:meal/delete", (req, res) => {
  removeSelectedRecipe(req.params);
})

app.post("/login", (req, res) => {
  res.redirect("/home");      
})

app.post("/logout", (req, res) => {
  res.clearCookie('name');   
  res.redirect("/home");
})

app.post("/register", (req, res) => {

  const userId = makeid(5);
  users[userId] = { id: userId, email: req.body.email, password: req.body.password }

  res.cookie('name', users[userId].email);  
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

function removeFavRecipe(favRecipe) {
  const index = favrecipe.indexOf(favRecipe);
  if (index > -1) { // only splice array when item is found
    favrecipe.splice(index, 1); // 2nd parameter means remove one item only
  }
}

function removeSelectedRecipe(selectedRecipe) {

  if(selectedRecipe.category == 'Side') {
    const index = sides.indexOf(selectedRecipe.meal);
    if (index > -1) { // only splice array when item is found
      sides.splice(index, 1); // 2nd parameter means remove one item only
    }
  } 
  
  if(selectedRecipe.category == 'Main Dish') {
    const index = mains.indexOf(selectedRecipe.meal);
    if (index > -1) { // only splice array when item is found
      mains.splice(index, 1); // 2nd parameter means remove one item only
    }
  } 
  
  if(selectedRecipe.category == 'Dessert') {
    const index = desserts.indexOf(selectedRecipe.meal);
    if (index > -1) { // only splice array when item is found
      desserts.splice(index, 1); // 2nd parameter means remove one item only
    }
  }
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}