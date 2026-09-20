import React from 'react'
import { useState } from 'react'
import {useNavigate , Link} from "react-router"
import { useAuth } from '../hooks/useAuth.js'
import {toast} from "sonner"

import "./auth.form.css";
import "./auth.layout.css";

const Login = () => {
    const navigate = useNavigate();

const{ loading, handleLogin } = useAuth();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

 const handleSubmit = async (e)=>{
  e.preventDefault();
   await handleLogin({email, password});
 console.log("Login finished")
 navigate("/");
 }
  
    return (
        <div className="auth-page">

          {/* ── Left decorative panel ── */}
          <div className="auth-left">
            <div className="auth-left-brand">
              Skill<span>Map</span> AI
            </div>

            <div className="auth-left-hero">
              <h2 className="auth-left-heading">
                Your résumé,<br />
                <em>structured & smart.</em>
              </h2>

              <div style={{ position: "relative" }}>
                <div className="auth-card-glow" />
                <div className="auth-resume-card">
                  <span className="auth-resume-card-badge">[ AI analysed ]</span>
                  <div className="auth-resume-card-title">Your résumé, structured</div>
                  <div className="auth-resume-card-sub">name · experience · skills · education</div>
                  <div className="auth-resume-card-lines">
                    <div className="auth-resume-line long" />
                    <div className="auth-resume-line medium" />
                    <div className="auth-resume-line short" />
                    <div className="auth-resume-line long" />
                    <div className="auth-resume-line medium" />
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-left-footer">
              <p>
                Sign in once, then let the agent{" "}
                <strong>tailor and re-tailor</strong> your résumé for every
                job you apply to — without starting from scratch each time.
              </p>
            </div>
          </div>

          {/* ── Right panel  ── */}
          <div className="auth-right">
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

                            <a href="#">
                                Forgot password?
                            </a>

                        </div>

                       <button type="submit" disabled={loading}>
    {loading ? (
        <>
            <span className="spinner"></span>
            Signing in...
        </>
    ) : (
        "Sign in"
    )}
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
          </div>

        </div>
    );
};

export default Login;