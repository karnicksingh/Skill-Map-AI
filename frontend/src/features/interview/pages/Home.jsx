import React from 'react'
import { useState,useRef } from "react";
import "../style/home.css"
import{ useInterview } from "../hooks/useInterview.js"
import { useAuth } from '../../auth/hooks/useAuth.js'
import {useNavigate} from "react-router"

const Home = () => {
const{handleLogout} = useAuth();
const{loading, handleGenerateInterviewReport} = useInterview();
 
    const[jobDescription, setJobDescription] = useState("");
    const[selfDescription, setSelfDescription] = useState("");
   const resumeInputRef = useRef(null);

   const navigate = useNavigate();

   const handleGenerateReport = async (e) => {
    e.preventDefault();
    if(!resumeInputRef.current.files[0]){
        alert("Please upload a resume");
        return;
    }
    const resumeFile = resumeInputRef.current.files[0];
    const data=await handleGenerateInterviewReport({resume: resumeFile, selfDescription, jobDescription});

    navigate(`/interview/${data?.data?._id}`);

   }


  return (
    <main className="home">

      {/* Page Header */}
      <header className="page-header">
        <div className="page-header-top">
          <div>
            <h1>
              Create Your <span className="highlight">Custom Plan</span>
            </h1>
            <p>
              Paste a job description and upload your resume to generate a
              personalized, winning interview strategy.
            </p>
          </div>
          <button className="prev-reports-btn" onClick={() => navigate("/reports")}>
            📋 Previous Reports
          </button>
        </div>
      </header>

        <div className="intervirew-input-group">

         <div className="left">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea name="jobDescription" id="jobDescription" placeholder=" Enter job description" 
            value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>
        </div>

        <div className="right">

            <div className="input-group">
                <label className="section-label" htmlFor="resume">
                  Upload Resume <span className="badge-best">Best</span>
                </label>
                {/* Visual dropzone — clicking this label triggers the hidden input */}
                <label htmlFor="resume" className="dropzone">
                  <span className="dropzone-icon">☁</span>
                  <span className="dropzone-title">Click to upload or drag &amp; drop</span>
                  <span className="dropzone-sub">PDF only · Max 5MB</span>
                </label>
                {/* Hidden but fully functional native input */}
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf"
                  className="file-hidden"
                    ref={resumeInputRef}

                />
            </div>

            <div className="input-group">
                <label htmlFor="selfDescription">Self Description</label>
                <textarea name="selfDescription" id="selfDescription" placeholder=" Enter self description" 
                value={selfDescription} onChange={(e) => setSelfDescription(e.target.value)}></textarea>
            </div>
            <button className="generate-btn" onClick={handleGenerateReport} disabled={loading}>
              {loading ? "✦ Generating..." : "✦ Submit"}
            </button>

            
        </div>


        </div>
<button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
    </main>

  )
}

export default Home