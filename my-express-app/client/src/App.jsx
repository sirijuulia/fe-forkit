import { useEffect, useState } from 'react'
import Calendar from './components/Calendar';
import './App.css'
import RecipeSearch from './components/RecipeSearch';
import MealForm from './components/MealForm';
import GroceryList from './components/GroceryList';

/* 
const initialMealPlan = {
  Monday: { Breakfast: "", Lunch: "", Dinner: "" },
  Tuesday: { Breakfast: "", Lunch: "", Dinner: "" },
  Wednesday: { Breakfast: "", Lunch: "", Dinner: "" },
  Thursday: { Breakfast: "", Lunch: "", Dinner: "" },
  Friday: { Breakfast: "", Lunch: "", Dinner: "" },
  Saturday: { Breakfast: "", Lunch: "", Dinner: "" },
  Sunday: { Breakfast: "", Lunch: "", Dinner: "" },
  };
   */

  function App() {
    const [calendar, setCalendar] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showMealForm, setShowMealForm] = useState(false);
    const [groceryList, setGroceryList] = useState([]);
    const [viewMode, setViewMode] = useState("list");
  
    // fetch calendar on load
    useEffect(() => {
      fetchCalendar();
    }, []);
  
    const fetchCalendar = () => {
      fetch("http://localhost:3001/api/calendar")
        .then((res) => res.json())
        .then((data) => {
            //console.log("📅 Raw Calendar Data:", data); 
          if (Array.isArray(data) && data.length > 0) {
            setCalendar(data);
          } else {
            console.warn("No meals found in calendar!", data);
          }
        })
        .catch((error) => console.error("Error fetching calendar:", error));
  };
  
    // add a meal & update UI instantly
    const handleAddMeal = (day, meal_type, recipe) => {
      fetch("http://localhost:3001/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, meal_type, meal_name: recipe.title }),
      })
        .then((res) => res.json())
        .then(() => {
          // update calendar instantly
          setCalendar((prevCalendar) => [
            ...prevCalendar,
            { day, meal_type, meal_name: recipe.title },
          ]);
          setShowMealForm(false);
        })
        .catch((error) => console.error("Error adding meal:", error));
    };
  
    // fetch grocery list from the database
    const fetchGroceryList = () => {
      fetch("http://localhost:3001/api/grocery-list")
        .then((response) => response.json())
        .then((data) => {
          console.log("Grocery List:", data);
          if (Array.isArray(data)) {
            setGroceryList(data);
          } else {
            console.error( data);
            setGroceryList([]);
          }
        })
        .catch((error) => console.error("Error fetching grocery list:", error));
    };
  
    // load grocery list on app start
    useEffect(() => {
      fetchGroceryList();
    }, []);
  
    // add ingredients to the grocery list
    const handleAddGroceryList = (ingredients) => {
      const promises = ingredients.map((item) =>
        fetch("http://localhost:3001/api/grocery-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_name: item.name, quantity: 1 }),
        }).catch((error) =>
          console.error(`Error saving ingredient ${item.name}:`, error)
        )
      );
  
      Promise.all(promises)
        .then(() => fetchGroceryList()) // Refresh grocery list
        .catch((error) =>
          console.error("Error updating grocery list:", error)
        );
    };
  
    // toggle grocery item completion
    const handleToggleComplete = (index) => {
      setGroceryList((prev) => {
        const updatedList = [...prev];
        updatedList[index] = {
          ...updatedList[index],
          completed: !updatedList[index].completed,
        };
  
        const updatedItem = updatedList[index];
  
        fetch(`http://localhost:3001/api/grocery-list/${updatedItem.item_name}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: updatedItem.completed }),
        })
          .then(() => fetchGroceryList())
          .catch((error) =>
            console.error("Error updating grocery list:", error)
          );
  
        return updatedList;
      });
    };

    // function to delete a grocery item
const handleDeleteGroceryItem = (itemName) => {
  fetch(`http://localhost:3001/api/grocery-list/${itemName}`, {
      method: "DELETE",
  })
  .then(res => res.json())
  .then(() => {
      setGroceryList(prevList => prevList.filter(item => item.item_name !== itemName));
  })
  .catch(error => console.error("Error deleting grocery item:", error));
};

const handleDeleteMeal = (mealId) => {
  fetch(`http://localhost:3001/api/calendar/${mealId}`, {
      method: "DELETE",
  })
  .then(res => res.json())
  .then(() => {
      fetch("http://localhost:3001/api/calendar")  // re-fetch calendar after deleting
          .then(res => res.json())
          .then(updatedData => setCalendar(updatedData));
  })
  .catch(error => console.error("Error deleting meal:", error));
};

    return (
      <div className="app">
        <header className="header">
         {/*  <h1 className="app-name"><img className="app-name-image" src="/app-name.png" alt="App Name" /></h1>
          <div className="logo-center"><img className="logo-image" src="/logo.png" alt="logo" /></div> */}
          <button className="add-recipe-btn" onClick={() => setShowPopup(true)}>
            Search Recipes
          </button>
        </header>
  
        <main className="main-content">
          <div>
            <Calendar mealPlan={calendar} onDeleteMeal={handleDeleteMeal}/>
          </div>
  
          <div>
            <GroceryList
              ingredients={groceryList}
              onToggleComplete={handleToggleComplete}
              viewMode={viewMode}
              onDeleteItem={handleDeleteGroceryItem}
            />
          </div>
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
              onAddToGroceryList={handleAddGroceryList}
            />
          </div>
        </div>
      )}
      </div>
    );
  }
  
  export default App;