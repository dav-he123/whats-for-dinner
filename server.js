("use strict");

// Basic express setup:

const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());  

app.use(express.static("public"));

const func = require("./db/index.js");

const { Pool } = require('pg');

const pool = new Pool({
  database: 'whatsfordinner'
});


let sides = [];

pool.query(`
SELECT name FROM sides;
` )
.then(res => {
  for(const elem of res.rows) {
    sides.push(elem.name);
  }
  return res.rows;
})
.catch(err => console.error('query error', err.stack));


let mains = [];

pool.query(`
SELECT name FROM mains;
`)
.then(res => {
  for(const elem of res.rows) {
    mains.push(elem.name);
  }
})
.catch(err => console.error('query error', err.stack));


let desserts = [];

pool.query(`
SELECT name FROM desserts;
`)
.then(res => {
  for(const elem of res.rows) {
    desserts.push(elem.name);
  }
})
.catch(err => console.error('query error', err.stack));


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
    username: users[req.cookies.user_id],
    favrecipe: favrecipe
  };
  res.render("favourites", templateVars);
});

app.get("/home", (req, res) => {
  const templateVars = {
    username: users[req.cookies.user_id],
    randMeals: randMeals
  };
  res.render("main", templateVars);
}); 

app.get("/register", (req, res) => { 
  res.render("registration");    
});  

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/viewrecipes", (req, res) => {

  const templateVars = {
    username: users[req.cookies.user_id],
    allrecipes: func.containsAllRecipes(sides, mains, desserts),  
  };  
  res.render("view_recipes", templateVars);
});

app.post("/home/randomselection", (req, res) => {
  randMeals["category"] = req.body.full_course_meal_type;
  randMeals["meal"] = func.randSelect(req.body.full_course_meal_type);
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
  func.removeFavRecipe(req.params.favrecipe);
  res.redirect("/favrecipes")
});

app.post("/home/deleterecipe/:category/:meal/delete", (req, res) => {
  func.removeSelectedRecipe(req.params);
});

app.post("/login", (req, res) => {
  if(func.isUserAllowedToLogin(req.body.email, req.body.password)){
    res.cookie('user_id', func.matchUserIdWithEmail(req.body.email));  
    res.redirect("/home"); 
  } else {
    res.status(403).send("403 Forbidden");
  }
});  

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');

  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const userId = func.makeid(6);
  
  if(func.getUserByEmail(req.body.email) || req.body.email == "" || req.body.password == "") {
    res.status(400).send("400 Bad Request");
  } else {
    users[userId] = { id: userId, email: req.body.email, password: req.body.password }
  }
    
  res.cookie('user_id', userId);   
  res.redirect("/home");
});  

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

// const randSelect = function (mealtype) {
//   let selectedMeal;
  
//   if (mealtype == "Dessert") {
//     selectedMeal = desserts[Math.floor(Math.random() * desserts.length)];
//   } else if (mealtype == "Main Dish") {
//     selectedMeal = mains[Math.floor(Math.random() * mains.length)];
//   } else if (mealtype == "Side") {
//     selectedMeal = sides[Math.floor(Math.random() * sides.length)];
//   } else if (mealtype == "Entire Meal") {
//     selectedMeal =
//     mains[Math.floor(Math.random() * mains.length)] +
//     " with a side of " +
//     sides[Math.floor(Math.random() * sides.length)] +
//     " and " +
//     desserts[Math.floor(Math.random() * desserts.length)] +
//     " for dessert";
//   } else {
//     selectedMeal = "Please select an option before proceeding!";
//   }
//   return selectedMeal;
// };

// function removeFavRecipe(favRecipe) {
//   const index = favrecipe.indexOf(favRecipe);
//   if (index > -1) { // only splice array when item is found
//     favrecipe.splice(index, 1); // 2nd parameter means remove one item only
//   }
// }

// function removeSelectedRecipe(selectedRecipe) {

//   if(selectedRecipe.category == 'Side') {
//     const index = sides.indexOf(selectedRecipe.meal);
//     if (index > -1) { // only splice array when item is found
//       sides.splice(index, 1); // 2nd parameter means remove one item only
//     }
//   } 
  
//   if(selectedRecipe.category == 'Main Dish') {
//     const index = mains.indexOf(selectedRecipe.meal);
//     if (index > -1) { // only splice array when item is found
//       mains.splice(index, 1); // 2nd parameter means remove one item only
//     }
//   } 
  
//   if(selectedRecipe.category == 'Dessert') {
//     const index = desserts.indexOf(selectedRecipe.meal);
//     if (index > -1) { // only splice array when item is found
//       desserts.splice(index, 1); // 2nd parameter means remove one item only
//     }
//   }

// }

// function makeid(length) {
//   let result = '';
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// }

// function getUserByEmail(inputEmail) {
//   for (const property in users) {
//     if(inputEmail == users[property].email) {
//       return true;
//     }
//   }
//   return false;
// }


// function isUserAllowedToLogin(email, password) {
//   for (const property in users) {
//     if(email == users[property].email && password == users[property].password) {
//       return true;
//     }   
//   }
//   return false;
// }

// function matchUserIdWithEmail(email) {
//   for (const property in users) {
//     if(email == users[property].email) {
//       return property;
//     }
//   }
// }

// function containsAllRecipes(sideRecipes, mainRecipes, dessertRecipes) {

//     let allRecipes = [];

//     sideRecipes.forEach((element) => allRecipes.push(element));
//     mainRecipes.forEach((element) => allRecipes.push(element));
//     dessertRecipes.forEach((element) => allRecipes.push(element));

//   return allRecipes;

// }
