import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { toast } from 'sonner'

import './auth.form.css'
import './auth.layout.css'
import './otp-login.css'

const OTP_LENGTH = 6;

const OtpLogin = () => {
  const navigate = useNavigate();
  const { loading, handleSendOtp, handleVerifyOtp } = useAuth();

  const [email, setEmail]     = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [digits, setDigits]   = useState(Array(OTP_LENGTH).fill(''));
  const inputRefs             = useRef([]);

  /* ── Step 1: send OTP ── */
  const handleSendOtpClick = async (e) => {
    e.preventDefault();
    try {
      await handleSendOtp({ email });
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  /* ── Step 2: verify OTP and log in ── */
  const handleVerifyOtpClick = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) {
      toast.error('Please enter the full 6-digit code');
      return;
    }
    try {
      await handleVerifyOtp({ email, otp });
      navigate('/');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  /* ── OTP box helpers ── */
  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    e.preventDefault();
  };

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
            <em>structured &amp; smart.</em>
          </h2>

          <div style={{ position: 'relative' }}>
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
            Sign in once, then let the agent{' '}
            <strong>tailor and re-tailor</strong> your résumé for every
            job you apply to — without starting from scratch each time.
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <main>
          <div className="form-container">

            <div className="small-text">
              {otpSent ? 'verify code' : 'sign in with otp'}
            </div>

            <h1>{otpSent ? 'Check your email' : 'Welcome back'}</h1>

            {/* ── Step 1: email form ── */}
            {!otpSent && (
              <form onSubmit={handleSendOtpClick}>
                <p className="description">
                  Enter your email and we'll send a one-time code — no password needed.
                </p>

                <div className="input-group">
                  <label htmlFor="otp-email">Email</label>
                  <input
                    type="email"
                    id="otp-email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? (
                    <><span className="spinner" />Sending code...</>
                  ) : (
                    'Send code'
                  )}
                </button>
              </form>
            )}

            {/* ── Step 2: OTP entry form ── */}
            {otpSent && (
              <form onSubmit={handleVerifyOtpClick}>
                <p className="description">
                  We sent a 6-digit code to{' '}
                  <strong className="otp-email-highlight">{email}</strong>.
                  It expires in 5 minutes.
                </p>

                <div className="otp-boxes-group">
                  <label className="otp-boxes-label">One-time code</label>
                  <div className="otp-boxes" onPaste={handleDigitPaste}>
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        className="otp-box"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(i, e)}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? (
                    <><span className="spinner" />Verifying...</>
                  ) : (
                    'Verify & sign in'
                  )}
                </button>

                <div className="otp-resend">
                  Didn't receive it?{' '}
                  <button
                    type="button"
                    className="otp-resend-btn"
                    disabled={loading}
                    onClick={() => {
                      setOtpSent(false);
                      setDigits(Array(OTP_LENGTH).fill(''));
                    }}
                  >
                    Change email
                  </button>
                  {' or '}
                  <button
                    type="button"
                    className="otp-resend-btn"
                    disabled={loading}
                    onClick={() => handleSendOtp({ email })}
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

            <div className="register-text">
              <p>
                Use password instead?{' '}
                <Link to="/login">Sign in</Link>
                {' · '}
                New here?{' '}
                <Link to="/register">Create an account</Link>
              </p>
            </div>

          </div>
        </main>
      </div>

    </div>
  );
};

export default OtpLogin;
