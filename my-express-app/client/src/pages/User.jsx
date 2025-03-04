import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'
import './User.css'
import API from '../interceptors/AxiosInstance';
import axios from 'axios';

import RecipeSearch from '../components/RecipeSearch';
import MealForm from '../components/MealForm';
import GroceryList from '../components/GroceryList';
import ShoppingList from '../components/ShoppingList';
import RecipeBook from '../components/RecipeBook';
import AuthContext from '../context/AuthContext';
import Calendar from '../components/Calendar';


export default function User() {
    const [calendar, setCalendar] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showMealForm, setShowMealForm] = useState(false);
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [groceryList, setGroceryList] = useState([]);
    const [viewRecipeBook, setViewRecipeBook] = useState(false);
    const [recipeBookRecipe, setRecipeBookRecipe] = useState(null);
    const [unresolvedChanges, setUnresolvedChanges] = useState(false);
    const auth = useContext(AuthContext)

    // fetch meal data & grocery list on load
    useEffect(() => {
        fetchMeals();
        fetchGroceryList();
      }, []);

    //fetch meal data from database
    const fetchMeals = async () => {
      try {
        const response = await API.get("/api/meals"); //if it was a post the data would be in an object after the string
        setCalendar(response.data)
      } catch (err) {
        console.error("Error fetching meals", err)
      }
     };
  
        // fetch grocery list from the database
        const fetchGroceryList = async () => {
          try {
          const response = await API.get("/api/grocery-list")
          setGroceryList(response.data)
          } catch (err) {
            console.error("Error fetching grocery list:", error)
          }
        };  
    
      // add a meal & associated groceries
      //sent up with these: selectedDay, selectedMealType, selectedRecipe, ingredients
      const handleAddMeal = async ( day, meal_type, recipe, ingredients, instructions) => {
        try {
          const data = { day: day, meal_type: meal_type, meal_name: recipe.title, meal_img_url: recipe.image, dbID: recipe.id  }
        const response = await API.post("/api/meals", data)
        const mealID = response.data.result[0].insertId;
        const newCalendar = response.data.updatedMeals;
        const existingChanges = groceryList.some ((item) => item.hide || item.completed )
  
        const ingredientPromises = ingredients.map((item) =>{
          const ingredient = { mealID: mealID, item_name: item.name, quantity: item.quantity };
          API.post("/api/grocery-list", ingredient);
        }
        );
        const instructionPromises = instructions.map((item, index) => {
          const instruction = { mealID: mealID, step: (index+1), instruction_text: item };
          API.post("/api/instructions", instruction);
        }
        );
        Promise.all([...ingredientPromises, ...instructionPromises])
        .then(() => {
          setCalendar(newCalendar);
          fetchGroceryList(); // Refresh grocery list
          setShowMealForm(false);
          setUnresolvedChanges(existingChanges);
          })
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
      const handleToggleComplete =  async (item_name) => {
        const itemToToggle = groceryList.filter((item) => item.item_name === item_name);
        const newState = !itemToToggle[0].completed; 
        const data = { value: newState, row: "completed" };
        try{
        await API.put(`/api/grocery-list/${item_name}`, data);
        fetchGroceryList();
        } 
        catch (error) { console.error("Error updating grocery list:", error)
        }
        }
  const handleDisplayMeal = (mealID) => {
    setRecipeBookRecipe(mealID);
    setViewRecipeBook(true);

  }
      // function to delete a grocery item
  const handleHideGroceryItem = async (item_name) => {
    const itemToHide = groceryList.filter((item) => item.item_name === item_name);
    const newState = !itemToHide[0].hide; 
    const data = { value: newState, row: "hide" };
    try {
      await API.put(`/api/grocery-list/${item_name}`, data);
      fetchGroceryList();
    } catch (error) {
      console.error("Error updating grocery list:", error)}
    }
  
  //function to delete meal
  const handleDeleteMeal = async (event, mealId) => {
    event.stopPropagation();
    try {
    await API.delete(`/api/meals/${mealId}`);
    fetchGroceryList();
    fetchMeals();} 
    catch (error) {console.error("Error deleting meal:", error)}
  };

  //function to reset all complete and hide values to false
  const resetGroceries = async () => {
    const resetHide = { value: false, row: "hide" };
    const resetCompleted = {value: false, row: "completed"}
    try {
      const hide = await API.put(`/api/grocery-list`, resetHide);
      const completed = await API.put(`/api/grocery-list`, resetCompleted);
      Promise.all([hide, completed])
        .then(() => {
          fetchGroceryList();
          setUnresolvedChanges(false);})
    } catch (error) {
      console.error("Error updating grocery list:", error)}
    }
  
  return (
    <div>
    <header className="header">
      {/*  <h1 className="app-name"><img className="app-name-image" src="/app-name.png" alt="App Name" /></h1>
      <div className="logo-center"><img className="logo-image" src="/logo.png" alt="logo" /></div> */}
      <button className="add-recipe-btn" onClick={() => setShowPopup(true)}>
        Search Recipes
      </button>
      {unresolvedChanges && <h2>You have unresolved changes!</h2>}
    </header>

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
      onClose={() => setShowShoppingList(false)} 
      unresolvedChanges={unresolvedChanges}
      onReset={resetGroceries}/>
      
    )}

    {viewRecipeBook && (
      <RecipeBook recipeID={recipeBookRecipe} recipeList={calendar} onDisplayMeal={handleDisplayMeal}
      onClose={() => {
        setViewRecipeBook(false);
        setRecipeBookRecipe(null);
      }}/>
    )}

    <main className="main-content">
      <Calendar mealPlan={calendar} onDeleteMeal={handleDeleteMeal} onDisplayMeal={handleDisplayMeal}/>
      <GroceryList
        onShowShoppingList= { () => setShowShoppingList(true)}
        ingredients={groceryList}
        onToggleComplete={handleToggleComplete}
        onHideItem={handleHideGroceryItem}
        unresolvedChanges={unresolvedChanges}
        onReset={resetGroceries}
      />
    </main>

    </div>
  )
}
