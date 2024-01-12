("use strict");

// Basic express setup:

const PORT = 8080;
var cookieSession = require('cookie-session')
const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const app = express();
const bcrypt = require("bcryptjs");

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));

const func = require("./db/index.js");

const { sides, mains, desserts, randMeals, users, favRecipeObj, userAAAA } = require('./db/index');


app.get("/favrecipes", (req, res) => {

  if(!users[req.session.user_id]) {
    res.redirect("login");
  } else {
    const templateVars = {
      username: users[req.session.user_id],
      favrecipe: func.favRecipeForResectableUser(favRecipeObj, req.session.user_id)
    };
    res.render("favourites", templateVars);
  } 
});

app.get("/home", (req, res) => {

  const templateVars = {
    username: userAAAA[req.session.user_id],
    randMeals: randMeals
  };
  res.render("main", templateVars);
}); 

app.get("/register", (req, res) => { 
  if(users[req.session.user_id]) {
    res.redirect("/home");
  }
  res.render("registration");    
});  

app.get("/login", (req, res) => {
  if(users[req.session.user_id]) {
    res.redirect("/home");
  } else {
    res.render("login");
  }
});

app.get("/viewrecipes", (req, res) => {
  if(!users[req.session.user_id]) {
    res.redirect("/login");
  } else {
    const templateVars = {
      username: users[req.session.user_id],
      allrecipes: func.containsAllRecipes(sides, mains, desserts),  
    };
    res.render("view_recipes", templateVars);
  }
});

app.post("/home/randomselection", (req, res) => {
  if(!users[req.session.user_id]) {
    res.send("Please login to use this functionality.")
  } else {
    randMeals["category"] = req.body.full_course_meal_type;
    randMeals["meal"] = func.randSelect(req.body.full_course_meal_type);
    res.redirect("/home");
  }
});

app.post("/home/addfavrecipe", (req, res) => {
  func.checkUserFavouriteRecipe(randMeals["meal"], req.session.user_id);
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
  func.removeFavRecipe(req.params.favrecipe, req.session.user_id);
  res.redirect("/favrecipes");
});

app.post("/home/deleterecipe/:category/:meal/delete", (req, res) => {
  func.removeSelectedRecipe(req.params);
});

app.post("/login", (req, res) => {

  func.userObjLookUp(req.body.email)
    .then((result) => {

      if(result.email == req.body.email) {
        if(bcrypt.compareSync(req.body.password, result.password)) {
          // console.log(result);  
          // console.log(req.session);
          // req.session.user_id = result.userid;
       
          res.redirect("/home");
        } else {
          res.status(403).send("Check your password.");
        }
      } else {
        res.status(403).send("Check your email.");
      }
  
    })
    .catch((e) => res.send(e));

});

app.post("/logout", (req, res) => {
  req.session.user_id = null;  
  res.redirect("/login");
});

app.post("/register", (req, res) => {

  console.log("REGISTER", req.body.email);

  const userId = func.makeid(6);
  if(func.getUserByEmail(req.body.email) || req.body.email == "" || req.body.password == "") {
    res.status(400).send("400 Bad Request");
  } else {

    const user = req.body;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.id = userId;

    // users[userId] = { id: userId, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)}

    func.addUser(user)
    .then((user) => {
      if (!user) {
        return res.send({ error: "error" });
      }
      res.send("🤗");
    })
    .catch((e) => {
      res.send(e);
    });
  }
  
  req.session.user_id = userId;  
  res.redirect("/home");

});  

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});