import React from 'react'
import { useState } from 'react'
 import {useAuth} from '../hooks/useAuth.js'
 import{Navigate} from "react-router"

const Protected = ({children}) => {
  const { user,loading} = useAuth();

  if(loading){
    return (<main ><h1>Loading...</h1></main>)
  }

  if(!user){
    console.log("Access Denied");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default Protected;
