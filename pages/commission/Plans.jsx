import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/commission.css";
import "../../assets/styles/Sidebar.css";
import "../../assets/styles/ResponsiveTable.css";
import { FaPlus, FaTrash, FaEdit, FaRegCalendarAlt, FaSearch, FaTimes, FaSave } from "react-icons/fa";

export default function Plans() {
  const navigate = useNavigate();

  // State management
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Default Commission Plan",
      createdAt: "2025-10-10 05:51:56"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPlanName, setNewPlanName] = useState("");

  // Filter plans based on search
  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create new plan
  const handleCreatePlan = () => {
    if (!newPlanName.trim()) {
      alert("Please enter a plan name");
      return;
    }

    const newPlan = {
      id: plans.length + 1,
      name: newPlanName,
      createdAt: new Date().toLocaleString()
    };

    setPlans([...plans, newPlan]);
    setNewPlanName("");
    setShowCreateModal(false);
    alert("Plan created successfully!");
  };

  // Handle edit plan
  const handleEditPlan = () => {
    if (!newPlanName.trim()) {
      alert("Please enter a plan name");
      return;
    }

    setPlans(plans.map(plan =>
      plan.id === selectedPlan.id
        ? { ...plan, name: newPlanName }
        : plan
    ));

    setNewPlanName("");
    setSelectedPlan(null);
    setShowEditModal(false);
    alert("Plan updated successfully!");
  };

  // Handle delete plan
  const handleDeletePlan = () => {
    setPlans(plans.filter(plan => plan.id !== selectedPlan.id));
    setSelectedPlan(null);
    setShowDeleteModal(false);
    alert("Plan deleted successfully!");
  };

  // Navigate to plan rules page
  const handleAddRules = (plan) => {
    navigate(`/commission/plan-rules/${plan.id}`, {
      state: { planName: plan.name }
    });
  };

  return (
    <div className="dashboard-main" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Commission Plans</h2>
        <button
          className="btn primary"
          onClick={() => setShowCreateModal(true)}
          style={{ background: '#0b58d6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer' }}
        >
          <FaPlus /> Create New Plan
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} size={14} />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 12px 10px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px', outline: 'none' }}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>S.NO</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>PLAN NAME</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>CREATED DATE</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No plans found
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan, index) => (
                  <tr key={plan.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td data-label="S.NO" style={{ padding: '16px' }}>{index + 1}</td>
                    <td data-label="PLAN NAME" style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '700', color: '#1e293b' }}>{plan.name}</div>
                    </td>
                    <td data-label="CREATED DATE" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
                        <FaRegCalendarAlt size={12} /> {plan.createdAt}
                      </div>
                    </td>
                    <td data-label="ACTIONS" style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          className="btn add"
                          onClick={() => handleAddRules(plan)}
                          style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          Add Rules
                        </button>
                        <button
                          className="btn edit"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setNewPlanName(plan.name);
                            setShowEditModal(true);
                          }}
                          style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn delete"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowDeleteModal(true);
                          }}
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

        <div style={{ padding: '16px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', color: '#64748b', fontSize: '12px' }}>
          Showing {filteredPlans.length} of {plans.length} entries
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Create New Plan</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
                <FaTimes />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>
                Plan Name *
              </label>
              <input
                type="text"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="Enter plan name"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlan}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0b58d6', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FaSave /> Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Edit Plan</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
                <FaTimes />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>
                Plan Name *
              </label>
              <input
                type="text"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="Enter plan name"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditPlan}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0b58d6', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FaSave /> Update Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Delete Plan</h3>
            <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '14px' }}>
              Are you sure you want to delete "{selectedPlan?.name}"? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: '600' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
