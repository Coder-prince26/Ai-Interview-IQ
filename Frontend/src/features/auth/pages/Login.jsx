
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { loading, submitting, error, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isSuccess = await handleLogin({ email, password })

    if (isSuccess) {
      navigate('/')
    }
  }

  if (loading) {
    return (
      <main className="auth-loading">
        <div className="auth-loading__spinner" />
        <h1>Preparing your workspace...</h1>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow--one" />
      <div className="auth-glow auth-glow--two" />

      <section className="auth-shell">

        {/* Left: Branding */}
        <div className="auth-showcase">
          <Link to="/" className="auth-brand">
            <span className="auth-brand__icon">AI</span>
            <span>Interview<span className="auth-brand__accent">IQ</span></span>
          </Link>

          <div className="auth-showcase__content">
            <span className="auth-eyebrow">
              YOUR NEXT CAREER MOVE
            </span>

            <h1>
              Prepare smarter.
              <br />
              <span>Interview better.</span>
            </h1>

            <p>
              Turn your resume into a career strategy.
              Discover skill gaps, practice smarter, and walk into
              your next interview with confidence.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature">
                <span className="auth-feature__icon">✦</span>
                <div>
                  <h3>AI-powered preparation</h3>
                  <p>Practice role-specific interview questions.</p>
                </div>
              </div>

              <div className="auth-feature">
                <span className="auth-feature__icon">↗</span>
                <div>
                  <h3>Know your skill gaps</h3>
                  <p>Understand what to improve before applying.</p>
                </div>
              </div>

              <div className="auth-feature">
                <span className="auth-feature__icon">◎</span>
                <div>
                  <h3>A clearer career roadmap</h3>
                  <p>Build a focused plan for your next opportunity.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="auth-showcase__footer">
            Your next opportunity starts with preparation.
          </p>
        </div>

        {/* Right: Login Form */}
        <div className="auth-form-panel">
          <div className="auth-form-heading">
            <span className="auth-form-heading__badge">
              WELCOME BACK
            </span>

            <h2>Sign in to your account</h2>

            <p>
              Continue your journey towards your dream role.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="input-group">
              <label htmlFor="email">Email address</label>

              <div className="auth-input-wrap">
                <span className="auth-input-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="19"
                    height="19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </span>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="auth-label-row">
                <label htmlFor="password">Password</label>
              </div>

              <div className="auth-input-wrap">
                <span className="auth-input-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="19"
                    height="19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="19"
                      height="19"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 5 9 7-.2.8-1.1 2.2-2.7 3.5" />
                      <path d="M6.2 6.2C4 7.6 2.5 10 3 12c.4 1.5 1.9 3.7 4.8 5.3A10 10 0 0 0 12 19c1.1 0 2.1-.2 3-.5" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="19"
                      height="19"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button primary-button auth-submit"
              disabled={submitting}
            >
              <span>
                {submitting ? 'Signing you in...' : 'Sign in to your account'}
              </span>

              {!submitting && (
                <span className="auth-submit__arrow" aria-hidden="true">
                  →
                </span>
              )}
            </button>

          </form>

          <div className="auth-form-divider">
            <span>YOUR CAREER JOURNEY</span>
          </div>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register">Create an account <span>↗</span></Link>
          </p>

          <p className="auth-legal">
            Built to help you prepare with purpose.
          </p>
        </div>

      </section>
    </main>
  )
}

export default Login