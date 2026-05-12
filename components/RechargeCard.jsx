import React from "react";
import "../assets/styles/Dashboard.css";

export default function RechargeCard() {
  return (
    <div className="card recharge-card">
      <div className="card-header">
        <h4>Mobile Recharge</h4>
        <img src="https://via.placeholder.com/88x32?text=BharatConnect" alt="provider" className="provider-logo" />
      </div>

      <div className="recharge-type">
        <button className="type active">Prepaid</button>
        <button className="type">Postpaid</button>
      </div>

      <div className="form-group">
        <input placeholder="Enter Mobile No" />
      </div>

      <div className="form-group">
        <input placeholder="Enter Amount" />
      </div>

      <div className="card-actions">
        <button className="btn primary">Proceed →</button>
        <button className="btn outline">Plan 📄</button>
      </div>
    </div>
  );
}
