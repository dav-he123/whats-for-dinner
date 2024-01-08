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

    let favRecipeObj = [];

    let randMeals = { meal: "", category: "" };

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
    
    function removeFavRecipe(favRecipe, cookieUserId) {
        let i = 0;
        for (const elem of favRecipeObj) {
            if(elem.cookieUserId == cookieUserId && elem.favouriteRecipe == favRecipe) {
                favRecipeObj.splice(i, 1);
            }        
            i++;
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
    
    function getUserByEmail(inputEmail) {
      for (const property in users) {
        if(inputEmail == users[property].email) {
          return true;
        }
      }
      return false;
    }
    
    function emailLookUp(email) {
      for (const property in users) {
        if(email == users[property].email) {
          return true;
        }   
      }
      return false;
    }
    
    function matchUserIdWithEmail(email) {
      for (const property in users) {
        if(email == users[property].email) {
          return property;
        }
      }
    }
    
    function containsAllRecipes(sideRecipes, mainRecipes, dessertRecipes) {
    
        let allRecipes = [];
    
        sideRecipes.forEach((element) => allRecipes.push(element));
        mainRecipes.forEach((element) => allRecipes.push(element));
        dessertRecipes.forEach((element) => allRecipes.push(element));
    
      return allRecipes;
    }   


    function checkUserFavouriteRecipe(favouriteRecipe, cookieUserId) {
        
        if (favRecipeObj.filter(item => item.favouriteRecipe == favouriteRecipe).length == 0){
            favRecipeObj.push({ favouriteRecipe: favouriteRecipe, cookieUserId: cookieUserId });
        }

        return favRecipeObj;
    }

    function favRecipeForResectableUser(favrecipes, cookieUserId) {

        let array = [];

        for (const elem of favrecipes) {
            if(elem.cookieUserId == cookieUserId) {
                array.push(elem.favouriteRecipe)
            }
          }

        return array;

    }

    function userObjLookUp(email) {
        for (const property in users) {
            if(email == users[property].email) {
                return users[property];
            }
        }
    }  

    module.exports = {
        randSelect,
        removeFavRecipe,
        removeSelectedRecipe,
        makeid,
        getUserByEmail,
        emailLookUp,
        matchUserIdWithEmail,
        containsAllRecipes,
        checkUserFavouriteRecipe,
        favRecipeForResectableUser,
        userObjLookUp,
        sides,
        mains,
        desserts,
        randMeals,
        users,
        favRecipeObj
    };