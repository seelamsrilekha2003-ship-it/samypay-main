import AdminMenu from "../pages/profile/AdminMenu";

export default function Topbar() {
  return (
    <div
      style={{
        height: "60px",
        background: "#0b4cc9",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 20px",
        gap: "30px"
      }}
    >
      <span>My Wallet : ₹ 0</span>
      <AdminMenu />
    </div>
  );
}
