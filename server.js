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

const { sides, mains, desserts, favrecipe, randMeals, users } = require('./db/index');


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
  if(users[req.cookies.user_id]) {
    res.redirect("/home");
  }
  res.render("registration");    
});  

app.get("/login", (req, res) => {
  if(users[req.cookies.user_id]) {
    res.redirect("/home");
  }
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