import React, { useState, useEffect } from 'react';
import '../assets/styles/SlabModal.css';

export default function SlabModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        role_name: '',
        role_code: '',
        description: '',
        can_add_users: 0,
        // We'll keep is_active default to 1, but maybe not show it if not in design
        is_active: 1
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                role_name: initialData.name || '',
                role_code: initialData.role_code || '',
                description: initialData.details || '',
                can_add_users: initialData.isSignupB2B === "Yes" ? 1 : 0,
                is_active: initialData.isActive ? 1 : 0
            });
        } else {
            setFormData({
                role_name: '',
                role_code: '',
                description: '',
                can_add_users: 0,
                is_active: 1
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // If role_code is empty (e.g. creating new and field hidden), generate one
        const submissionData = { ...formData };
        if (!submissionData.role_code && submissionData.role_name) {
            submissionData.role_code = submissionData.role_name.toUpperCase().replace(/\s+/g, '_');
        }
        onSave(submissionData);
    };

    return (
        <div className="slab-modal-overlay">
            <div className="slab-modal-content">
                <div className="slab-modal-header">
                    <h3>Slab Master</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="slab-modal-form">

                    <div className="form-group-row">
                        <div className="form-group full-width">
                            <label>SlabName</label>
                            <div className="input-with-button">
                                <input
                                    type="text"
                                    name="role_name"
                                    value={formData.role_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>
                        </div>
                    </div>

                    {/* Hidden role_code for now to match design, or auto-generated */}
                    {/* <input type="hidden" name="role_code" value={formData.role_code} /> */}

                    <div className="form-group">
                        <label>Enter Remark</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="Enter Remark"
                        />
                    </div>

                    <div className="form-actions-row">
                        <div className="toggle-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="can_add_users"
                                    checked={formData.can_add_users === 1}
                                    onChange={handleChange}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className="toggle-label">IsSignUpB2B</span>
                        </div>

                        <div className="modal-buttons">
                            <button type="submit" className="btn-save">Save</button>
                            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
