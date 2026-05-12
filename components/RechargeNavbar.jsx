import { NavLink } from "react-router-dom";
import "../assets/styles/rechargeNavbar.css";

/* ✅ ADDED ICON IMPORTS (ONLY ADDITION) */
import {
  MdPhoneAndroid,
  MdTv,
 MdLightbulbOutline,
  MdLocalGasStation,
  MdDirectionsCar,
  MdWifi,
  MdPhone,
  MdWaterDrop,
} from "react-icons/md";
import { FaGooglePlay } from "react-icons/fa";

export default function RechargeNavbar() {
  const services = [
    {
      label: "Mobile",
      icon: <MdPhoneAndroid />,
      path: "/recharge/mobile",
    },
    {
      label: "DTH",
      icon: <MdTv />,
      path: "/recharge/dth",
    },
    {
      label: "Electricity",
      icon: <MdLightbulbOutline />,
      path: "/recharge/electricity",
    },
    {
      label: "Google Play",
      icon: <FaGooglePlay />,
      path: "/recharge/googleplay",
    },
    {
      label: "Gas",
      icon: <MdLocalGasStation />,
      path: "/recharge/gas",
    },
    {
      label: "Buy FASTag",
      icon: <MdDirectionsCar />,
      path: "/recharge/fastag",
    },
    {
      label: "Data Card",
      icon: <MdWifi />,
      path: "/recharge/datacard",
    },
    {
      label: "Landline",
      icon: <MdPhone />,
      path: "/recharge/landline",
    },
    {
      label: "Water",
      icon: <MdWaterDrop />,
      path: "/recharge/water",
    },
  ];

  return (
    <div className="recharge-navbar">
      {services.map((service) => (
        <NavLink
          key={service.label}
          to={service.path}
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">{service.icon}</span>
          <span className="nav-text">{service.label}</span>
        </NavLink>
      ))}
    </div>
  );
}


