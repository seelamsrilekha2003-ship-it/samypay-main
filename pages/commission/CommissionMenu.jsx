import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function CommissionMenu({ icon, label }) {
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
          <NavLink to="/commission/plans">Plans</NavLink>
          <NavLink to="/commission/slab-master">Slab Master</NavLink>
          <NavLink to="/commission/my-commission">My Commission</NavLink>
        </div>
      )}
    </div>
  );
}
