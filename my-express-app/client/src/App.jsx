import { useEffect, useState } from 'react'
import './App.css'
import AuthContext from './context/AuthContext';
import { Link, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import axios from 'axios';
import User from './pages/User';
import IsLoggedIn from './components/IsLoggedIn';
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

  function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(checkTokenValidity() );
    const authObj = {isLoggedIn, login, logout}
    const navigate = useNavigate();
  
    async function login (credentials) {
      try {
        const {data} = await axios("/api/auth/login", {
          method: "POST", data: credentials
        } )
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        navigate("/")
      } catch(error) {
        alert(error.response.data.message)
        console.log(error)
      }
    }

      function logout () {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      // setCalendar([]);
      // setGroceryList([]);
    }

    function checkTokenValidity () {
        const token = localStorage.getItem("token");
        if (!token) {
          return false;
        } 
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    }
 
  return (
    <div className="app">

      <nav>
        {!isLoggedIn 
        ? ""
        : <button className='logout' onClick={logout}>Log out</button> }
      </nav>
      <AuthContext.Provider value={authObj}>
      <Routes>
        <Route path="/" element={<IsLoggedIn><User /></IsLoggedIn>}
            />
        <Route path="/login" element={
              <Login/>
            } />
        <Route path="/user" element={<IsLoggedIn><User /></IsLoggedIn>} />
       </Routes>
       </AuthContext.Provider>
      </div>
      
    );
  }
  
  export default App;