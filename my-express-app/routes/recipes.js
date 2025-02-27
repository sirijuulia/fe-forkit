const express = require("express");
const router = express.Router();
const axios = require("axios");

const userMustBeLoggedIn = require("../guards/userMustBeLoggedIn");

// Base URL for TheMealDB API
const MEALDB_URL =
  "https://www.themealdb.com/api/json/v1/1";

// search for recipes by query (e.g., "chicken", "pasta")
router.get("/", async (req, res) => {
  const { query } = req.query;
  if (!query)
    return res
      .status(400)
      .json({ error: "Query required" });

  try {
    const response = await axios.get(
      `${MEALDB_URL}/search.php?s=${query}`
    );
    const meals = response.data.meals || [];

    const formattedMeals = meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
    }));

    res.json(formattedMeals);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
});

// get recipe details by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `${MEALDB_URL}/lookup.php?i=${id}`
    );
    const meal = response.data.meals
      ? response.data.meals[0]
      : null;

    if (!meal) {
      return res.status(404).json({ error });
    }

    const formattedRecipe = {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      ingredients: [],
      instructions: meal.strInstructions
        ? meal.strInstructions
            .split("\r\n")
            .filter((line) => line.trim() !== "")
        : [],
    };

    // extract ingredients dynamically
    for (let i = 1; i <= 20; i++) {
      const ingredient =
        meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (
        ingredient &&
        ingredient.trim() !== ""
      ) {
        formattedRecipe.ingredients.push({
          name: ingredient,
          quantity: measure.trim(),
        });
      }
    }

    res.json(formattedRecipe);
  } catch (error) {
    console.error(
      "Error fetching recipe details:",
      error.message
    );
    res.status(500).json({ error });
  }
});

module.exports = router;
