import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview.js";
import "../style/reports.css";

/* ─── Mini circular score ring ───────────────────────────────── */
function MiniScoreRing({ score }) {
  // r=21 → circumference = 2π×21 ≈ 132
  const CIRCUMFERENCE = 132;
  const offset =
    typeof score === "number"
      ? CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
      : CIRCUMFERENCE;

  return (
    <div className="report-score-ring">
      <svg className="report-score-svg" viewBox="0 0 48 48">
        <circle className="report-score-bg" cx="24" cy="24" r="21" />
        <circle
          className="report-score-fill"
          cx="24"
          cy="24"
          r="21"
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="report-score-text">
        <span className="report-score-value">
          {typeof score === "number" ? score : "–"}
        </span>
        <span className="report-score-pct">
          {typeof score === "number" ? "%" : ""}
        </span>
      </div>
    </div>
  );
}

/* ─── Skeleton row ────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="report-card-skeleton">
      <div className="skeleton skeleton-circle-sm" />
      <div className="skeleton-lines">
        <div className="skeleton skeleton-line long" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  );
}

/* ─── Format date helper ──────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ─── Main Reports Page ───────────────────────────────────────── */
export default function Reports() {
  const navigate = useNavigate();
  const { interviewReports, loading, handleGetAllInterviewReports } =
    useInterview();

  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    handleGetAllInterviewReports().catch((err) => {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load reports."
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * The API returns { message, data: [ ...reports ] }
   * getAllInterviewReports() returns response.data (the full wrapper).
   * So interviewReports = { message, data: [...] }
   * Actual array lives at interviewReports.data
   */
  const reports = interviewReports?.data ?? interviewReports ?? [];
  const list = Array.isArray(reports) ? reports : [];

  return (
    <div className="reports-page">
      {/* Header */}
      <header className="reports-header">
        <button
          className="reports-header-back"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <div className="reports-header-title">
          <h1>Previous Reports</h1>
          <p>All your generated interview preparation reports</p>
        </div>
      </header>

      {/* Body */}
      <div className="reports-body">
        {/* ── Loading ── */}
        {loading && (
          <>
            {[1, 2, 3, 4].map((n) => (
              <SkeletonRow key={n} />
            ))}
          </>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="reports-state">
            <span className="reports-state-icon">⚠️</span>
            <p className="reports-state-title">Something went wrong</p>
            <p className="reports-state-msg">{error}</p>
            <button
              className="reports-state-btn"
              onClick={() => {
                setError(null);
                handleGetAllInterviewReports().catch((e) =>
                  setError(e?.message || "Failed to load reports.")
                );
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && list.length === 0 && (
          <div className="reports-state">
            <span className="reports-state-icon">📄</span>
            <p className="reports-state-title">No reports yet</p>
            <p className="reports-state-msg">
              Generate your first interview report from the home page.
            </p>
            <button
              className="reports-state-btn"
              onClick={() => navigate("/")}
            >
              Create a report
            </button>
          </div>
        )}

        {/* ── Report list ── */}
        {!loading && !error && list.length > 0 && (
          <>
            <p className="reports-count">
              <span>{list.length}</span>{" "}
              {list.length === 1 ? "report" : "reports"} found
            </p>

            {list.map((report) => (
              <div
                key={report._id}
                className="report-card"
                onClick={() => navigate(`/interview/${report._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/interview/${report._id}`)
                }
              >
                {/* Score ring */}
                <MiniScoreRing score={report.matchScore} />

                {/* Info */}
                <div className="report-card-info">
                  <div className="report-card-title">
                    {report.jobTitle ?? "Interview Report"}
                  </div>
                  <div className="report-card-meta">
                    {report.createdAt && (
                      <span>🗓 {formatDate(report.createdAt)}</span>
                    )}
                    {typeof report.matchScore === "number" && (
                      <span>🎯 {report.matchScore}% match</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <span className="report-card-arrow">→</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
