import React from 'react'
import { useContext } from 'react'
import AuthContext from "../context/AuthContext";
import { Navigate } from 'react-router-dom';

export default function IsLoggedIn({children}) {
    const auth = useContext(AuthContext)
    if (!auth.isLoggedIn) {
        return <Navigate to="/login"/>
    } else {
  return (
    <div>{children}</div>
  )
}}
