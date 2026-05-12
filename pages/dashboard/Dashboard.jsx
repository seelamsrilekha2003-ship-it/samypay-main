import React, { useEffect, useState } from "react";
import "../../assets/styles/Dashboard.css";
import api from "../../api";
import { FaWallet, FaCheckCircle, FaHourglassHalf, FaHistory } from "react-icons/fa";

import banner1 from "../../assets/images/dashboard1.jpg";
import banner2 from "../../assets/images/dashboard2.jpg";
import banner3 from "../../assets/images/dashboard3.jpg";

const staticBanners = [
  {
    image_url: banner1,
    title: "Fastest Recharge Experience Ever",
    description: "Manage your recharges and bill payments with SamyPay's advanced automation tools.",
    link_url: "/recharge"
  },
  {
    image_url: banner2,
    title: "Secure Payments & Instant Settlements",
    description: "Manage your recharges and bill payments with SamyPay's advanced automation tools.",
    link_url: "/recharge"
  },
  {
    image_url: banner3,
    title: "24/7 Support for Your Business",
    description: "Manage your recharges and bill payments with SamyPay's advanced automation tools.",
    link_url: "/recharge"
  }
];

export default function Dashboard() {
  const [index, setIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [stats, setStats] = useState({
    walletBalance: 0,
    totalSuccess: 0,
    pendingCount: 0,
    recentTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  const displayBanners = banners.length > 0 ? banners : staticBanners;

  useEffect(() => {
    fetchStats();
    fetchBanners();
  }, []);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(bannerInterval);
  }, [displayBanners.length]);

  const fetchBanners = async () => {
    try {
      const res = await api.get("/banners?is_active=1");
      if (res.data.success) {
        const activeBanners = res.data.data.filter(b =>
          b.position === 'DASHBOARD' || b.position === 'HOME'
        );
        if (activeBanners.length > 0) {
          setBanners(activeBanners);
          setIndex(0);
        }
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  };

  const getImageSrc = (url) => {
    if (!url) return banner1;
    // If it's already a full URL (http/https), use as-is
    if (url.startsWith('http')) return url;
    // Relative paths are served from the frontend public folder
    return url;
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/reports/stats");
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="dashboard-title" style={{ margin: 0, color: '#1e293b' }}>Dashboard Overview</h2>
        <span style={{ fontSize: '14px', color: '#64748b' }}>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* STATS CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500', marginBottom: '8px' }}>Wallet Balance</div>
              <div style={{ fontSize: '28px', fontWeight: '800' }}>₹{stats.walletBalance.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
              <FaWallet size={24} color="#38bdf8" />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#4ade80', fontWeight: 'bold' }}>Live Balance</div>
        </div>

        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>Total Success</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>₹{stats.totalSuccess.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px' }}>
              <FaCheckCircle size={24} color="#22c55e" />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b' }}>Total successful recharges</div>
        </div>

        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>Pending Recharges</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{stats.pendingCount}</div>
            </div>
            <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '12px' }}>
              <FaHourglassHalf size={24} color="#f97316" />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b' }}>Needs attention</div>
        </div>

        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>Today's Txns</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{stats.recentTransactions || 0}</div>
            </div>
            <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '12px' }}>
              <FaHistory size={24} color="#8b5cf6" />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b' }}>Transactions processed today</div>
        </div>
      </div>

      {/* BANNER SLIDER */}
      <div
        className="banner-wrapper"
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div
          className="banner-slider"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {displayBanners.map((banner, i) => (
            <div className="banner-slide" key={banner.id || i}>
              <div className="banner-content">
                <h1 style={{ fontSize: '24px', fontWeight: '800', maxWidth: '500px', lineHeight: '1.2', marginBottom: '12px' }}>
                  {banner.title}
                </h1>
                <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '400px', marginBottom: '20px' }}>
                  {banner.description}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn primary"
                    onClick={() => banner.link_url && (window.location.href = banner.link_url)}
                  >
                    Get Started
                  </button>
                  <button className="btn outline">Learn More</button>
                </div>
              </div>

              <div className="banner-image-container">
                <img
                  src={getImageSrc(banner.image_url)}
                  alt={banner.title}
                  onError={(e) => { e.target.src = banner1; }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="banner-dots" style={{ marginTop: '20px' }}>
        {displayBanners.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
            style={{ width: i === index ? '24px' : '8px', transition: 'width 0.3s' }}
          />
        ))}
      </div>
    </div>
  );
}