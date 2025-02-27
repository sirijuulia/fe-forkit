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
            alert(data.message)          
            setCredentials({username: "", password: ""})
            setHaveAccount(true)} catch(e) {
                console.log(e)
            }
        } else {
            alert("Please fill in both fields!")
        }
    }

    async function handleSignIn (e) {
        e.preventDefault();
        console.log("now in handleSignIn")
        if (credentials.username && credentials.password) {
            try {
                login(credentials)
        } catch (err) {
            console.log(err.message)
        } }
        else {
            alert("Please fill in both fields!")
        }
    }

  return (
    <div className='login-page'>
        {haveAccount 
        ? 
        <div>
            <button onClick={() => setHaveAccount(!haveAccount)}>Don't have an account? Register!</button>
        <form onSubmit={handleSignIn}>
            <h2>Sign in!</h2>
            <label htmlFor='usernameSignIn'>Username</label>
            <input name="username" id="usernameSignIn" type="text" value={credentials.username} onChange={handleChange}/>
            <label htmlFor='passwordSignIn'>Password</label>
            <input name="password" id="passwordSignIn" type="password" value={credentials.password} onChange={handleChange}/>
            <button>Submit</button>
        </form> 
        </div>
        :
        <div>
        <button onClick={() => setHaveAccount(!haveAccount)}>Already have an account? Log in!</button>
        <form onSubmit={handleRegistration}>
            <h2>Register</h2>
            <label htmlFor='usernameReg'>Username</label>
            <input id="usernameReg" type="text" name="username" value={credentials.username} onChange={handleChange}/>
            <label htmlFor='passwordReg'>Password</label>
            <input id="passwordReg" type="password"name="password" value={credentials.password} onChange={handleChange}/>
            <button>Submit</button>
        </form> 
        </div>}
    </div>
  )
}
