import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function DayReportsMenu({ icon, label }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="settings-simple">
      <div
        className="settings-title"
        onClick={() => setOpen(!open)}
      >
        <span className="icon">{icon}</span>
        <span className="text">{label}</span>
        <span className={`arrow ${open ? "rotate" : ""}`}>▼</span>
      </div>

      {open && (
        <div className="settings-list">
          <NavLink to="/reports/day-recharge">Recharge Report</NavLink>
          <NavLink to="/reports/day-collection">Collection Report</NavLink>
          <NavLink to="/reports/retailer-sales">Retailer Sales Report</NavLink>
          <NavLink to="/reports/distributor-sales">Distributor Sales Report</NavLink>
        </div>
      )}
    </div>
  );
}
