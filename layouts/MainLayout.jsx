import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import "../assets/styles/MainLayout.css";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile, logic can adjust based on screen width if needed

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} className={sidebarOpen ? "open" : ""} />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}

      {/* MAIN CONTENT */}
      <div className="main">
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}



