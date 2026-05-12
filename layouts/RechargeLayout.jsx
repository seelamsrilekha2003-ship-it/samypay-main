import { Outlet } from "react-router-dom";
import RechargeNavbar from "../components/RechargeNavbar";

export default function RechargeLayout() {
  return (
    <div className="dashboard-main">
      <h2 style={{ color: "#0b58d6", textAlign: "center", padding: "20px 40px" }}>
        Welcome To SamyPay Recharge
      </h2>

      {/* FIXED NAVBAR */}
      <RechargeNavbar />

      {/* PAGE CONTENT */}
      <Outlet />
    </div>
  );
}