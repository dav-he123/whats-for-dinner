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

$(document).ready(function () {
  $(".buttonLetsCook").on("click", function () {
    const selectedRadioBtn = $("input[type='radio']:checked").val();

    $(".meal-dish").remove();

    $(".captiondish").empty();
    $(".headercaption").empty();
    $(".headercaption").append("You should make: ");

    if (selectedRadioBtn == "Dessert") {
      $(".captiondish").append(
        desserts[Math.floor(Math.random() * desserts.length)] + "!"
      );
    } else if (selectedRadioBtn == "Main Dish") {
      $(".captiondish").append(
        mains[Math.floor(Math.random() * mains.length)] + "!"
      );
    } else if (selectedRadioBtn == "Side") {
      $(".captiondish").append(
        sides[Math.floor(Math.random() * sides.length)] + "!"
      );
    } else {
      $(".captiondish").append(
        mains[Math.floor(Math.random() * mains.length)] +
          "with a side of " +
          sides[Math.floor(Math.random() * sides.length)] +
          " and " +
          desserts[Math.floor(Math.random() * desserts.length)] +
          " for dessert!"
      );
    }
  });
});
