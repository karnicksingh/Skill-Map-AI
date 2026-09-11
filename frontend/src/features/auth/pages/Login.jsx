import React from 'react'
import "./auth.form.scss"


const Login = () => {
  return (
  <main>
   <h1>Login</h1>
    <form>
      <div className="input-group">
    <label htmlFor='email'> Email</label>
    <input placeholder='Enter email address' name='email' id='email'/>
   </div>
      <div className="input-group">
    <label htmlFor='password'>Password</label>
    <input placeholder='Enter password' name='password' id='password'/>
   </div>

   <button> Submit</button>
    </form>
   

  </main>
  )
}

export default Login;
