import React, { createContext, useContext, useState } from 'react';
import '../assets/styles/Toast.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const toast = {
        info: (message, options = {}) => {
            const id = Date.now();
            const newToast = {
                id,
                message,
                type: 'info',
                icon: options.icon || 'ℹ️',
                style: options.style || {}
            };
            setToasts(prev => [...prev, newToast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3000);
        },
        error: (message) => {
            const id = Date.now();
            const newToast = {
                id,
                message,
                type: 'error',
                icon: '❌',
                style: { background: '#f8d7da', color: '#721c24' }
            };
            setToasts(prev => [...prev, newToast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3000);
        },
        success: (message) => {
            const id = Date.now();
            const newToast = {
                id,
                message,
                type: 'success',
                icon: '✅',
                style: { background: '#d4edda', color: '#155724' }
            };
            setToasts(prev => [...prev, newToast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3000);
        },
        warning: (message) => {
            const id = Date.now();
            const newToast = {
                id,
                message,
                type: 'warning',
                icon: '⚠️',
                style: { background: '#fff3cd', color: '#856404' }
            };
            setToasts(prev => [...prev, newToast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3000);
        }
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`toast toast-${toast.type}`}
                        style={toast.style}
                    >
                        <span className="toast-icon">{toast.icon}</span>
                        <span className="toast-message">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
