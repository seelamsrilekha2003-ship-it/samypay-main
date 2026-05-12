import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import samyPayLogo from "../../assets/images/samypay-logo.png";
import TypingText from "../../components/TypingText";
import api from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!login || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        username: login,
        password: password
      });

      if (res.data.success) {
        // Store token and user data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert(`Welcome ${res.data.user.name}!`);
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page admin-theme">
      <div className="login-container">
        {/* LEFT */}
        <div className="login-left">
          <img src={samyPayLogo} alt="SamyPay" />
          <TypingText />
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <h2 className="login-title">Login</h2>

          <input
            className="auth-input"
            placeholder="Email or Mobile Number"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="bottom-links">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
