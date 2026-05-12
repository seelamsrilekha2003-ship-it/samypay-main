import React, { useState, useEffect } from "react";
import "../../assets/styles/profile.css";
import { FaUser, FaBuilding, FaLock, FaCheckCircle, FaEnvelope, FaBell, FaCog, FaGlobe } from "react-icons/fa";
import api from "../../api";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({});

  // Password Form State
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  // Messages
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      if (res.data.success) {
        const userData = res.data.data;
        setUser(userData);
        setFormData({
          ...userData,
          preferences: userData.preferences || {
            emailAlerts: true,
            smsAlerts: false,
            twoFactor: false,
            language: 'English'
          }
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/profile", formData);
      if (res.data.success) {
        showMessage("success", "Profile Updated Successfully ✅");
        setUser(formData);
        setIsEditing(false);
      }
    } catch (err) {
      showMessage("error", "Update Failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handlePassChange = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const res = await api.put("/users/change-password", {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      if (res.data.success) {
        showMessage("success", "Password Changed Successfully ✅");
        setIsChangingPass(false);
        setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      showMessage("error", "Password Change Failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return (
    <div className="profile-page">
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #0b58d6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
        Loading Profile...
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* HEADER */}
        <div className="profile-header">
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <h2>{user?.name}</h2>
          <p>{user?.role_name} Account</p>
        </div>

        {/* FEEDBACK MESSAGE */}
        {message.text && (
          <div style={{
            margin: '20px 30px 0',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#86efac' : '#fecaca'}`
          }}>
            {message.text}
          </div>
        )}

        {/* BODY - VIEW MODE */}
        {!isEditing && !isChangingPass && (
          <>
            <div className="profile-body">
              <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Member ID</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e3a8a' }}>#{user?.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Wallet Balance</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#059669' }}>₹{Number(user?.wallet_balance || 0).toFixed(2)}</div>
                </div>
              </div>

              <ProfileRow label="Member ID" value={`#${user?.id}`} />
              <ProfileRow label="Joined Date" value={new Date(user?.created_at?.replace(' ', 'T')).toLocaleDateString()} />
              <ProfileRow label="Role" value={user?.role_name} />
              <ProfileRow label="Full Name" value={user?.name} />
              <ProfileRow label="Email" value={user?.email} />
              <ProfileRow label="Mobile" value={user?.mobile} />
              <ProfileRow label="Company" value={user?.company_name || "-"} />
              <ProfileRow label="Address" value={user?.address || "-"} />
              <ProfileRow label="City / State" value={user?.city || user?.state ? `${user?.city || ""} ${user?.state || ""}` : "-"} />
              <ProfileRow label="Pincode" value={user?.pincode || "-"} />
              <ProfileRow label="GST No" value={user?.gst_no || "-"} />
              <ProfileRow label="Status" value="Active" active />

              <div className="preference-section">
                <h5 className="preference-title">Site Preferences</h5>
                <div className="preference-grid">
                  <PreferenceBadge icon={<FaEnvelope />} label="Email" active={user?.preferences?.emailAlerts} />
                  <PreferenceBadge icon={<FaBell />} label="SMS" active={user?.preferences?.smsAlerts} />
                  <PreferenceBadge icon={<FaLock />} label="2FA" active={user?.preferences?.twoFactor} />
                  <PreferenceBadge icon={<FaGlobe />} label={user?.preferences?.language || 'English'} active={true} />
                </div>
              </div>
            </div>
            <div className="profile-footer">
              <button className="btn edit" onClick={() => setIsEditing(true)}>
                <FaCog /> Edit Profile
              </button>
              <button className="btn password" onClick={() => setIsChangingPass(true)}>
                <FaLock /> Security
              </button>
            </div>
          </>
        )}

        {/* BODY - EDIT MODE */}
        {isEditing && (
          <form onSubmit={handleUpdate} className="profile-body">
            <Input label="Full Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} disabled={true} />
            <Input label="Mobile Number" value={formData.mobile} onChange={v => setFormData({ ...formData, mobile: v })} disabled={true} />
            <Input label="Email Address" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} disabled={true} />
            <Input label="Company Name" value={formData.company_name} onChange={v => setFormData({ ...formData, company_name: v })} />
            <Input label="Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <Input label="City" value={formData.city} onChange={v => setFormData({ ...formData, city: v })} />
              <Input label="State" value={formData.state} onChange={v => setFormData({ ...formData, state: v })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <Input label="Pincode" value={formData.pincode} onChange={v => setFormData({ ...formData, pincode: v })} />
              <Input label="GST No" value={formData.gst_no} onChange={v => setFormData({ ...formData, gst_no: v })} />
            </div>

            <div style={{ marginTop: '10px', padding: '20px', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '11px', color: '#64748b', marginBottom: '15px', textTransform: 'uppercase', fontWeight: '700' }}>Update Preferences</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <PreferenceToggle
                  label="Email Alerts"
                  active={formData.preferences?.emailAlerts}
                  onToggle={() => setFormData({ ...formData, preferences: { ...formData.preferences, emailAlerts: !formData.preferences?.emailAlerts } })}
                />
                <PreferenceToggle
                  label="SMS Alerts"
                  active={formData.preferences?.smsAlerts}
                  onToggle={() => setFormData({ ...formData, preferences: { ...formData.preferences, smsAlerts: !formData.preferences?.smsAlerts } })}
                />
                <PreferenceToggle
                  label="2FA Auth"
                  active={formData.preferences?.twoFactor}
                  onToggle={() => setFormData({ ...formData, preferences: { ...formData.preferences, twoFactor: !formData.preferences?.twoFactor } })}
                />
                <select
                  className="form-control"
                  value={formData.preferences?.language || 'English'}
                  onChange={e => setFormData({ ...formData, preferences: { ...formData.preferences, language: e.target.value } })}
                  style={{ height: '40px', padding: '0 12px', fontSize: '13px' }}
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>

            <div className="profile-footer" style={{ padding: '25px 0 0', marginTop: '10px' }}>
              <button type="submit" className="btn edit">Save Changes</button>
              <button type="button" className="btn password" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* BODY - PASSWORD MODE */}
        {isChangingPass && (
          <form onSubmit={handlePassChange} className="profile-body">
            <h4 style={{ margin: '0 0 25px', textAlign: 'center', color: '#1e3a8a', fontWeight: '700' }}>Security Settings</h4>

            <Input type="password" label="Current Password" value={passData.currentPassword} onChange={v => setPassData({ ...passData, currentPassword: v })} />
            <Input type="password" label="New Password" value={passData.newPassword} onChange={v => setPassData({ ...passData, newPassword: v })} />
            <Input type="password" label="Confirm Password" value={passData.confirmPassword} onChange={v => setPassData({ ...passData, confirmPassword: v })} />

            <div className="profile-footer" style={{ padding: '25px 0 0' }}>
              <button type="submit" className="btn edit">Update Password</button>
              <button type="button" className="btn password" onClick={() => setIsChangingPass(false)}>Cancel</button>
            </div>
          </form>
        )}

      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const PreferenceBadge = ({ icon, label, active }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: active ? '#10b981' : '#94a3b8',
    padding: '8px 12px',
    background: active ? '#f0fdf4' : '#f8fafc',
    borderRadius: '10px',
    border: active ? '1px solid #10b981' : '1px solid #e2e8f0'
  }}>
    {icon} <span>{label}</span>
  </div>
);

const PreferenceToggle = ({ label, active, onToggle }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px'
  }}>
    <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>{label}</span>
    <div
      onClick={onToggle}
      style={{
        width: '32px',
        height: '18px',
        borderRadius: '9px',
        background: active ? '#10b981' : '#cbd5e1',
        position: 'relative',
        cursor: 'pointer',
        transition: '0.3s'
      }}
    >
      <div style={{
        width: '14px',
        height: '14px',
        background: '#fff',
        borderRadius: '50%',
        position: 'absolute',
        top: '2px',
        left: active ? '16px' : '2px',
        transition: '0.3s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
      }} />
    </div>
  </div>
);

const ProfileRow = ({ label, value, active }) => (
  <div className="profile-row">
    <span>{label}</span>
    <strong className={active ? "active" : ""}>{value}</strong>
  </div>
);

const Input = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      className="form-control"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={`Enter ${label}`}
      disabled={disabled}
      style={disabled ? { background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' } : {}}
    />
  </div>
);
