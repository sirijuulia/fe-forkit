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
import User from './pages/User';

  function App() {
    const [isLoggedIn, setIsLoggedIn] = useState( !!localStorage.getItem("token"));
    const [userID, setUserID] = useState(localStorage.getItem("userID"));
    const authObj = {isLoggedIn, login, logout, userID}
  
    async function login (credentials) {
      try {
        const {data} = await axios("/api/auth/login", {
          method: "POST", data: credentials
        } )
        localStorage.setItem("token", data.token);
        localStorage.setItem("userID", data.user_id);
        setIsLoggedIn(true);
        setUserID(data.user_id);
        // fetchCalendar();
        // fetchGroceryList();
      } catch(error) {
        console.log(error)
      }
    }

      function logout () {
      localStorage.removeItem("token");
      localStorage.removeItem("userID");
      setIsLoggedIn(false);
      setUserID(0);
      // setCalendar([]);
      // setGroceryList([]);
    }
 
  return (
    <div className="app">

      <nav>
        {!isLoggedIn 
        ? <Link to="/login">Log in</Link>
        : <div><Link to="/">Meal calendar </Link><button onClick={logout}>Log out</button></div>}
      </nav>
      <AuthContext.Provider value={authObj}>
      <Routes>
        
        <Route path="/" element={<User />
          
          }
            />
        <Route path="/login" element={
              <Login/>
            } />
       </Routes>
       </AuthContext.Provider>
      </div>
      
    );
  }
  
  export default App;