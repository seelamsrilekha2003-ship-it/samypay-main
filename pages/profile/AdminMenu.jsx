import React from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import AdminDropdown from "./AdminDropdown";

export default function AdminDropdown() {
  return (
    <>
      {/* ===== INLINE CSS ===== */}
      <style>
        {`
        .admin-wrapper {
          position: relative;
          display: inline-block;
        }

        .admin-btn {
          background: #0b4cc9;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
        }

        .admin-dropdown {
          position: absolute;
          right: 0;
          top: 45px;
          width: 180px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          padding: 12px 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s ease;
          z-index: 999;
        }

        .admin-wrapper:hover .admin-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .welcome-text {
          font-size: 12px;
          font-weight: 600;
          color: #555;
          padding: 6px 16px;
          margin-bottom: 6px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          cursor: pointer;
          font-size: 14px;
          color: #333;
        }

        .dropdown-item:hover {
          background: #f1f5f9;
        }

        .dropdown-item.logout {
          color: #dc2626;
        }

        .icon {
          font-size: 16px;
        }
        `}
      </style>

      {/* ===== COMPONENT ===== */}
      <div className="admin-wrapper">
        <button className="admin-btn">ADMIN</button>

        <div className="admin-dropdown">
          <p className="welcome-text">WELCOME!</p>

          <div className="dropdown-item">
            <FaUser className="icon" />
            <span>Profile</span>
          </div>

          <div className="dropdown-item logout">
            <FaSignOutAlt className="icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
}
