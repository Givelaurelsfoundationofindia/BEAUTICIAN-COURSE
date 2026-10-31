
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Invalid username or password."
        );
      }

      navigate("/admin", { replace: true });

    } catch (error) {
      setError(
        error.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        {/* LOGO */}

        <Link to="/" className="admin-logo">
          <img
            src="/give-laurels-logo.jpeg"
            alt="Give Laurels Foundation"
          />
        </Link>

        {/* LOGIN ICON */}

        <div className="admin-login-icon">
          <span>🔐</span>
        </div>

        <span className="admin-eyebrow">
          ADMINISTRATION
        </span>

        <h1>Welcome Back!</h1>

        <p className="admin-login-description">
          Sign in to manage beautician course registrations.
        </p>

        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          <div className="admin-form-group">

            <label>Admin Username</label>

            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />

          </div>

          <div className="admin-form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

          </div>

          {/* ERROR MESSAGE */}

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login to Dashboard"}
            {!loading && <span> →</span>}
          </button>

        </form>

        {/* BACK TO WEBSITE */}

        <Link to="/" className="admin-back-link">
          ← Back to Main Website
        </Link>

        <div className="admin-login-footer">
          © {new Date().getFullYear()} Give Laurels Foundation of India
        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
