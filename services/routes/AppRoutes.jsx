import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";


/* ===== LAYOUTS ===== */
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import RechargeLayout from "../layouts/RechargeLayout";
import ProtectedRoute from "../components/ProtectedRoute";

/* ===== AUTH PAGES ===== */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ===== DASHBOARD ===== */
import Dashboard from "../pages/dashboard/Dashboard";

/* ===== RECHARGE PAGES ===== */
import MobileRecharge from "../pages/recharge/MobileRecharge";
import Prepaid from "../pages/recharge/Prepaid";
import DTHRecharge from "../pages/recharge/DTHRecharge";
import Electricity from "../pages/recharge/Electricity";
import GooglePlay from "../pages/recharge/GooglePlay";
import GasRecharge from "../pages/recharge/GasRecharge";
import FASTag from "../pages/recharge/FASTag";
import DataCardRecharge from "../pages/recharge/DataCardRecharge";
import LandlineRecharge from "../pages/recharge/LandlineRecharge";
import WaterBillRecharge from "../pages/recharge/WaterBillRecharge";
import RechargePlans from "../pages/recharge/RechargePlans";

/* ===== REPORTS ===== */
import TransactionReport from "../pages/reports/TransactionReport";
import WalletReport from "../pages/reports/WalletReport";
import ComplaintsReport from "../pages/reports/ComplaintsReport";
import OutstandingReport from "../pages/reports/OutstandingReport";
import RechargeHistory from "../pages/reports/RechargeHistory";

/* ===== DAILY REPORTS ===== */
import DayRechargeReport from "../pages/DailyReports/DayRechargeReport";
import DayCollectionReport from "../pages/DailyReports/DayCollectionReport";
import DayRetailerSalesReport from "../pages/DailyReports/DayRetailerSalesReport";
import DistributorSalesReport from "../pages/DailyReports/DistributorSalesReport";

/* ===== SETTINGS ===== */
import Profile from "../pages/settings/Profile";
import GeneralSettings from "../pages/settings/GeneralSettings";
import SettingsMenu from "../pages/settings/SettingsMenu";
import ApiSettings from "../pages/settings/ApiSettings";
import PlanwiseApi from "../pages/settings/PlanwiseApi";
import Complaints from "../pages/settings/Complaints";
import Bank from "../pages/settings/Bank";
import Banner from "../pages/settings/Banner";

import News from "../pages/settings/News";
import ServiceManager from "../pages/settings/ServiceManager";
import DatabaseMigration from "../pages/settings/DatabaseMigration";
import InvalidAmount from "../pages/settings/InvalidAmount";

/* ===== COMMISSION ===== */
import Plans from "../pages/commission/Plans";
import MyCommission from "../pages/reports/MyCommissions";
import CommissionMenu from "../pages/commission/CommissionMenu";
import PlanRules from "../pages/commission/PlanRules";
import SlabMaster from "../pages/commission/SlabMaster";

/* ===== TRANSACTIONS ===== */
import AllTransactions from "../pages/transactions/AllTransactions";
import Failed from "../pages/transactions/Failed";
import Success from "../pages/transactions/Success";

/* ===== USERS ===== */
import Users from "../pages/users/Users";
import UserRoles from "../pages/users/UserRoles";
import UserMenu from "../pages/users/UserMenu";
import EditUser from "../pages/users/EditUser";
import UserList from "../pages/users/UserList";
import UserRights from "../pages/users/UserRights";
import EditRole from "../pages/users/EditRole";

/* ===== WALLET ===== */
import WalletDashboard from "../pages/wallet/walletDashboard";
import AddMoney from "../pages/wallet/AddMoney";
import AdminProfile from "../pages/profile/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= AUTH (NO SIDEBAR / NO NAVBAR) ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= AFTER LOGIN (WITH SIDEBAR + NAVBAR) ================= */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ================= RECHARGE ================= */}
        <Route path="/recharge" element={<RechargeLayout />}>
          <Route index element={<Navigate to="mobile" replace />} />
          <Route path="mobile" element={<MobileRecharge />} />
          <Route path="prepaid" element={<Prepaid />} />
          <Route path="dth" element={<DTHRecharge />} />
          <Route path="electricity" element={<Electricity />} />
          <Route path="googleplay" element={<GooglePlay />} />
          <Route path="gas" element={<GasRecharge />} />
          <Route path="fastag" element={<FASTag />} />
          <Route path="datacard" element={<DataCardRecharge />} />
          <Route path="landline" element={<LandlineRecharge />} />
          <Route path="water" element={<WaterBillRecharge />} />
          <Route path="plans" element={<RechargePlans />} />
        </Route>

        {/* ================= REPORTS ================= */}
        <Route path="/reports/transaction" element={<TransactionReport />} />
        <Route path="/reports/wallet" element={<WalletReport />} />
        <Route path="/reports/complaints" element={<ComplaintsReport />} />
        <Route path="/reports/outstanding" element={<OutstandingReport />} />
        <Route path="/reports/recharge-history" element={<RechargeHistory />} />
        <Route path="/reports/day-recharge" element={<DayRechargeReport />} />
        <Route path="/reports/day-collection" element={<DayCollectionReport />} />
        <Route path="/reports/retailer-sales" element={<DayRetailerSalesReport />} />
        <Route path="/reports/distributor-sales" element={<DistributorSalesReport />} />

        {/* ================= SETTINGS ================= */}
        <Route path="/settings/profile" element={<Profile />} />
        <Route path="/settings/general" element={<GeneralSettings />} />
        <Route path="/settings/api" element={<ApiSettings />} />
        <Route path="/settings/planwise" element={<PlanwiseApi />} />
        <Route path="/settings/complaints" element={<Complaints />} />
        <Route path="/settings/bank" element={<Bank />} />
        <Route path="/settings/banner" element={<Banner />} />
        <Route path="/settings/news" element={<News />} />
        <Route path="/settings/invalid-amount" element={<InvalidAmount />} />
        <Route path="/settings/menu" element={<SettingsMenu />} />
        <Route path="/settings/migration" element={<DatabaseMigration />} />

        {/* ================= TRANSACTIONS ================= */}
        <Route path="/transactions/all" element={<AllTransactions />} />
        <Route path="/transactions/failed" element={<Failed />} />
        <Route path="/transactions/success" element={<Success />} />

        {/* ================= USERS ================= */}
        <Route path="/users" element={<Users />} />
        <Route path="/users/user-list" element={<UserList />} />
        <Route path="/users/UserRoles" element={<UserRoles />} />
        <Route path="/users/menu" element={<UserMenu />} />
        <Route path="/users/edit/:roleName" element={<EditRole />} />
        <Route path="/users/profile/edit/:id" element={<EditUser />} />
        <Route path="/users/rights/:id" element={<UserRights />} />

        {/* ================= WALLET ================= */}
        <Route path="/wallet/dashboard" element={<WalletDashboard />} />
        <Route path="/wallet/add" element={<AddMoney />} />
        <Route path="/profile" element={<AdminProfile />} />

        {/* ================= ADMIN SERVICES MANAGE ================= */}
        <Route path="/settings/services" element={<ServiceManager />} />

        {/* ================= COMMISSION ================= */}
        <Route path="/commission/plans" element={<Plans />} />
        <Route path="/commission/my-commission" element={<MyCommission />} />
        <Route path="/commission/menu" element={<CommissionMenu />} />
        <Route path="/commission/plan-rules/:planId" element={<PlanRules />} />
        <Route path="/commission/slab-master" element={<SlabMaster />} />
      </Route>
    </Routes>
  );
}
