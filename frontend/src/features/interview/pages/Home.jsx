import React from 'react'
import "../style/home.css"

const Home = () => {
  return (
    <main className="home">

      {/* Page Header */}
      <header className="page-header">
        <h1>
          Create Your <span className="highlight">Custom Plan</span>
        </h1>
        <p>
          Paste a job description and upload your resume to generate a
          personalized, winning interview strategy.
        </p>
      </header>

        <div className="intervirew-input-group">

         <div className="left">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea name="jobDescription" id="jobDescription" placeholder=" Enter job description"></textarea>
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
                />
            </div>

            <div className="input-group">
                <label htmlFor="selfDescription">Self Description</label>
                <textarea name="selfDescription" id="selfDescription" placeholder=" Enter self description"></textarea>
            </div>
            <button className="generate-btn">Submit</button>
        </div>


        </div>

    </main>

  )
}

export default Home
