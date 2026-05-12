import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "../../assets/styles/Dashboard.css";
import "../../assets/styles/ResponsiveTable.css";
import {
    FaUserShield,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaTimes,
    FaUsers,
    FaCheckCircle,
    FaTimesCircle,
    FaKey
} from "react-icons/fa";

export default function UserRoles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleMenus, setRoleMenus] = useState([]);

    const [form, setForm] = useState({
        role_name: "",
        role_code: "",
        description: "",
        commission_multiplier: 1.0,
        can_add_users: false,
        can_manage_commissions: false,
        can_view_reports: true,
        can_manage_services: false,
        max_transaction_limit: "",
        daily_transaction_limit: "",
        is_active: true
    });

    useEffect(() => {
        fetchRoles();
        fetchStats();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await api.get("/user-roles");
            if (res.data.success) {
                setRoles(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching roles:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get("/user-roles/stats");
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...form,
                max_transaction_limit: form.max_transaction_limit === "" ? null : parseFloat(form.max_transaction_limit),
                daily_transaction_limit: form.daily_transaction_limit === "" ? null : parseFloat(form.daily_transaction_limit)
            };

            if (editMode) {
                const res = await api.put(`/user-roles/${selectedRole.id}`, submitData);
                if (res.data.success) {
                    alert("Role updated successfully!");
                }
            } else {
                const res = await api.post("/user-roles", submitData);
                if (res.data.success) {
                    alert("Role created successfully!");
                }
            }
            setShowModal(false);
            resetForm();
            fetchRoles();
            fetchStats();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this role?")) return;

        try {
            const res = await api.delete(`/user-roles/${id}`);
            if (res.data.success) {
                alert("Role deleted successfully!");
                fetchRoles();
                fetchStats();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete role");
        }
    };

    const openEditModal = (role) => {
        setSelectedRole(role);
        setForm({
            role_name: role.role_name,
            role_code: role.role_code,
            description: role.description || "",
            commission_multiplier: role.commission_multiplier,
            can_add_users: role.can_add_users === 1,
            can_manage_commissions: role.can_manage_commissions === 1,
            can_view_reports: role.can_view_reports === 1,
            can_manage_services: role.can_manage_services === 1,
            max_transaction_limit: role.max_transaction_limit || "",
            daily_transaction_limit: role.daily_transaction_limit || "",
            is_active: role.is_active === 1
        });
        setEditMode(true);
        setShowModal(true);
    };

    const openPermissionsModal = async (role) => {
        setSelectedRole(role);
        try {
            const res = await api.get(`/menu/role/${role.id}`);
            if (res.data.success) {
                setRoleMenus(res.data.data);
                setShowPermissionsModal(true);
            }
        } catch (err) {
            alert("Failed to load menu permissions");
        }
    };

    const resetForm = () => {
        setForm({
            role_name: "",
            role_code: "",
            description: "",
            commission_multiplier: 1.0,
            can_add_users: false,
            can_manage_commissions: false,
            can_view_reports: true,
            can_manage_services: false,
            max_transaction_limit: "",
            daily_transaction_limit: "",
            is_active: true
        });
        setEditMode(false);
        setSelectedRole(null);
    };

    const filteredRoles = roles.filter(role =>
        role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.role_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-main" style={{ padding: '24px' }}>
            {/* STATS CARDS */}
            {stats.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    {stats.slice(0, 4).map((stat, idx) => (
                        <div key={idx} className="card" style={{ padding: '20px', background: `linear-gradient(135deg, ${['#667eea', '#43e97b', '#f093fb', '#4facfe'][idx]} 0%, ${['#764ba2', '#38f9d7', '#f5576c', '#00f2fe'][idx]} 100%)`, color: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <FaUsers size={24} />
                                <div style={{ fontSize: '13px', opacity: 0.9 }}>{stat.role_name}</div>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: '800' }}>{stat.user_count}</div>
                            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>{stat.commission_multiplier}x commission</div>
                        </div>
                    ))}
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* HEADER */}
                <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaUserShield color="#3b82f6" /> User Roles Management
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Manage user roles and permissions</p>
                        </div>

                        <button
                            className="btn success"
                            onClick={() => { resetForm(); setShowModal(true); }}
                            style={{ background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                        >
                            <FaPlus /> Add Role
                        </button>
                    </div>

                    {/* SEARCH */}
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ position: 'relative', maxWidth: '400px' }}>
                            <FaSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} size={14} />
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '10px 12px 10px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-wrapper">
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                            Loading roles...
                        </div>
                    ) : filteredRoles.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                            <FaUserShield size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                            <p>No roles found</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>ROLE</th>
                                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>COMMISSION</th>
                                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>PERMISSIONS</th>
                                    <th style={{ padding: '16px 12px', textAlign: 'left', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>LIMITS</th>
                                    <th style={{ padding: '16px 12px', textAlign: 'center', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>STATUS</th>
                                    <th style={{ padding: '16px 12px', textAlign: 'center', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRoles.map((role) => (
                                    <tr key={role.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover-row">
                                        <td data-label="ROLE" style={{ padding: '16px 12px' }}>
                                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{role.role_name}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{role.role_code}</div>
                                            {role.description && (
                                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{role.description}</div>
                                            )}
                                        </td>
                                        <td data-label="COMMISSION" style={{ padding: '16px 12px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                background: '#f0fdf4',
                                                color: '#166534',
                                                fontSize: '13px',
                                                fontWeight: '800'
                                            }}>
                                                {role.commission_multiplier}x
                                            </span>
                                        </td>
                                        <td data-label="PERMISSIONS" style={{ padding: '16px 12px' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {role.can_add_users === 1 && <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px' }}>Add Users</span>}
                                                {role.can_manage_commissions === 1 && <span style={{ fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px' }}>Commissions</span>}
                                                {role.can_manage_services === 1 && <span style={{ fontSize: '10px', background: '#f3e8ff', color: '#6b21a8', padding: '2px 6px', borderRadius: '4px' }}>Services</span>}
                                            </div>
                                        </td>
                                        <td data-label="LIMITS" style={{ padding: '16px 12px' }}>
                                            {role.max_transaction_limit ? (
                                                <div style={{ fontSize: '12px', color: '#475569' }}>
                                                    <div>Max: ₹{role.max_transaction_limit.toLocaleString()}</div>
                                                    {role.daily_transaction_limit && <div style={{ color: '#94a3b8' }}>Daily: ₹{role.daily_transaction_limit.toLocaleString()}</div>}
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Unlimited</span>
                                            )}
                                        </td>
                                        <td data-label="STATUS" style={{ padding: '16px 12px', textAlign: 'center' }}>
                                            {role.is_active ? (
                                                <FaCheckCircle size={20} color="#10b981" />
                                            ) : (
                                                <FaTimesCircle size={20} color="#ef4444" />
                                            )}
                                        </td>
                                        <td data-label="ACTIONS" style={{ padding: '16px 12px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => openPermissionsModal(role)}
                                                    style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <FaKey /> Menu
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(role)}
                                                    style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(role.id)}
                                                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ADD/EDIT MODAL */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0 }}>{editMode ? 'Edit Role' : 'Add Role'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Role Name *</label>
                                    <input
                                        type="text"
                                        value={form.role_name}
                                        onChange={(e) => setForm({ ...form, role_name: e.target.value })}
                                        required
                                        className="line-input"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Role Code *</label>
                                    <input
                                        type="text"
                                        value={form.role_code}
                                        onChange={(e) => setForm({ ...form, role_code: e.target.value.toUpperCase() })}
                                        required
                                        disabled={editMode}
                                        className="line-input"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows="2"
                                    className="line-input"
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Commission Multiplier *</label>
                                <input
                                    type="number"
                                    value={form.commission_multiplier}
                                    onChange={(e) => setForm({ ...form, commission_multiplier: parseFloat(e.target.value) })}
                                    required
                                    min="0"
                                    step="0.1"
                                    className="line-input"
                                />
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>1.0 = base rate, 1.5 = 50% more</div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Max Transaction</label>
                                    <input
                                        type="number"
                                        value={form.max_transaction_limit}
                                        onChange={(e) => setForm({ ...form, max_transaction_limit: e.target.value })}
                                        placeholder="Unlimited"
                                        className="line-input"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Daily Limit</label>
                                    <input
                                        type="number"
                                        value={form.daily_transaction_limit}
                                        onChange={(e) => setForm({ ...form, daily_transaction_limit: e.target.value })}
                                        placeholder="Unlimited"
                                        className="line-input"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '12px', display: 'block' }}>Permissions</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.can_add_users}
                                            onChange={(e) => setForm({ ...form, can_add_users: e.target.checked })}
                                        />
                                        <span style={{ fontSize: '13px', color: '#475569' }}>Can Add Users</span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.can_manage_commissions}
                                            onChange={(e) => setForm({ ...form, can_manage_commissions: e.target.checked })}
                                        />
                                        <span style={{ fontSize: '13px', color: '#475569' }}>Manage Commissions</span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.can_view_reports}
                                            onChange={(e) => setForm({ ...form, can_view_reports: e.target.checked })}
                                        />
                                        <span style={{ fontSize: '13px', color: '#475569' }}>View Reports</span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.can_manage_services}
                                            onChange={(e) => setForm({ ...form, can_manage_services: e.target.checked })}
                                        />
                                        <span style={{ fontSize: '13px', color: '#475569' }}>Manage Services</span>
                                    </label>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    />
                                    <span style={{ fontSize: '13px', color: '#475569' }}>Active</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ background: '#e5e7eb', color: '#374151' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn primary" style={{ background: '#10b981', color: '#fff' }}>
                                    {editMode ? 'Update' : 'Create'} Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MENU PERMISSIONS MODAL */}
            {showPermissionsModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0 }}>Menu Permissions - {selectedRole?.role_name}</h3>
                            <button onClick={() => setShowPermissionsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
                                <FaTimes />
                            </button>
                        </div>

                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                            Configure which menus this role can access
                        </div>

                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {roleMenus.filter(m => !m.parent_id).map(menu => (
                                <div key={menu.id} style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {menu.can_view ? <FaCheckCircle color="#10b981" /> : <FaTimesCircle color="#ef4444" />}
                                        {menu.menu_name}
                                    </div>
                                    {roleMenus.filter(sub => sub.parent_id === menu.id).map(submenu => (
                                        <div key={submenu.id} style={{ marginLeft: '24px', padding: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {submenu.can_view ? <FaCheckCircle color="#10b981" size={12} /> : <FaTimesCircle color="#ef4444" size={12} />}
                                            {submenu.menu_name}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '24px', textAlign: 'right' }}>
                            <button onClick={() => setShowPermissionsModal(false)} className="btn primary" style={{ background: '#3b82f6', color: '#fff' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
