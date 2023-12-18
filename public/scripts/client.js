/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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

let favourites = [];

$(document).ready(function () {
  $("#star").hide();

  let favouriteSelections = "";

  $(".buttonLetsCook").on("click", function () {
    $("#star").show();

    const selectedRadioBtn = $("input[type='radio']:checked").val();

    $(".meal-dish").empty();

    $(".captiondish").empty();
    $(".headercaption").empty();
    $(".headercaption").append("You should make: ");

    if (selectedRadioBtn == "Dessert") {
      favouriteSelections =
        desserts[Math.floor(Math.random() * desserts.length)];

      $(".captiondish").append(favouriteSelections + "!");
    } else if (selectedRadioBtn == "Main Dish") {
      favouriteSelections = mains[Math.floor(Math.random() * mains.length)];

      $(".captiondish").append(favouriteSelections + "!");
    } else if (selectedRadioBtn == "Side") {
      favouriteSelections = sides[Math.floor(Math.random() * sides.length)];

      $(".captiondish").append(favouriteSelections + "!");
    } else if (selectedRadioBtn == "Entire Meal") {
      favouriteSelections =
        mains[Math.floor(Math.random() * mains.length)] +
        " with a side of " +
        sides[Math.floor(Math.random() * sides.length)] +
        " and " +
        desserts[Math.floor(Math.random() * desserts.length)] +
        " for dessert";

      $(".captiondish").append(favouriteSelections + "!");
    } else {
      $("#star").hide();
      $(".headercaption").empty();
      $(".headercaption").append("Whoops!");
      $(".captiondish").append("Please select an option before proceeding!");
    }

    if (favourites.includes(favouriteSelections)) {
      star.className = "active";
    } else {
      star.className = "";
    }
  });

  $(".addrecipe").click(function () {
    $(".footer").toggle();
  });

  $(".buttonaddnewrecipe").on("click", function () {
    const inputType = $("#inputtype").val();
    const inputName = $("#inputname").val();

    $(".meal-dish").empty();
    $(".captiondish").empty();
    $(".headercaption").empty();

    if (inputType.toLowerCase() == "side") {
      sides.push(inputName);
      $(".headercaption").append("New side recipe:");
      $(".captiondish").append(inputName);
    } else if (inputType.toLowerCase() == "main dish") {
      mains.push(inputName);
      $(".headercaption").append("New main recipe:");
      $(".captiondish").append(inputName);
    } else if (inputType.toLowerCase() == "dessert") {
      desserts.push(inputName);
      $(".headercaption").append("New dessert recipe:");
      $(".captiondish").append(inputName);
    } else {
      $(".headercaption").append("Recipe type doesn't exist! Pls try again!");
    }

    $("#inputname").val("");
    $("#inputtype").val("");
  });

  $(".buttonclear").on("click", function () {
    $("#star").hide();

    $(".captiondish").empty();
    $(".headercaption").empty();

    $(".meal-dish").empty();

    $(".meal-dish").append(
      '<img src="../images/meal-dish.png" alt="Meal Logo" />'
    );

    console.log("FINAL FAV: " + favourites);

    favourites = [];

    if (star.className == "active") {
      star.className = "";
    }

    console.log("FINAL ARRAY: " + favourites);
  });

  $("#star").on("click", function () {
    console.log("FAV: " + favouriteSelections);

    // console.log(test(1));

    if (this.className == "active") {
      this.className = "";
      const index = favourites.indexOf(favouriteSelections);
      if (index > -1) {
        // only splice array when item is found
        favourites.splice(index, 1); // 2nd parameter means remove one item only
      }
    } else {
      this.className = "active";
      if (!favourites.includes(favouriteSelections)) {
        favourites.push(favouriteSelections);
      }
    }
    console.log(favourites);
  });
});
