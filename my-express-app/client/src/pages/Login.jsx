import React from 'react'
import { useContext, useState } from 'react'
import "./login.css"
import AuthContext from '../context/AuthContext'
import axios from 'axios'


export default function Login() {
    const auth = useContext(AuthContext);
    const login = async (data) => {
        console.log("now in login")
        console.log(`Credentials: ${credentials}`)
        console.log(`Auth: ${auth}`)
        auth.login(data)
    }
    const [haveAccount, setHaveAccount] = useState(false)
    const [credentials, setCredentials] = useState({username: "", password: ""})
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const tempCredentials = {...credentials};
        tempCredentials[name] = value;
        setCredentials(tempCredentials)
    }

    async function handleRegistration (e) {
        e.preventDefault();
        if (credentials.username && credentials.password) {
            try {
            const {data} = await axios("/api/auth/register", {
                method:"POST",
                data: credentials
            })
            if (data.message === "Registration successful - please sign in to use Fork It!") {
                setHaveAccount(true); }
            setCredentials({username: "", password: ""})
            alert(data.message)
        } catch(e) {
                console.log(e)
            }
        } else {
            alert("Please fill in both fields!")
        }
    }

    async function handleSignIn (e) {
        e.preventDefault();
        if (credentials.username && credentials.password) {
            try {
                login(credentials);
        } catch (err) {
            console.log("It's this error!")
            setCredentials({username: "", password: ""})
            
        } }
        else {
            alert("Please fill in both fields!")
        }
    }

  return (
    <div className='login-container'>
    <div className='login-page'>
        {haveAccount 
        ? 
        <div className='login-content'>
        <form className='login-form' onSubmit={handleSignIn}>
            <h2>Welcome back!</h2>
            <h3>Sign in to access your delicious recipes</h3>
            <div className='login-inputs'>
            <label htmlFor='usernameSignIn'>Username</label>
            <input name="username" id="usernameSignIn" type="text" value={credentials.username} onChange={handleChange}/>
            <label htmlFor='passwordSignIn'>Password</label>
            <input name="password" id="passwordSignIn" type="password" value={credentials.password} onChange={handleChange}/>
            </div>
            <button className='submit-btn'>Log in</button>
            
        </form> 
        <button className='swap-login-view' onClick={() => setHaveAccount(!haveAccount)}>Don't have an account? Register!</button>
        </div>
        :
        <div className='login-content'>
        <form className='login-form' onSubmit={handleRegistration}>
            <h2>Register</h2>
            <div className='login-inputs'>
            <label htmlFor='usernameReg'>Username</label>
            <input id="usernameReg" type="text" name="username" value={credentials.username} onChange={handleChange}/>
            <label htmlFor='passwordReg'>Password</label>
            <input id="passwordReg" type="password"name="password" value={credentials.password} onChange={handleChange}/>
            </div>
            <button className='submit-btn'>Register</button>
        </form> 
        <button className='swap-login-view' onClick={() => setHaveAccount(!haveAccount)}>Already have an account? Log in!</button>
        </div>}
    </div>
    </div>
  )
}
