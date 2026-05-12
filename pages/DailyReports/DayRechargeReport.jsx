import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../assets/styles/Dashboard.css";
import "../../assets/styles/ResponsiveTable.css";
import {
  FaMobileAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaRupeeSign,
  FaChartBar,
  FaSearch
} from "react-icons/fa";

export default function DayRechargeReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReport();
  }, [date]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/daily-reports/recharge?date=${date}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-main" style={{ padding: '24px' }}>
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
              <FaChartBar color="#3b82f6" /> Day Recharge Report
            </h2>
            <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Daily summary of all recharge activities</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <FaCalendarAlt color="#64748b" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', color: '#1e293b', fontWeight: '600', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading report...</div>
        ) : data ? (
          <>
            {/* SUMMARY CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                <div style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Total Volume</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a' }}>₹{(data.summary.total_amount || 0).toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: '#60a5fa' }}>{data.summary.total_count} Transactions</div>
              </div>

              <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '16px', border: '1px solid #dcfce7' }}>
                <div style={{ color: '#16a34a', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Success Volume</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#14532d' }}>₹{(data.summary.success_amount || 0).toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: '#4ade80' }}>{data.summary.success_count} Successful</div>
              </div>

              <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                <div style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Failed</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#7f1d1d' }}>{data.summary.failed_count}</div>
                <div style={{ fontSize: '13px', color: '#f87171' }}>Transactions</div>
              </div>

              <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '16px', border: '1px solid #ffedd5' }}>
                <div style={{ color: '#ea580c', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Pending</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#7c2d12' }}>{data.summary.pending_count}</div>
                <div style={{ fontSize: '13px', color: '#fb923c' }}>Processing</div>
              </div>
            </div>

            {/* SERVICE BREAKDOWN */}
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>Service Breakdown</h3>
            <div className="table-wrapper" style={{ marginBottom: '32px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>SERVICE</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#64748b' }}>COUNT</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#64748b' }}>TOTAL AMOUNT</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#64748b' }}>SUCCESS AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {data.breakdown.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#334155' }}>{item.service_type.replace(/_/g, ' ')}</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#64748b' }}>{item.count}</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700' }}>₹{item.amount.toLocaleString()}</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#16a34a' }}>₹{item.success_amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {data.breakdown.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* RECENT TRANSACTIONS */}
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>Transaction Log ({date})</h3>
            <div className="table-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>TIME</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>USER</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>SERVICE</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>DETAILS</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#64748b' }}>AMOUNT</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', color: '#64748b' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((txn, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>{new Date(txn.created_at).toLocaleTimeString()}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#334155', fontSize: '13px' }}>{txn.user_name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{txn.user_mobile}</div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', fontWeight: '500' }}>{txn.service_type}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '13px' }}>{txn.operator_name}</div>
                        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>{txn.account_number}</div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700' }}>₹{txn.amount}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background: txn.status === 'SUCCESS' ? '#f0fdf4' : txn.status === 'FAILED' ? '#fef2f2' : '#fff7ed',
                          color: txn.status === 'SUCCESS' ? '#166534' : txn.status === 'FAILED' ? '#991b1b' : '#9a3412'
                        }}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
