import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import "../../assets/styles/commission.css";
import "../../assets/styles/Dashboard.css";

export default function PlanRules() {
    const { planId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const planName = location.state?.planName || "Commission Plan";

    const [rules, setRules] = useState([
        {
            id: 1,
            service: "Mobile Recharge",
            minAmount: 0,
            maxAmount: 1000,
            commissionType: "Percentage",
            commissionValue: 2.5
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [formData, setFormData] = useState({
        service: "",
        minAmount: "",
        maxAmount: "",
        commissionType: "Percentage",
        commissionValue: ""
    });

    const services = [
        "Mobile Recharge",
        "DTH Recharge",
        "Electricity Bill",
        "Gas Bill",
        "Water Bill",
        "FASTag",
        "Landline",
        "Datacard"
    ];

    const handleAddRule = () => {
        if (!formData.service || !formData.minAmount || !formData.maxAmount || !formData.commissionValue) {
            alert("Please fill all fields");
            return;
        }

        const newRule = {
            id: rules.length + 1,
            service: formData.service,
            minAmount: parseFloat(formData.minAmount),
            maxAmount: parseFloat(formData.maxAmount),
            commissionType: formData.commissionType,
            commissionValue: parseFloat(formData.commissionValue)
        };

        setRules([...rules, newRule]);
        setFormData({ service: "", minAmount: "", maxAmount: "", commissionType: "Percentage", commissionValue: "" });
        setShowAddModal(false);
        alert("Rule added successfully!");
    };

    const handleEditRule = () => {
        if (!formData.service || !formData.minAmount || !formData.maxAmount || !formData.commissionValue) {
            alert("Please fill all fields");
            return;
        }

        setRules(rules.map(rule =>
            rule.id === selectedRule.id
                ? {
                    ...rule,
                    service: formData.service,
                    minAmount: parseFloat(formData.minAmount),
                    maxAmount: parseFloat(formData.maxAmount),
                    commissionType: formData.commissionType,
                    commissionValue: parseFloat(formData.commissionValue)
                }
                : rule
        ));

        setFormData({ service: "", minAmount: "", maxAmount: "", commissionType: "Percentage", commissionValue: "" });
        setSelectedRule(null);
        setShowEditModal(false);
        alert("Rule updated successfully!");
    };

    const handleDeleteRule = (ruleId) => {
        if (window.confirm("Are you sure you want to delete this rule?")) {
            setRules(rules.filter(rule => rule.id !== ruleId));
            alert("Rule deleted successfully!");
        }
    };

    return (
        <div className="dashboard-main" style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/commission/plans')}
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#334155' }}
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Commission Rules</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>{planName}</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{ marginLeft: 'auto', background: '#0b58d6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                >
                    <FaPlus /> Add Rule
                </button>
            </div>

            {/* Rules Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-wrapper">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>SERVICE</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>MIN AMOUNT</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>MAX AMOUNT</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>COMMISSION</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                        No rules added yet. Click "Add Rule" to create one.
                                    </td>
                                </tr>
                            ) : (
                                rules.map(rule => (
                                    <tr key={rule.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td data-label="SERVICE" style={{ padding: '16px', fontWeight: '600', color: '#1e293b' }}>
                                            {rule.service}
                                        </td>
                                        <td data-label="MIN AMOUNT" style={{ padding: '16px', color: '#64748b' }}>
                                            ₹{rule.minAmount}
                                        </td>
                                        <td data-label="MAX AMOUNT" style={{ padding: '16px', color: '#64748b' }}>
                                            ₹{rule.maxAmount}
                                        </td>
                                        <td data-label="COMMISSION" style={{ padding: '16px' }}>
                                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                                {rule.commissionValue}{rule.commissionType === "Percentage" ? "%" : " ₹"}
                                            </span>
                                        </td>
                                        <td data-label="ACTIONS" style={{ padding: '16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedRule(rule);
                                                        setFormData({
                                                            service: rule.service,
                                                            minAmount: rule.minAmount,
                                                            maxAmount: rule.maxAmount,
                                                            commissionType: rule.commissionType,
                                                            commissionValue: rule.commissionValue
                                                        });
                                                        setShowEditModal(true);
                                                    }}
                                                    className="btn edit"
                                                    style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRule(rule.id)}
                                                    className="btn delete"
                                                    style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Rule Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '24px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Add Commission Rule</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
                                <FaTimes />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Service *</label>
                                <select
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                >
                                    <option value="">Select Service</option>
                                    {services.map(service => (
                                        <option key={service} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Min Amount *</label>
                                    <input
                                        type="number"
                                        value={formData.minAmount}
                                        onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                                        placeholder="0"
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Max Amount *</label>
                                    <input
                                        type="number"
                                        value={formData.maxAmount}
                                        onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                                        placeholder="10000"
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Commission Type *</label>
                                    <select
                                        value={formData.commissionType}
                                        onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                    >
                                        <option value="Percentage">Percentage (%)</option>
                                        <option value="Fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Commission Value *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.commissionValue}
                                        onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
                                        placeholder={formData.commissionType === "Percentage" ? "2.5" : "10"}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRule}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0b58d6', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FaSave /> Add Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Rule Modal */}
            {showEditModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '24px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Edit Commission Rule</h3>
                            <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
                                <FaTimes />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Service *</label>
                                <select
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                >
                                    <option value="">Select Service</option>
                                    {services.map(service => (
                                        <option key={service} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Min Amount *</label>
                                    <input
                                        type="number"
                                        value={formData.minAmount}
                                        onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Max Amount *</label>
                                    <input
                                        type="number"
                                        value={formData.maxAmount}
                                        onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Commission Type *</label>
                                    <select
                                        value={formData.commissionType}
                                        onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                    >
                                        <option value="Percentage">Percentage (%)</option>
                                        <option value="Fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Commission Value *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.commissionValue}
                                        onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditRule}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0b58d6', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FaSave /> Update Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
