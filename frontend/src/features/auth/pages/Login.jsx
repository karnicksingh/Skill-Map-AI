import React from 'react'
import {useNavigate , Link} from "react-router"


import "./auth.form.css";

const Login = () => {


 const handleSubmit =(e)=>{
  e.preventDefault();
 }

  
    return (
        <main>
            <div className="form-container">

                <div className="small-text">
                    sign in
                </div>

                <h1>Welcome back</h1>

            
                <form onSubmit={handleSubmit}>

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

                        <a href="#">
                            Forgot password?
                        </a>

                    </div>

                    <button type="submit">
                        Sign in
                    </button>

                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <button className="google-button">
                    Continue with Google
                </button>

                <div className="register-text">
                    <p> New here? <Link to="/register">Create an account</Link> </p>
                </div>

            </div>
        </main>
    );
};

export default Login;