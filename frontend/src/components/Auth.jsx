import { useState } from "react";

import apiRequest from "../utils/api";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";

      const payload = isLogin ? { email, password } : { name, email, password };

      const data = await apiRequest(`/auth/${endpoint}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (isLogin) {
        onLogin(data.token, data.user);
      } else {
        setMessage(data.message || "Registration successful!");

        setName("");
        setEmail("");
        setPassword("");

        setIsLogin(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <p className="auth-subtitle">
          {isLogin
            ? "Login to access your Crypto Tracker"
            : "Create an account to get started"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setError("");
            }}
            className="auth-toggle"
          >
            {isLogin ? "Create an account" : "Login instead"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
