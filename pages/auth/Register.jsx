import React, { useState, useEffect } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import samyPayLogo from "../../assets/images/samypay-logo.png";
import TypingText from "../../components/TypingText";
import api from "../../api";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Retailer");

  // 5 minute timer
  const [timer, setTimer] = useState(300);

  const roles = ["Distributor", "Retailer", "User"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= OTP TIMER ================= */

  useEffect(() => {
    let interval;

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [otpSent, timer]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  /* ================= SEND OTP ================= */

  const handleRegister = async () => {

    if (!form.name || !form.email || !form.mobile || !form.password || !form.confirm) {
      alert("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Enter valid email");
      return;
    }

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        role: selectedRole
      });

      if (res.data.success) {
        alert(res.data.message);
        if (res.data.otpSent) {
          setOtpSent(true);
          setTimer(300);
        } else {
          // Fallback if backend doesn't support OTP yet
          navigate("/login");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP + REGISTER ================= */

  const handleVerifyOtp = async () => {

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    if (timer === 0) {
      alert("OTP expired");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", {
        mobile: form.mobile,
        otp: otp
      });

      if (res.data.success) {
        alert(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      const message = error.response?.data?.message || "OTP Verification failed.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const getThemeClass = () => {
    return `${selectedRole.toLowerCase()}-theme`;
  };

  return (
    <div className={`login-page ${getThemeClass()}`}>
      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-left">
          <img src={samyPayLogo} alt="SamyPay" />
          <TypingText />
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <h2 className="login-title">{otpSent ? "Verify Email" : "Create Account"}</h2>

          {/* ROLE SELECTOR */}
          {!otpSent && (
            <div className="role-selector" style={{ marginBottom: '20px' }}>
              {roles.map((role) => (
                <div
                  key={role}
                  className={`role-tab ${selectedRole === role ? "active" : ""}`}
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </div>
              ))}
            </div>
          )}

          {!otpSent ? (
            <>
              <input
                className="auth-input"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                className="auth-input"
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />

              <input
                className="auth-input"
                name="mobile"
                type="tel"
                placeholder="Mobile Number (10 digits)"
                maxLength="10"
                value={form.mobile}
                onChange={handleChange}
              />

              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
              />

              <input
                className="auth-input"
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={handleChange}
              />

              <button
                className="login-btn"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : `Continue as ${selectedRole}`}
              </button>

              <div className="bottom-links">
                <p>
                  Already registered? <Link to="/login">Login</Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '20px', color: '#64748b', fontSize: '14px' }}>
                <p>OTP sent to <strong>{form.email}</strong></p>
                <p style={{ color: timer < 60 ? "red" : "#64748b", marginTop: '5px' }}>
                  Expires in: <strong>{formatTime(timer)}</strong>
                </p>
              </div>

              <input
                className="auth-input"
                type="text"
                placeholder="Enter 4-digit OTP"
                maxLength="4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '18px' }}
              />

              <button
                className="login-btn"
                onClick={handleVerifyOtp}
                disabled={loading || timer === 0}
              >
                {loading ? "Verifying..." : timer === 0 ? "OTP Expired" : "Verify & Register"}
              </button>

              <div className="bottom-links">
                <p style={{ cursor: 'pointer', color: '#0b58d6' }} onClick={() => setOtpSent(false)}>
                  Back to Registration
                </p>
              </div>
            </>
          )}

          {!otpSent && (
            <div className="bottom-links">
              {/* Login link is already inside the !otpSent block above */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
