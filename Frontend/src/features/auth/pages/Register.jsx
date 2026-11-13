
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, submitting, error, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSuccess = await handleRegister({
      username,
      email,
      password,
    });

    if (isSuccess) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <main className="auth-loading">
        <div className="auth-loading__spinner" />
        <p>Preparing your workspace...</p>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow--one" />
      <div className="auth-glow auth-glow--two" />

      <div className="auth-shell">
        {/* LEFT SIDE */}
        <section className="auth-showcase">
          <Link to="/login" className="auth-brand">
            <span className="auth-brand__icon">✦</span>

            <span>
              Interview<span className="auth-brand__accent">IQ</span>
            </span>
          </Link>

          <div className="auth-showcase__content">
            <div className="auth-eyebrow">
              <span className="auth-eyebrow__dot" />
              YOUR NEXT CHAPTER STARTS HERE
            </div>

            <h1>
              Your potential.
              <br />
              Your preparation.
              <br />
              <span>Your breakthrough.</span>
            </h1>

            <p className="auth-showcase__description">
              Build confidence, identify skill gaps, and prepare smarter
              with your personal AI-powered interview coach.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature">
                <span className="auth-feature__icon">✧</span>

                <div>
                  <h3>AI-powered preparation</h3>
                  <p>Practice with intelligent interview questions.</p>
                </div>
              </div>

              <div className="auth-feature">
                <span className="auth-feature__icon">↗</span>

                <div>
                  <h3>Know your skill gaps</h3>
                  <p>Discover what to improve before your next interview.</p>
                </div>
              </div>

              <div className="auth-feature">
                <span className="auth-feature__icon">◎</span>

                <div>
                  <h3>Stand out with confidence</h3>
                  <p>Prepare your resume for your dream opportunity.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-showcase__footer">
            <span>BUILT FOR YOUR NEXT BIG OPPORTUNITY</span>
            <span className="auth-footer-dot">✦</span>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-form-panel">
          <div className="auth-form-heading">
            <div className="auth-form-heading__badge">
              <span>✦</span>
            </div>

            <p className="auth-form-heading__eyebrow">
              START YOUR JOURNEY
            </p>

            <h2>Create your account</h2>

            <p className="auth-form-heading__description">
              Set up your workspace and start preparing smarter.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div className="input-group">
              <label htmlFor="username">Full name or username</label>

              <div className="auth-input-wrap">
                <span className="auth-input-icon" aria-hidden="true">
                  ♙
                </span>

                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  minLength={3}
                  maxLength={30}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="email">Email address</label>

              <div className="auth-input-wrap">
                <span className="auth-input-icon" aria-hidden="true">
                  ✉
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

            {/* PASSWORD */}
            <div className="input-group">
              <div className="auth-label-row">
                <label htmlFor="password">Password</label>
                <span className="auth-label-hint">Min. 8 characters</span>
              </div>

              <div className="auth-input-wrap">
                <span className="auth-input-icon" aria-hidden="true">
                  ◈
                </span>

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                <span aria-hidden="true">!</span>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button primary-button auth-submit"
              disabled={submitting}
            >
              <span>
                {submitting ? "Creating your account..." : "Create account"}
              </span>

              {!submitting && (
                <span className="auth-submit__arrow" aria-hidden="true">
                  →
                </span>
              )}
            </button>

            <p className="auth-legal">
              By creating an account, you agree to use InterviewIQ
              responsibly.
            </p>
          </form>

          <div className="auth-form-divider">
            <span />
            <p>ALREADY PART OF THE JOURNEY?</p>
            <span />
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in instead <span>→</span></Link>
          </p>

          <div className="auth-form-bottom">
            <span>✦</span> YOUR CAREER. YOUR NEXT MOVE.
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;