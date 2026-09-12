import { useState } from 'react'
import {useNavigate , Link} from "react-router"
const Register =() => {
 const navigate = useNavigate();
 const handleSubmit =(e)=>{
  e.preventDefault();
 }

  
    return (
        <main>
            <div className="form-container">

                <div className="small-text">
                    sign up
                </div>

              <h1>Create an account</h1>

            
                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="form-options">
                    </div>

                    <button type="submit">
                        Sign up
                    </button>

                </form>

                <div className="divider">
                    <span>or</span>
                </div>


                <button className="google-button">
                    Continue with Google
                </button>



              <div className='login-text'>
               <p> Already have an account? <Link to="/login">Sign in</Link> </p>
              </div>

               

            </div>
        </main>
    );
}


export default Register;
