import React, { useState, useEffect } from "react";
import "../../assets/styles/Dashboard.css";
import "../../assets/styles/ResponsiveTable.css";
import { usePayment } from "../../context/PaymentContext";
import { FaWifi, FaChevronDown, FaHistory, FaCheckCircle, FaTimesCircle, FaSearch, FaFileExcel, FaCalendarAlt } from "react-icons/fa";
import api from "../../api";

/* ✅ STATIC BROADBAND BILLERS (Fallback if API fails) */
const STATIC_BROADBAND_BILLERS = [
  { id: "423", biller_name: "TJBroadbandNetworkPvtLtd" },
  { id: "422", biller_name: "Meghlink" },
  { id: "421", biller_name: "MSBroadband" },
  { id: "420", biller_name: "CloudskySuperfastBroadband&ServicesPvtLtd" },
  { id: "419", biller_name: "LinkioFibernet" },
  { id: "418", biller_name: "DigiwayNetPvt.Ltd." },
  { id: "417", biller_name: "VILCOM" },
  { id: "416", biller_name: "VDVDigital" },
  { id: "415", biller_name: "InetFiber" },
  { id: "414", biller_name: "INetBroadband" },
  { id: "413", biller_name: "ConfiarBroadband" },
  { id: "412", biller_name: "TICFiberPvt.Ltd." },
  { id: "411", biller_name: "RDSNET" },
  { id: "410", biller_name: "ArjunTelecom" },
  { id: "409", biller_name: "SpiderlinkNetworksPvtLtd" },
  { id: "408", biller_name: "ManasBroadband" },
  { id: "407", biller_name: "BFibernet" },
  { id: "406", biller_name: "NetplusBroadband" },
  { id: "405", biller_name: "CorrelInternet" },
  { id: "404", biller_name: "SmartNetIndiaPvtLtd" },
  { id: "403", biller_name: "SpidernetBroadband" },
  { id: "402", biller_name: "XpressFiber" },
  { id: "401", biller_name: "WishNetPvtLtd" },
  { id: "400", biller_name: "WeeboNetworksPvtLtd" },
  { id: "399", biller_name: "VfibernetBroadband" },
  { id: "398", biller_name: "UdupiFastnetPvtLtd" },
  { id: "397", biller_name: "UCNCable" },
  { id: "396", biller_name: "TimblBroadband" },
  { id: "395", biller_name: "Threesa" },
  { id: "394", biller_name: "TTNBroadBand" },
  { id: "393", biller_name: "TSKGigaFibber" },
  { id: "392", biller_name: "TATAPLAYFIBER" },
  { id: "391", biller_name: "SwiftteleEnterprisesPrivateLimited" },
  { id: "390", biller_name: "SriLakshmiNetworksPrivateLimited" },
  { id: "389", biller_name: "SpeednetUniqueNetwork" },
  { id: "388", biller_name: "Spectra" },
  { id: "387", biller_name: "SkywayTelecomServices" },
  { id: "386", biller_name: "SkywayTelecom" },
  { id: "385", biller_name: "ShineCommunicationsPvtLtd" },
  { id: "384", biller_name: "SSInternet" },
  { id: "383", biller_name: "SRBroadband" },
  { id: "382", biller_name: "SCCNetworkPvtLtd" },
  { id: "381", biller_name: "SBRTelecom" },
  { id: "126", biller_name: "Connect Broadband" },
  { id: "99", biller_name: "HATHWAY BROADBAND" },
  { id: "68", biller_name: "TIKONA INTERNET" }
];

export default function DataCardRecharge() {
  const { setPaymentIntent } = usePayment();

  const [cardNumber, setCardNumber] = useState("");
  const [operator, setOperator] = useState(""); // Operator Name for UI
  const [operatorId, setOperatorId] = useState(""); // Operator Code for API
  const [amount, setAmount] = useState("");

  const [operatorList, setOperatorList] = useState(STATIC_BROADBAND_BILLERS);
  const [loadingOps, setLoadingOps] = useState(false);
  const [showOpSelect, setShowOpSelect] = useState(false);
  const [opSearchTerm, setOpSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  // Filter States
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView] = useState("customer");
  const [details, setDetails] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchOperators();
    fetchHistory();
  }, []);

  useEffect(() => {
    filterData();
  }, [history, fromDate, toDate, searchQuery]);

  /* ✅ FETCH OPERATORS (IMMEDIATE + BACKGROUND UPDATE) */
  const fetchOperators = async () => {
    // ⚡ Set static list immediately so the UI is NEVER empty
    setOperatorList(STATIC_BROADBAND_BILLERS);

    setLoadingOps(true);
    try {
      const res = await api.get("/services/operators/datacard");

      if (res.data.success && res.data.data?.length > 0) {
        const apiOps = res.data.data;
        setOperatorList(prev => {
          let updated = [...prev];
          apiOps.forEach(apiOp => {
            const apiId = apiOp.id || apiOp.operator_code;
            if (!updated.some(s => (s.id || s.operator_code) === apiId)) {
              updated.push(apiOp);
            }
          });
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
    } finally {
      setLoadingOps(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get("/recharge/history");
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const filterData = () => {
    let temp = [...history];

    if (fromDate) {
      temp = temp.filter(item => new Date(item.created_at) >= new Date(fromDate));
    }
    if (toDate) {
      temp = temp.filter(item => new Date(item.created_at) <= new Date(toDate + "T23:59:59"));
    }
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      temp = temp.filter(item =>
        (item.account_number && item.account_number.toLowerCase().includes(lowerQ)) ||
        (item.operator && item.operator.toLowerCase().includes(lowerQ)) ||
        (item.reference_id && item.reference_id.toLowerCase().includes(lowerQ)) ||
        (item.service && item.service.toLowerCase().includes(lowerQ))
      );
    }

    setFilteredHistory(temp);
  };

  const handleDownloadExcel = () => {
    const csvRows = [];
    const headers = ["Date", "Time", "Data Card No", "Operator", "Amount", "Status", "Reference ID"];
    csvRows.push(headers.join(","));

    filteredHistory.forEach(h => {
      const date = new Date(h.created_at).toLocaleDateString();
      const time = new Date(h.created_at).toLocaleTimeString();
      const row = [
        date,
        time,
        h.account_number || h.mobile,
        h.operator,
        h.amount,
        h.status,
        h.reference_id
      ];
      csvRows.push(row.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DataCard_Recharge_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleFetchDetails = async () => {
    if (!cardNumber || !operator) {
      alert("Please enter card number and select operator");
      return;
    }
    setFetching(true);
    setDetails(null);

    try {
      const res = await api.post("/datacard/fetch-details", {
        operator: operatorId, // Send Code
        cardNumber: cardNumber
      });

      if (res.data.success) {
        setDetails(res.data.data);
        setAmount(res.data.data.billAmount || "");
      } else {
        alert(res.data.message || "Details not found");
      }
    } catch (error) {
      console.error("Fetch DataCard details error:", error);
      alert(error.response?.data?.message || "Error fetching details");
    } finally {
      setFetching(false);
    }
  };


  /* 🔹 PROCEED */
  const handleProceed = () => {
    if (!cardNumber) {
      alert("Please enter Data Card Number");
      return;
    }
    if (!operator) {
      alert("Please select Data Card Provider");
      return;
    }
    if (!amount || amount <= 0) {
      alert("Please enter valid amount");
      return;
    }

    setPaymentIntent({
      api: "/datacard/recharge",
      service: "DATACARD",
      account: cardNumber,
      operator: operatorId, // Send Code
      amount: Number(amount),
      onSuccess: () => {
        setCardNumber("");
        setOperator("");
        setOperatorId("");
        setAmount("");
        fetchHistory();
      }
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'SUCCESS': return { color: '#10b981', background: '#ecfdf5', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' };
      case 'FAILED': return { color: '#ef4444', background: '#fef2f2', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' };
      default: return { color: '#f59e0b', background: '#fffbeb', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' };
    }
  };

  return (
    <div className="dashboard-main">
      <div className="recharge-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '24px' }}>
        {/* LEFT PANEL */}
        <div className="left-panel" style={{ flex: '1 1 400px', minWidth: '300px' }}>
          <div className="card recharge-card" style={{ padding: '24px' }}>
            <div className="card-header" style={{ marginBottom: '24px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '10px' }}>
                  <FaWifi color="#0284c7" size={20} />
                </div>
                Data Card Recharge
              </h4>
            </div>

            {/* CARD NUMBER */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', display: 'block' }}>DATA CARD NUMBER</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  className="line-input"
                  placeholder="Ex: 9876543210"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{ fontSize: '18px', letterSpacing: '1px', flex: 1 }}
                />
                <button
                  onClick={handleFetchDetails}
                  disabled={fetching || !cardNumber || !operator}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: '#0284c7', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', opacity: (fetching || !cardNumber || !operator) ? 0.6 : 1 }}
                >
                  {fetching ? "..." : "Fetch"}
                </button>
              </div>
            </div>

            {/* OPERATOR SELECTION */}
            <div className="form-group" style={{ marginBottom: '24px', position: 'relative' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', display: 'block' }}>OPERATOR</label>
              <div
                onClick={() => setShowOpSelect(!showOpSelect)}
                style={{
                  padding: '12px 0',
                  borderBottom: '2px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ color: operator ? '#0f172a' : '#94a3b8', fontSize: '16px', fontWeight: operator ? '600' : '400' }}>
                  {operator || "Select Operator"}
                </span>
                <FaChevronDown color="#64748b" size={12} />
              </div>

              {showOpSelect && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  zIndex: 20,
                  marginTop: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Operator Search */}
                  <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ position: 'relative' }}>
                      <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={12} />
                      <input
                        type="text"
                        placeholder="Search operator..."
                        value={opSearchTerm}
                        onChange={e => setOpSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {loadingOps && operatorList.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading...</div>
                    ) : (
                      operatorList
                        .filter(op => {
                          const opName = op.biller_name || op.operator_name || op.text || op.name || "";
                          return opName.toLowerCase().includes(opSearchTerm.toLowerCase());
                        })
                        .map(op => {
                          const opName = op.biller_name || op.operator_name || op.text || op.name;
                          const opId = op.id || op.operator_code;
                          return (
                            <div
                              key={opId}
                              onClick={() => {
                                setOperator(opName);
                                setOperatorId(opId);
                                setShowOpSelect(false);
                                setOpSearchTerm("");
                              }}
                              style={{
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f8fafc',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                              <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: '#0284c7',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}>
                                {(opName?.[0] || 'D').toUpperCase()}
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{opName}</span>
                            </div>
                          );
                        })
                    )}
                    {!loadingOps && operatorList.length > 0 &&
                      operatorList.filter(op => (op.biller_name || op.operator_name || op.text || op.name || "").toLowerCase().includes(opSearchTerm.toLowerCase())).length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No operators found</div>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* AMOUNt */}
            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', display: 'block' }}>AMOUNT (₹)</label>
              <input
                type="number"
                className="line-input"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ fontSize: '24px', fontWeight: '700' }}
              />
            </div>

            <button
              className="btn primary"
              onClick={handleProceed}
              disabled={!details}
              style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700', background: '#0f172a', opacity: !details ? 0.5 : 1 }}
            >
              {Number(details?.billAmount) > 0 ? "Recharge Now →" : "Recharge Now →"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL – PLANS & CUSTOMER DETAILS */}
        <div className="right-panel" style={{ flex: '1 1 300px' }}>
          <div className="card browse-plans" style={{ height: 'calc(100vh - 120px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Customer Information</h4>
                {operator && <span style={{ fontSize: '10px', color: '#64748b', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{operator}</span>}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>


              <>
                {!details && (
                  <div style={{
                    textAlign: 'center',
                    color: '#94a3b8',
                    marginTop: '100px'
                  }}>
                    <FaSearch size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p>Enter Data Card Number and click "Fetch" to view details.</p>
                  </div>
                )}

                {details && (
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                  }}>
                    {/* Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      padding: '20px',
                      color: '#fff'
                    }}>
                      <div style={{ fontSize: '10px', opacity: 0.9, marginBottom: '4px', textTransform: 'uppercase' }}>Data Card Number</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '1px' }}>{cardNumber}</div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '20px' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>Customer Name</div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{details.customerName || "N/A"}</div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>Operator</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{operator}</div>
                      </div>

                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'
                      }}>
                        <div>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>Amount Due / Balance</div>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: Number(details.billAmount) > 0 ? '#0ea5e9' : '#10b981' }}>
                            {Number(details.billAmount) > 0 ? `₹${details.billAmount}` : "No Dues"}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>Validity</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>{details.expiryDate || "N/A"}</div>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'
                      }}>
                        <div>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>Bill Date</div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{details.billDate || "N/A"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>State</div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{details.state || "N/A"}</div>
                        </div>
                      </div>

                      <div style={{
                        background: '#f8fafc', borderRadius: '8px', padding: '12px',
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'
                      }}>
                        <div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold' }}>PLAN TYPE</div>
                          <div style={{ fontSize: '12px', fontWeight: '600' }}>{details.planDetails || "Prepaid"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold' }}>STATUS</div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: details.accountStatus === 'Active' ? '#10b981' : '#f59e0b' }}>{details.accountStatus || "Active"}</div>
                        </div>
                      </div>

                      {details.lastRechargeAmount && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}>LAST RECHARGE</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>₹{details.lastRechargeAmount}</span>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{details.lastRechargeDate || ""}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT TABLE SECTION */}
      <div style={{ marginTop: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaHistory color="#64748b" /> Data Card Recharge Report
            </h3>
            <button onClick={fetchHistory} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Refresh History</button>
          </div>

          {/* FILTERS */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <FaCalendarAlt color="#64748b" />
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '13px', color: '#334155', outline: 'none' }}
              />
              <span style={{ color: '#cbd5e1' }}>to</span>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '13px', color: '#334155', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', flex: 1, minWidth: '200px' }}>
              <FaSearch color="#64748b" />
              <input
                type="text"
                placeholder="Search Number, Operator or Ref ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '13px', color: '#334155', outline: 'none', width: '100%' }}
              />
            </div>

            <button
              onClick={handleDownloadExcel}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.target.style.background = '#059669'}
              onMouseLeave={(e) => e.target.style.background = '#10b981'}
            >
              <FaFileExcel /> Download Excel
            </button>
          </div>

        </div>

        <div className="report-table" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DATE & TIME</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>SERVICE</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DATA CARD NO.</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>OPERATOR</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>AMOUNT</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>STATUS</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>REFERENCE ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No records found</td>
                </tr>
              ) : (
                filteredHistory.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td data-label="DATE & TIME" style={{ padding: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{new Date(h.created_at).toLocaleDateString()}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(h.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td data-label="SERVICE" style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#0ea5e9' }}>{h.service}</td>
                    <td data-label="DATA CARD NO." style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: '#334155' }}>{h.mobile || h.account_number}</td>
                    <td data-label="OPERATOR" style={{ padding: '16px', fontSize: '13px', color: '#444' }}>{h.operator}</td>
                    <td data-label="AMOUNT" style={{ padding: '16px', fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>₹{h.amount}</td>
                    <td data-label="STATUS" style={{ padding: '16px' }}>
                      <span style={getStatusStyle(h.status)}>{h.status}</span>
                    </td>
                    <td data-label="REFERENCE ID" style={{ padding: '16px', fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{h.reference_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}