import { useState, useRef, useEffect } from "react";
import "../assets/styles/Navbar.css";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { usePayment } from "../context/PaymentContext";

export default function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 🔥 WALLET BALANCE FROM CONTEXT
  const { walletBalance } = usePayment();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <button className="hamburger-btn" onClick={toggleSidebar} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#fff', marginRight: '16px' }}>
          ☰
        </button>
      </div>

      {/* CENTER */}
      <div className="nav-mid">
        <div className="welcome">Welcome To SamyPay Recharge</div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        {/* 🔥 LIVE WALLET BALANCE */}
        <span className="wallet">
          My Wallet : ₹ {walletBalance}
        </span>

        {/* ADMIN DROPDOWN */}
        <div className="admin-wrapper" ref={dropdownRef}>
          <span
            className="admin"
            onClick={() => setOpen((prev) => !prev)}
          >
            ADMIN
          </span>

          {open && (
            <div
              className="admin-dropdown"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="dropdown-title">WELCOME!</div>

              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setOpen(false)}
              >
                <FaUser /> Profile
              </Link>

              <div
                className="dropdown-item logout"
                onClick={() => {
                  setOpen(false);
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                <FaSignOutAlt /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}



