import { useState } from 'react'
import {useNavigate , Link} from "react-router"
import  { useAuth } from '../hooks/useAuth.js'
import "./auth.form.css";


const Register =() => {
 const navigate = useNavigate();
 const { loading, handleRegister } = useAuth();

 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");

 const handleSubmit =async (e)=>{
  e.preventDefault();
  await handleRegister({username, email, password});
  console.log("Register finished");
  navigate("/");
  

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
                            value={username}
                            onChange={(e)=> setUsername(e.target.value)}
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
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            
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
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-options">
                    </div>

                   <button type="submit" disabled={loading}>
    {loading ? (
        <>
            <span className="spinner"></span>
            Signing up...
        </>
    ) : (
        "Sign up"
    )}
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
