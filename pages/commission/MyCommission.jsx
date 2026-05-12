import React, { useState, useEffect } from "react";
import "../../assets/styles/commission.css";
import "../../assets/styles/Dashboard.css";
import "../../assets/styles/ResponsiveTable.css";
import { FaSearch } from "react-icons/fa";
import { fetchMyCommissions } from "../../api/commission";

export default function MyCommission() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Prepaid Mobile");

  const tabs = ["Prepaid Mobile", "DTH", "Postpaid", "Electricity", "FASTag", "Gas", "Water"];

  /* ============================
     FETCH COMMISSIONS (ONLY ONE SOURCE)
  ============================ */
  useEffect(() => {
    fetchMyCommissions()
      .then((res) => {
        console.log("MY COMMISSIONS API RESPONSE =>", res.data);
        let data = res.data.data || [];


        const mapped = data.map((c) => ({
          id: c.id,
          service: c.service_type || "Mobile",            // DTH / MOBILE
          provider: c.service_provider,       // Airtel Digital TV
          key: c.provider_key,                // ATV / DTV / TTV
          margin: c.commission_value || c.margin || c.amount || 0, // Fallbacks
          status: c.status                    // Active
        }));

        setCommissions(mapped);
      })
      .catch((err) => {
        console.error("Error fetching commissions:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ============================
     FILTER + PAGINATION
  ============================ */

  const filtered = commissions.filter((c) => {
    const provider = c.provider?.toLowerCase() || "";
    const service = c.service?.toLowerCase() || "";

    // Check Search
    const matchesSearch =
      provider.includes(search.toLowerCase()) ||
      service.includes(search.toLowerCase());

    // Check Tab Match
    // Adjust mapping logic to match DB service_type (e.g. MOBILE_RECHARGE, DTH, ELECTRICITY)
    let tabServiceKey = activeTab.toUpperCase();
    if (activeTab === "Prepaid Mobile") tabServiceKey = "MOBILE_RECHARGE";
    if (activeTab === "DTH") tabServiceKey = "DTH_RECHARGE";
    if (activeTab === "Postpaid") tabServiceKey = "POSTPAID";
    if (activeTab === "Electricity") tabServiceKey = "ELECTRICITY";
    if (activeTab === "FASTag") tabServiceKey = "FASTAG";
    if (activeTab === "Gas") tabServiceKey = "GAS";
    if (activeTab === "Water") tabServiceKey = "WATER";

    const matchesTab = service.toUpperCase() === tabServiceKey;

    return matchesSearch && matchesTab;
  });

  const totalEntries = filtered.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const paginated = filtered.slice(startIdx, startIdx + entriesPerPage);

  if (loading) {
    return (
      <div className="dashboard-main" style={{ padding: "24px" }}>
        Loading commissions...
      </div>
    );
  }

  return (
    <div className="dashboard-main" style={{ padding: "24px", background: "#f8f9fa" }}>
      <div className="card" style={{ padding: 0, borderRadius: "8px", border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", background: "#fff" }}>
        {/* HEADER */}
        <div style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0, color: "#334155", fontSize: "16px", fontWeight: "600" }}>My Commission / Dashboard</h3>
          <button style={{
            background: "#0b4cc9",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer"
          }}>
            Excel
          </button>
        </div>

        {/* TABS ROW */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
          marginTop: "10px"
        }}>
          <div style={{
            display: "flex",
            border: "1px solid #0b4cc9",
            borderRadius: "6px",
            overflow: "hidden"
          }}>
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1); // Reset page on tab change
                }}
                style={{
                  background: activeTab === tab ? "#0b4cc9" : "#fff",
                  color: activeTab === tab ? "#fff" : "#334155",
                  border: "none",
                  borderRight: idx !== tabs.length - 1 ? "1px solid #e2e8f0" : "none",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLS (Search) */}
        <div
          style={{
            padding: "15px 20px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Search:</span>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  fontSize: "13px",
                  outline: "none",
                  width: "200px"
                }}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-wrapper" style={{ padding: "0 20px" }}>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse", borderTop: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#475569", textTransform: "uppercase" }}>S.NO</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#475569", textTransform: "uppercase" }}>OPERATOR</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#475569", textTransform: "uppercase" }}>SERVICE TYPE</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#475569", textTransform: "uppercase" }}>COMMISSION/SURCHARGE</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => (
                <tr key={c.id || i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px", fontSize: "13px", color: "#334155" }}>{startIdx + i + 1}</td>
                  <td style={{ padding: "12px", fontSize: "13px", color: "#334155" }}>{c.provider}</td>
                  <td style={{ padding: "12px", fontSize: "13px", color: "#334155" }}>{c.service}</td>
                  <td style={{ padding: "12px", fontSize: "13px", color: "#334155" }}>{c.margin !== null && c.margin !== undefined ? c.margin : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginated.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              No commissions found
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: "20px",
            fontSize: "13px",
            color: "#64748b",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span>
            Showing {totalEntries === 0 ? 0 : startIdx + 1} to{" "}
            {Math.min(startIdx + paginated.length, totalEntries)} of{" "}
            {totalEntries} entries
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "0",
                background: "none",
                border: "none",
                color: currentPage === 1 ? "#cbd5e1" : "#64748b",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: "13px"
              }}
            >
              Previous
            </button>
            <div style={{
              background: "#0b4cc9",
              color: "#fff",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              fontSize: "13px",
              fontWeight: "500"
            }}>
              {currentPage}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                padding: "0",
                background: "none",
                border: "none",
                color: currentPage === totalPages || totalPages === 0 ? "#cbd5e1" : "#64748b",
                cursor: currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
                fontSize: "13px"
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}