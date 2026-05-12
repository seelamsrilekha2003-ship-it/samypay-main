import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../assets/styles/Dashboard.css";
import "../../assets/styles/ResponsiveTable.css";
import {
  FaUserSecret,
  FaCalendarAlt,
  FaTrophy,
  FaChartPie,
  FaUsers
} from "react-icons/fa";

export default function DistributorSalesReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReport();
  }, [date]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/daily-reports/distributor-sales?date=${date}`);
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
              <FaUserSecret color="#7c3aed" /> Distributor Daily Sales
            </h2>
            <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Performance summary of all distributors</p>
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
              <div style={{ background: '#f5f3ff', padding: '20px', borderRadius: '16px', border: '1px solid #ddd6fe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <FaChartPie color="#7c3aed" />
                  <div style={{ color: '#7c3aed', fontSize: '14px', fontWeight: '600' }}>Total Sales Volume</div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#4c1d95' }}>₹{(data.summary.total_amount || 0).toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: '#8b5cf6' }}>{data.summary.total_count} transactions</div>
              </div>

              <div style={{ background: '#ecfdf5', padding: '20px', borderRadius: '16px', border: '1px solid #6ee7b7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <FaUsers color="#059669" />
                  <div style={{ color: '#059669', fontSize: '14px', fontWeight: '600' }}>Active Distributors</div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#064e3b' }}>{data.summary.active_users || 0}</div>
                <div style={{ fontSize: '13px', color: '#10b981' }}>Participated today</div>
              </div>
            </div>

            {/* TOP PERFORMERS TABLE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <FaTrophy color="#f59e0b" />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', margin: 0 }}>Top Performing Distributors</h3>
            </div>

            <div className="table-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b', width: '60px' }}>RANK</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>DISTRIBUTOR NAME</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: '#64748b' }}>MOBILE</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#64748b' }}>TXN COUNT</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#64748b' }}>TOTAL VOLUME</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_performers.map((user, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{
                          width: '28px', height: '28px',
                          borderRadius: '50%',
                          background: idx < 3 ? '#ddd6fe' : '#f1f5f9',
                          color: idx < 3 ? '#5b21b6' : '#64748b',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', fontSize: '13px'
                        }}>
                          {idx + 1}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#334155' }}>{user.name}</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>{user.mobile}</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#475569' }}>{user.txn_count}</td>
                      <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#7c3aed' }}>₹{user.total_volume.toLocaleString()}</td>
                    </tr>
                  ))}
                  {data.top_performers.length === 0 && (
                    <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No sales recorded for distributors today</td></tr>
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
