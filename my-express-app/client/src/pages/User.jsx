import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import Calendar from '../components/Calendar';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'
import './User.css'

import RecipeSearch from '../components/RecipeSearch';
import MealForm from '../components/MealForm';
import GroceryList from '../components/GroceryList';
import ShoppingList from '../components/ShoppingList';
import RecipeBook from '../components/RecipeBook';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

export default function User() {
    const [calendar, setCalendar] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showMealForm, setShowMealForm] = useState(false);
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [groceryList, setGroceryList] = useState([]);
    const [viewRecipeBook, setViewRecipeBook] = useState(false);
    const [recipeBookRecipe, setRecipeBookRecipe] = useState(null);
    const auth = useContext(AuthContext)

    // fetch meal data & grocery list on load
    useEffect(() => {
        fetchMeals();
        fetchGroceryList();
      }, []);

    //fetch meal data from database
    const fetchMeals = () => {
        fetch("http://localhost:3001/api/meals", {
          headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
        })
          .then((res) => res.json())
          .then((data) => {
              // console.log("📅 Raw Calendar Data:", data); 
            if (Array.isArray(data)) {
              setCalendar(data);
            } else {
              console.warn("No meals found in calendar!", data);
            }
          })
          .catch((error) => console.error("Error fetching meals:", error));
    };
  
        // fetch grocery list from the database
        const fetchGroceryList = () => {
          fetch("http://localhost:3001/api/grocery-list", {
            headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
          })
            .then((response) => response.json())
            .then((data) => {
              if (Array.isArray(data)) {
                setGroceryList(data);
              } else {
                console.error( data);
                setGroceryList([]);
              }
            })
            .catch((error) => console.error("Error fetching grocery list:", error));
        };  
    
      // add a meal & associated groceries
      //sent up with these: selectedDay, selectedMealType, selectedRecipe, ingredients
      const handleAddMeal = async ( day, meal_type, recipe, ingredients, instructions) => {
        try {
        const results = await fetch("http://localhost:3001/api/meals", {
          method: "POST",
          headers: { "Content-Type": "application/json", "authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ day: day, meal_type: meal_type, meal_name: recipe.title, meal_img_url: recipe.image, dbID: recipe.id  }),
        })
        const response = await results.json();
        console.log(response)
        const mealID = response.result[0].insertId;
        const newCalendar = response.updatedMeals;
  
        const ingredientPromises = ingredients.map((item) =>
          fetch("http://localhost:3001/api/grocery-list", {
            method: "POST",
            headers: { "Content-Type": "application/json",  "authorization": `Bearer ${localStorage.getItem("token")}`},
            body: JSON.stringify({ mealID: mealID, item_name: item.name, quantity: item.quantity }),
          }).catch((error) =>
            console.error(`Error saving ingredient ${item.name}:`, error)
          )
        );
        const instructionPromises = instructions.map((item, index) =>
          fetch("http://localhost:3001/api/instructions", {
            method: "POST",
            headers: { "Content-Type": "application/json",  "authorization": `Bearer ${localStorage.getItem("token")}`},
            body: JSON.stringify({ mealID: mealID, step: (index+1), instruction_text: item }),
          }).catch((error) =>
            console.error(`Error saving instructions`, error)
          )
        );
        Promise.all([...ingredientPromises, ...instructionPromises])
        .then(() => {
          setCalendar(newCalendar)
          fetchGroceryList(); // Refresh grocery list
          setShowMealForm(false)}) 
        .catch((error) =>
          console.error("Error updating grocery list:", error)
        );
      }
        catch(error) { console.error("Error adding meal:", error)};
      };
  
        //WORKING OUT HOW TO GET QUANTITIES AS NUM + MEASURE - DIDN'T WORK YET
        // const quantSplitIngredients = ingredients.map((item) => {
        //   const quantitySplit = item.quantity.split(" ");
        //   const quantity_num = quantitySplit[0];
        //   const quantity_measure = quantitySplit[1];
        //   return {name: item.name, quantity_num: quantity_num, quantity_measure: quantity_measure}
        //   }
        // )
  
      // toggle grocery item completion
      //to update, need row, value (&id)
      const handleToggleComplete = (item_name) => {
        const itemToToggle = groceryList.filter((item) => item.item_name === item_name);
        const newState = !itemToToggle[0].completed; 
        fetch(`http://localhost:3001/api/grocery-list/${item_name}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "authorization": `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify({ value: newState, row: "completed" }),
        })
          .then(() => fetchGroceryList())
          .catch((error) =>
            console.error("Error updating grocery list:", error)
          );
        }
  const handleDisplayMeal = (mealID) => {
    setRecipeBookRecipe(mealID);
    setViewRecipeBook(true);

  }
      // function to delete a grocery item
  const handleHideGroceryItem = (item_name) => {
    const itemToHide = groceryList.filter((item) => item.item_name === item_name);
    const newState = !itemToHide[0].hide; 
    console.log(newState)
    fetch(`http://localhost:3001/api/grocery-list/${item_name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "authorization": `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ value: newState, row: "hide" }),
    })
      .then(() => fetchGroceryList())
      .catch((error) =>
        console.error("Error updating grocery list:", error)
      );
    }
  
  //function to delete meal
  const handleDeleteMeal = (event, mealId) => {
    event.stopPropagation();
    fetch(`http://localhost:3001/api/meals/${mealId}`, {
        method: "DELETE", headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
      })
      .then(res => res.json())
      .then(() => {
        fetchGroceryList();
        fetchMeals();
        })
    .catch(error => console.error("Error deleting meal:", error));
  };
  

  return (
    <div>
    <header className="header">
      {/*  <h1 className="app-name"><img className="app-name-image" src="/app-name.png" alt="App Name" /></h1>
      <div className="logo-center"><img className="logo-image" src="/logo.png" alt="logo" /></div> */}
      <button className="add-recipe-btn" onClick={() => setShowPopup(true)}>
        Search Recipes
      </button>
    </header>
    <main className="main-content">
      <Calendar mealPlan={calendar} onDeleteMeal={handleDeleteMeal} onDisplayMeal={handleDisplayMeal}/>
      <GroceryList
        onShowShoppingList= { () => setShowShoppingList(true)}
        ingredients={groceryList}
        onToggleComplete={handleToggleComplete}
        onHideItem={handleHideGroceryItem}
      />
    </main>

    {showPopup && (
      <RecipeSearch
        onClose={() => setShowPopup(false)}
        onSelectRecipe={(recipe) => {
          setSelectedRecipe(recipe);
          setShowPopup(false);
          setShowMealForm(true);
        }}
      />
    )}

    {showMealForm && selectedRecipe && (
    <div className="modal-overlay">
      <div className="modal-content">
        <MealForm
          selectedRecipe={selectedRecipe}
          onClose={() => setShowMealForm(false)}
          onAddMeal={handleAddMeal}
        />
      </div>
    </div>
    )}

    {showShoppingList && (
      <ShoppingList
      ingredients={groceryList}
      onToggleComplete={handleToggleComplete}
      onHideItem={handleHideGroceryItem}
      onClose={() => setShowShoppingList(false)} />
      
    )}

    {viewRecipeBook && (
      <RecipeBook recipeID={recipeBookRecipe} recipeList={calendar}
      onClose={() => {
        setViewRecipeBook(false);
        setRecipeBookRecipe(null);
      }}/>
    )}
    
    </div>
  )
}
