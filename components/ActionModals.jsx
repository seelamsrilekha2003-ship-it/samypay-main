import React, { useState } from 'react';
import '../assets/styles/ActionModals.css';

export const PasswordModal = ({ user, onClose, onSave }) => {
    const [password, setPassword] = useState('');

    return (
        <div className="modal-overlay">
            <div className="action-modal">
                <div className="modal-header">
                    <h3>Reset Password for {user.name}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-save" onClick={() => onSave(password)}>Save Password</button>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export const PinModal = ({ user, onClose, onSave }) => {
    const [pin, setPin] = useState('');

    return (
        <div className="modal-overlay">
            <div className="action-modal">
                <div className="modal-header">
                    <h3>Reset PIN for {user.name}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>New 4-Digit PIN</label>
                        <input
                            type="password"
                            maxLength="4"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 4-digit PIN"
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-save" onClick={() => onSave(pin)}>Save PIN</button>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
