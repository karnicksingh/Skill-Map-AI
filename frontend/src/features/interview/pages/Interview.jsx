import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview.js";
import "../style/interview.css";

/* ─── Circular Score Ring ─────────────────────────────────────── */
function ScoreRing({ score }) {
  // Circumference of circle with r=45: 2π×45 ≈ 283
  const CIRCUMFERENCE = 283;
  const offset =
    typeof score === "number"
      ? CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
      : CIRCUMFERENCE;

  return (
    <div className="score-ring-wrapper">
      <svg className="score-ring-svg" viewBox="0 0 100 100">
        <circle className="score-ring-bg" cx="50" cy="50" r="45" />
        <circle
          className="score-ring-fill"
          cx="50"
          cy="50"
          r="45"
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="score-ring-text">
        <span className="score-value">
          {typeof score === "number" ? score : "–"}
        </span>
        <span className="score-label">
          {typeof score === "number" ? "Profile Match" : "No score"}
        </span>
      </div>
    </div>
  );
}

/* ─── Skeleton Loading ────────────────────────────────────────── */
function SkeletonMain() {
  return (
    <div>
      {[1, 2, 3].map((n) => (
        <div key={n} className="skeleton-card">
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line long" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-line full" />
        </div>
      ))}
    </div>
  );
}

function SkeletonRight() {
  return (
    <div style={{ width: "100%" }}>
      <div className="skeleton skeleton-circle" />
      <div className="skeleton skeleton-line medium" style={{ margin: "0 auto 0.5rem" }} />
      <div style={{ marginTop: "1.5rem" }}>
        {[1, 2].map((n) => (
          <div key={n} className="skeleton-card" style={{ marginBottom: "0.85rem" }}>
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line medium" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Question Card ───────────────────────────────────────────── */
function QuestionCard({ question, index }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <article className="question-card">
      <div className="question-number">
        {String(index + 1).padStart(2, "0")}
      </div>
      <p className="question-text">{question.question}</p>

      {question.intention && (
        <div className="question-meta">
          <span className="meta-badge">Intention</span>
        </div>
      )}

      {question.intention && (
        <div className="question-intention">
          <strong>Why:</strong> {question.intention}
        </div>
      )}

      {question.answer && (
        <>
          <button
            className="answer-toggle"
            onClick={() => setShowAnswer((prev) => !prev)}
          >
            {showAnswer ? "▲ Hide guidance" : "▼ Show answer guidance"}
          </button>
          {showAnswer && (
            <div className="answer-block">{question.answer}</div>
          )}
        </>
      )}
    </article>
  );
}

/* ─── Technical Questions Panel ──────────────────────────────── */
function TechnicalPanel({ questions }) {
  if (!questions?.length) {
    return (
      <div className="state-box">
        <span className="state-icon">🔍</span>
        <p className="state-title">No technical questions</p>
        <p className="state-message">
          The report did not include technical questions for this role.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="section-heading">Technical Questions</h2>
      <div className="question-list">
        {questions.map((q, i) => (
          <QuestionCard key={i} question={q} index={i} />
        ))}
      </div>
    </>
  );
}

/* ─── Behavioral Questions Panel ─────────────────────────────── */
function BehavioralPanel({ questions }) {
  if (!questions?.length) {
    return (
      <div className="state-box">
        <span className="state-icon">💬</span>
        <p className="state-title">No behavioral questions</p>
        <p className="state-message">
          The report did not include behavioral questions for this role.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="section-heading">Behavioral Questions</h2>
      <div className="question-list">
        {questions.map((q, i) => (
          <QuestionCard key={i} question={q} index={i} />
        ))}
      </div>
    </>
  );
}

/* ─── Roadmap Panel ───────────────────────────────────────────── */
function RoadmapPanel({ plan }) {
  if (!plan?.length) {
    return (
      <div className="state-box">
        <span className="state-icon">🗓️</span>
        <p className="state-title">No preparation plan</p>
        <p className="state-message">
          The report did not include a preparation plan for this role.
        </p>
      </div>
    );
  }

  const sorted = [...plan].sort((a, b) => (a.day ?? 0) - (b.day ?? 0));

  return (
    <>
      <h2 className="section-heading">Preparation Roadmap</h2>
      <div className="roadmap-list">
        {sorted.map((item, i) => (
          <div key={i} className="roadmap-card">
            <div className="roadmap-day-marker">
              D{item.day ?? i + 1}
            </div>
            <div className="roadmap-content">
              <div className="roadmap-day-label">Day {item.day ?? i + 1}</div>
              <div className="roadmap-focus">{item.focus}</div>
              {item.tasks?.length > 0 && (
                <ul className="roadmap-tasks">
                  {item.tasks.map((task, ti) => (
                    <li key={ti}>{task}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Right Panel ─────────────────────────────────────────────── */
function RightPanel({ report, loading }) {
  if (loading) {
    return (
      <aside className="interview-right-panel">
        <SkeletonRight />
      </aside>
    );
  }

  return (
    <aside className="interview-right-panel">
      {/* Profile Match Score */}
      <div className="match-score-section">
        <div className="match-score-title">Profile Match Score</div>
        <ScoreRing score={report?.matchScore} />
        {/* Matching skills: not in current schema — omit if unavailable */}
      </div>

      {/* Skill Gaps */}
      <div className="skill-gaps-section">
        <div className="panel-section-title">Skill Gaps</div>
        {report?.skillGaps?.length ? (
          report.skillGaps.map((gap, i) => (
            <div key={i} className="skill-gap-card">
              <div className="skill-gap-header">
                <span className="skill-gap-name">{gap.skill}</span>
                {gap.severity && (
                  <span className={`severity-badge ${gap.severity}`}>
                    {gap.severity}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            No skill gaps identified.
          </div>
        )}
      </div>
    </aside>
  );
}

/* ─── Main Interview Page ─────────────────────────────────────── */
const TABS = [
  { id: "technical",  label: "Technical Questions",  icon: "⚙️" },
  { id: "behavioral", label: "Behavioral Questions", icon: "💬" },
  { id: "roadmap",    label: "Roadmap",              icon: "🗓️" },
];

export default function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const {
    interviewReport,
    loading,
    handleFetchInterviewReportById,
  } = useInterview();

  const [activeTab, setActiveTab] = useState("technical");
  const [error, setError]         = useState(null);

  /*
   * The API returns:  { message: "...", data: <interviewReportDoc> }
   * interview.api.js returns response.data (axios response body),
   * so the hook stores the full wrapper.
   *
   * Actual report fields live at:  interviewReport?.data
   */
  const report = interviewReport?.data ?? interviewReport ?? null;

  useEffect(() => {
    // If the report is already loaded in context (came from Home → navigate)
    // and its _id matches the route param, skip re-fetching.
    if (report?._id === interviewId) return;

    // Otherwise fetch (page refresh / direct URL)
    if (interviewId) {
      setError(null);
      handleFetchInterviewReportById(interviewId).catch((err) => {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load the interview report."
        );
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="interview-page">
        <header className="interview-header">
          <button className="header-back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div className="header-title-block">
            <h1>Interview Preparation</h1>
            <div className="header-subtitle">Loading your report…</div>
          </div>
        </header>

        <div className="interview-body">
          {/* Left sidebar skeleton */}
          <nav className="interview-sidebar">
            <div className="sidebar-section-label">Sections</div>
            {TABS.map((t) => (
              <button key={t.id} className="sidebar-nav-btn" disabled>
                <span className="nav-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Main skeleton */}
          <main className="interview-main">
            <SkeletonMain />
          </main>

          {/* Right skeleton */}
          <RightPanel report={null} loading={true} />
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="interview-page">
        <header className="interview-header">
          <button className="header-back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div className="header-title-block">
            <h1>Interview Preparation</h1>
          </div>
        </header>
        <div className="interview-body" style={{ gridTemplateColumns: "1fr" }}>
          <main className="interview-main">
            <div className="state-box">
              <span className="state-icon">⚠️</span>
              <p className="state-title">Something went wrong</p>
              <p className="state-message">{error}</p>
              <button className="state-btn" onClick={() => navigate("/")}>
                Go back home
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* ── No report yet (shouldn't normally be visible) ── */
  if (!report) {
    return (
      <div className="interview-page">
        <header className="interview-header">
          <button className="header-back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div className="header-title-block">
            <h1>Interview Preparation</h1>
          </div>
        </header>
        <div className="interview-body" style={{ gridTemplateColumns: "1fr" }}>
          <main className="interview-main">
            <div className="state-box">
              <span className="state-icon">📄</span>
              <p className="state-title">No report found</p>
              <p className="state-message">
                Generate a report from the home page first.
              </p>
              <button className="state-btn" onClick={() => navigate("/")}>
                Create a report
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* ── Render dashboard ── */
  return (
    <div className="interview-page">
      {/* Header */}
      <header className="interview-header">
        <button className="header-back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <div className="header-title-block">
          <h1>{report.jobTitle ?? "Interview Preparation"}</h1>
          {report.jobTitle && (
            <div className="header-subtitle">Interview Preparation Dashboard</div>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="interview-body">
        {/* Left Sidebar */}
        <nav className="interview-sidebar">
          <div className="sidebar-section-label">Sections</div>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`sidebar-nav-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="interview-main">
          {activeTab === "technical" && (
            <TechnicalPanel questions={report.technicalQuestions} />
          )}
          {activeTab === "behavioral" && (
            <BehavioralPanel questions={report.behavioralQuestions} />
          )}
          {activeTab === "roadmap" && (
            <RoadmapPanel plan={report.preparationPlan} />
          )}
        </main>

        {/* Right Panel */}
        <RightPanel report={report} loading={false} />
      </div>
    </div>
  );
}
