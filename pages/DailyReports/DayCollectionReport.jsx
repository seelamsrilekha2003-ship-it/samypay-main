import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../assets/styles/Dashboard.css";
import "../../assets/styles/ResponsiveTable.css";
import {
  FaWallet,
  FaCalendarAlt,
  FaArrowCircleUp,
  FaCreditCard,
  FaMobileAlt
} from "react-icons/fa";

export default function DayCollectionReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReport();
  }, [date]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/daily-reports/collection?date=${date}`);
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
              <FaWallet color="#8b5cf6" /> Day Collection Report
            </h2>
            <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Daily summary of wallet loads and collections</p>
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
            {/* SUMMARY CARD (Single Large Card or Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '16px', border: '1px solid #dcfce7', gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#dcfce7', borderRadius: '50%', color: '#16a34a' }}>
                    <FaArrowCircleUp size={32} />
                  </div>
                  <div>
                    <div style={{ color: '#16a34a', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Total Collection</div>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#14532d' }}>₹{(data.summary.total_amount || 0).toLocaleString()}</div>
                    <div style={{ fontSize: '14px', color: '#15803d' }}>From {data.summary.total_count} transactions</div>
                  </div>
                </div>
              </div>

              {data.breakdown.map((item, idx) => (
                <div key={idx} style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                    via {item.payment_method}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#334155' }}>₹{item.amount.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.count} txns</div>
                </div>
              ))}
            </div>

            {/* COLLECTION LOG */}
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>Collection Log ({date})</h3>
            <div className="table-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>TIME</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>USER</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>METHOD</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>REFERENCE</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#64748b' }}>AMOUNT</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#64748b' }}>BALANCE</th>
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
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                          {txn.payment_method === 'UPI' ? <FaMobileAlt /> : <FaCreditCard />}
                          {txn.payment_method}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>{txn.payment_reference || '-'}</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800', color: '#16a34a' }}>+₹{txn.amount}</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#334155' }}>₹{txn.balance_after.toFixed(2)}</td>
                    </tr>
                  ))}
                  {data.transactions.length === 0 && (
                    <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No collections recorded for this day</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
