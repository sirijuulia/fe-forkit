import { useEffect, useState } from 'react'
import Calendar from './components/Calendar';
import './App.css'
import RecipeSearch from './components/RecipeSearch';
import MealForm from './components/MealForm';
import GroceryList from './components/GroceryList';
import ShoppingList from './components/ShoppingList';
import AuthContext from './context/AuthContext';
import { Link, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import axios from 'axios';

  function App() {
    const [calendar, setCalendar] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showMealForm, setShowMealForm] = useState(false);
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [groceryList, setGroceryList] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const [isLoggedIn, setIsLoggedIn] = useState( !!localStorage.getItem("token"));
    const [userID, setUserID] = useState(5);
    const authObj = {isLoggedIn, login, logout, userID}
  
    // fetch calendar on load
    useEffect(() => {
      fetchCalendar();
    }, []);
  
    // load grocery list on app start
    useEffect(() => {
      fetchGroceryList();
    }, []);

    async function login (credentials) {
      try {
        const {data} = await axios("/api/auth/login", {
          method: "POST", data: credentials
        } )
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true)
        setUserID(data.user_id)
        console.log(data)
      } catch(error) {
        console.log(error)
      }
    }

    function logout () {
      localStorage.removeItem("token")
      setIsLoggedIn(false)
      setUserID(0)
    }

    //fetch calendar from database
    const fetchCalendar = () => {
      fetch("http://localhost:3001/api/calendar", {
        headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
      })
        .then((res) => res.json())
        .then((data) => {
            // console.log("📅 Raw Calendar Data:", data); 
          if (Array.isArray(data) && data.length > 0) {
            setCalendar(data);
          } else {
            console.warn("No meals found in calendar!", data);
          }
        })
        .catch((error) => console.error("Error fetching calendar:", error));
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
    //need userID (currently missing), day, meal_type, meal_name & meal_img_url
    const handleAddMeal = async (userID, day, meal_type, recipe, ingredients) => {
      console.log(`Logging from handleAddMeal, ${userID}, ${day}, ${meal_type}, ${recipe.title}, ${recipe.image}, ${recipe.id}`)
      try {
      const results = await fetch("http://localhost:3001/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json", "authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userID, day, meal_type, meal_name: recipe.title, meal_img_url: recipe.image, dbID: recipe.id  }),
      })
      const response = await results.json();
      console.log(response)
      const mealID = response.result[0].insertId;
      const newCalendar = response.updatedCalendar;

      const promises = ingredients.map((item) =>
        fetch("http://localhost:3001/api/grocery-list", {
          method: "POST",
          headers: { "Content-Type": "application/json",  "authorization": `Bearer ${localStorage.getItem("token")}`},
          body: JSON.stringify({ userID: userID, mealID: mealID, item_name: item.name, quantity: item.quantity }),
        }).catch((error) =>
          console.error(`Error saving ingredient ${item.name}:`, error)
        )
      );
      Promise.all(promises)
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
    const handleToggleComplete = (item_name) => {
      const itemToToggle = groceryList.filter((item) => item.item_name === item_name);
      const newState = !itemToToggle[0].completed; 
      console.log(newState);
      fetch(`http://localhost:3001/api/grocery-list/${item_name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ completed: newState }),
      })
        .then(() => fetchGroceryList())
        .catch((error) =>
          console.error("Error updating grocery list:", error)
        );
      }

    // function to delete a grocery item
const handleDeleteGroceryItem = (item_name) => {
  fetch(`http://localhost:3001/api/grocery-list/${item_name}`, {
      method: "DELETE", headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
  })
  .then(res => res.json())
  .then(() => {
    fetchGroceryList();
  })
  .catch(error => console.error("Error deleting grocery item:", error));
};

//function to delete meal
const handleDeleteMeal = (mealId) => {
  fetch(`http://localhost:3001/api/calendar/${mealId}`, {
      method: "DELETE", headers: {"authorization": `Bearer ${localStorage.getItem("token")}`}
    })
    .then(res => res.json())
    .then(() => {
      fetch("http://localhost:3001/api/calendar")  // re-fetch calendar after deleting
          .then(res => res.json())
          .then(updatedData => setCalendar(updatedData));
      })
      .then(() => {
        fetchGroceryList()
      })
  .catch(error => console.error("Error deleting meal:", error));
};

  return (
    <div className="app">
      <nav>
        {!isLoggedIn 
        ? <Link to="/login">Log in</Link>
        : <div><Link to="/">Meal calendar </Link><button onClick={logout}>Log out</button></div>}
      </nav>
      <Routes>
        <Route path="/" element={
      <AuthContext.Provider value={authObj}>
      <header className="header">
        {/*  <h1 className="app-name"><img className="app-name-image" src="/app-name.png" alt="App Name" /></h1>
         <div className="logo-center"><img className="logo-image" src="/logo.png" alt="logo" /></div> */}
         <button className="add-recipe-btn" onClick={() => setShowPopup(true)}>
           Search Recipes
          </button>
      </header>
      <main className="main-content">
          <Calendar mealPlan={calendar} onDeleteMeal={handleDeleteMeal}/>
          <GroceryList
            onShowShoppingList= { () => setShowShoppingList(true)}
            ingredients={groceryList}
            onToggleComplete={handleToggleComplete}
            viewMode={viewMode}
            onDeleteItem={handleDeleteGroceryItem}
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
         onDeleteItem={handleDeleteGroceryItem}
         onClose={() => setShowShoppingList(false)}
         />
       )} 
       </AuthContext.Provider>}/>
       <Route path="/login" element={
        <AuthContext.Provider value={authObj}>
        <Login/>
        </AuthContext.Provider>} />
       </Routes>
      </div>
      
    );
  }
  
  export default App;