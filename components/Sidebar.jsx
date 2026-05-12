import { useState } from "react";
import "../assets/styles/Sidebar.css";
import { Link } from "react-router-dom";
import samyPayLogo from "../assets/images/samypay-logo.png";

/* ICONS */
import { MdDashboard, MdSettings, MdOutlineAssessment } from "react-icons/md";
import { FaBolt, FaWallet, FaUniversity, FaUsers, FaFlag } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { HiOutlineCurrencyRupee } from "react-icons/hi";

export default function Sidebar({ className, onClose }) {

  /* 🔥 ADDED STATES (ONLY ADDITION) */
  const [walletOpen, setWalletOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [dailyReportOpen, setDailyReportOpen] = useState(false);

  return (

    <aside className={`sidebar ${className || ''}`}>
      {/* LOGO & CLOSE */}
      <div className="logo-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
        <div className="logo">
          <img src={samyPayLogo} alt="SamyPay" style={{ height: '80px' }} />
        </div>
        <button className="close-btn" onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', display: 'none' }}>
          &times;
        </button>
      </div>

      {/* MENU */}
      <ul className="menu">

        {/* DASHBOARD */}
        <li className="menu-item">
          <Link to="/dashboard" onClick={onClose}>
            <span className="icon dashboard"><MdDashboard /></span>
            <span className="text">Dashboard</span>
          </Link>
        </li>

        {/* ADD MONEY */}
        <li className="menu-item">
          <Link to="/wallet/add" onClick={onClose}>
            <span className="icon wallet">
              <HiOutlineCurrencyRupee />
            </span>
            <span className="text">Add Money</span>
          </Link>
        </li>


        {/* RECHARGE */}
        <li className="menu-item">
          <Link to="/recharge" onClick={onClose}>
            <span className="icon recharge"><FaBolt /></span>
            <span className="text">Recharges</span>
          </Link>
        </li>

        {/* WALLET (DIRECT LINK) */}
        <li className="menu-item card">
          <Link
            to="/wallet/dashboard"
            onClick={onClose}
          >
            <span className="icon wallet">
              <FaWallet />
            </span>
            <span className="text">Wallet</span>
          </Link>
        </li>



        {/* SETTINGS */}
        <li className="menu-item card">
          <div
            className="menu-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSettingsOpen(!settingsOpen);
            }}
          >
            <span className="icon settings"><MdSettings /></span>
            <span className="text">Settings</span>
            <HiChevronRight className={`arrow ${settingsOpen ? "rotate" : ""}`} />
          </div>

          {settingsOpen && (
            <ul className="submenu">
              <li><Link to="/settings/profile" onClick={onClose}>Profile</Link></li>
              <li><Link to="/settings/api" onClick={onClose}>API Settings</Link></li>
              <li><Link to="/settings/services" onClick={onClose}>Services</Link></li>
              <li><Link to="/settings/planwise" onClick={onClose}>Planwise API</Link></li>
              <li><Link to="/settings/complaints" onClick={onClose}>Complaints</Link></li>
              <li><Link to="/settings/invalid" onClick={onClose}>Invalid Amount</Link></li>
              <li><Link to="/settings/bank" onClick={onClose}>Bank</Link></li>
              <li><Link to="/settings/banner" onClick={onClose}>Banner</Link></li>
              <li><Link to="/settings/news" onClick={onClose}>News</Link></li>
              <li><Link to="/settings/migration" onClick={onClose}>Database Migration</Link></li>
            </ul>
          )}
        </li>

        {/* COMMISSION */}
        <li className="menu-item card">
          <div
            className="menu-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCommissionOpen(!commissionOpen);
            }}
          >
            <span className="icon commission"><FaUniversity /></span>
            <span className="text">Commission</span>
            <HiChevronRight className={`arrow ${commissionOpen ? "rotate" : ""}`} />
          </div>

          {commissionOpen && (
            <ul className="submenu">
              <li><Link to="/commission/plans" onClick={onClose}>Plans</Link></li>
              <li><Link to="/commission/slab-master" onClick={onClose}>Slab Master</Link></li>
              <li><Link to="/commission/my-commission" onClick={onClose}>My Commission</Link></li>
            </ul>
          )}
        </li>

        {/* USERS */}
        <li className="menu-item card">
          <div
            className="menu-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUsersOpen(!usersOpen);
            }}
          >
            <span className="icon users"><FaUsers /></span>
            <span className="text">User</span>
            <HiChevronRight className={`arrow ${usersOpen ? "rotate" : ""}`} />
          </div>

          {usersOpen && (
            <ul className="submenu">
              <li><Link to="/users" onClick={onClose}>All Users</Link></li>
              <li><Link to="/users/user-list" onClick={onClose}>User List</Link></li>
              <li><Link to="/users/UserRoles" onClick={onClose}>User Roles</Link></li>
            </ul>
          )}
        </li>

        {/* REPORT */}
        <li className="menu-item card">
          <div
            className="menu-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setReportOpen(!reportOpen);
            }}
          >
            <span className="icon report"><MdOutlineAssessment /></span>
            <span className="text">Report</span>
            <HiChevronRight className={`arrow ${reportOpen ? "rotate" : ""}`} />
          </div>

          {reportOpen && (
            <ul className="submenu">
              <li><Link to="/reports/transaction" onClick={onClose}>Transaction Report</Link></li>
              <li><Link to="/reports/wallet" onClick={onClose}>Wallet Report</Link></li>
              <li><Link to="/reports/recharge-history" onClick={onClose}>Recharge History</Link></li>
              <li><Link to="/reports/complaints" onClick={onClose}>Complaints Report</Link></li>
              <li><Link to="/reports/outstanding" onClick={onClose}>Outstanding Report</Link></li>
            </ul>
          )}
        </li>

        {/* DAILY REPORT */}
        <li className="menu-item card">
          <div
            className="menu-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDailyReportOpen(!dailyReportOpen);
            }}
          >
            <span className="icon daily"><FaFlag /></span>
            <span className="text">Daily Report</span>
            <HiChevronRight className={`arrow ${dailyReportOpen ? "rotate" : ""}`} />
          </div>

          {dailyReportOpen && (
            <ul className="submenu">

              <li><Link to="/reports/day-recharge" onClick={onClose}>Day Recharge Report</Link></li>
              <li><Link to="/reports/day-collection" onClick={onClose}>Day Collection Report</Link></li>
              <li><Link to="/reports/retailer-sales" onClick={onClose}>Retailer Sales</Link></li>
              <li><Link to="/reports/distributor-sales" onClick={onClose}>Distributor Sales</Link></li>
            </ul>
          )}
        </li>

      </ul>
    </aside>
  );
}


