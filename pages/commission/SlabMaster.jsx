import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLink, FaSearch, FaFilePdf, FaFileExcel, FaCaretDown, FaEdit, FaTrash } from "react-icons/fa";
import "../../assets/styles/SlabMaster.css";
import api from "../../api/axios";
import SlabModal from "../../components/SlabModal";

import { useToast } from "../../context/ToastContext";

export default function SlabMaster() {
    const navigate = useNavigate();
    const toast = useToast();
    const [slabs, setSlabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("Both");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlab, setEditingSlab] = useState(null);
    const [openActionId, setOpenActionId] = useState(null); // For dropdown

    useEffect(() => {
        fetchSlabs();
    }, []);

    const fetchSlabs = async () => {
        try {
            const response = await api.get("/user-roles");
            if (response.data.success) {
                // Map roles to "slabs"
                const mappedSlabs = response.data.data.map((role, index) => ({
                    id: role.id,
                    sNo: index + 1,
                    name: role.role_name,
                    role_code: role.role_code, // Keep original code
                    details: role.description || "",
                    entryDate: new Date(role.created_at).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                    }),
                    modifyDate: new Date(role.updated_at).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                    }),
                    isActive: Boolean(role.is_active) && role.is_active !== 0,
                    isSignupB2B: role.can_add_users === 1 ? "Yes" : "No",
                    userCount: role.user_count || 0
                }));
                setSlabs(mappedSlabs);
            }
        } catch (error) {
            console.error("Error fetching slabs:", error);
            // Minimal fallback only if absolutely necessary
            if (slabs.length === 0) setSlabs([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredSlabs = slabs.filter(slab =>
        slab.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleToggle = async (id, currentStatus) => {
        const newStatus = !currentStatus;

        try {
            // Optimistic update
            setSlabs(slabs.map(slab =>
                slab.id === id ? { ...slab, isActive: newStatus } : slab
            ));

            const statusText = newStatus ? "active" : "inactive";
            const title = newStatus ? "Activated!" : "Inactivated!";

            toast.info(`${title} Slab to ${statusText}`, {
                icon: "ℹ️",
                style: { background: newStatus ? "#d1e7dd" : "#cff4fc", color: "#055160" }
            });

            await api.put(`/user-roles/${id}`, { is_active: newStatus ? 1 : 0 });

        } catch (error) {
            console.error("Error updating status:", error);
            // Revert on error
            setSlabs(slabs.map(slab =>
                slab.id === id ? { ...slab, isActive: currentStatus } : slab
            ));
            toast.error("Failed to update status");
        }
    };

    // --- Modal Handlers ---

    const handleCreateNew = () => {
        setEditingSlab(null);
        setIsModalOpen(true);
    };

    const handleEdit = (slab) => {
        setEditingSlab(slab);
        setIsModalOpen(true);
        setOpenActionId(null); // Close dropdown
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slab?")) return;

        try {
            await api.delete(`/user-roles/${id}`);
            toast.success("Slab deleted successfully");
            fetchSlabs(); // Refresh list
        } catch (error) {
            console.error("Error deleting slab:", error);
            toast.error("Failed to delete slab");
        }
        setOpenActionId(null);
    };

    const handleSaveSlab = async (formData) => {
        try {
            if (editingSlab) {
                // Update
                const response = await api.put(`/user-roles/${editingSlab.id}`, formData);
                if (response.data.success) {
                    toast.success("Slab updated successfully");
                }
            } else {
                // Create
                const response = await api.post("/user-roles", formData);
                if (response.data.success) {
                    toast.success("Slab created successfully");
                }
            }
            setIsModalOpen(false);
            fetchSlabs(); // Refresh list
        } catch (error) {
            console.error("Error saving slab:", error);
            const msg = error?.message || error?.response?.data?.message || "Failed to save slab";
            toast.error(msg);
        }
    };

    // --- Dropdown Handler ---
    const toggleActionMenu = (id) => {
        setOpenActionId(openActionId === id ? null : id);
    };

    // --- Export Handler ---
    const handleExport = () => {
        if (slabs.length === 0) {
            toast.warn("No data to export");
            return;
        }

        // Define headers
        const headers = ["S.No", "Slab Name", "Role Code", "Details", "Entry Date", "Modify Date", "Active", "Signup B2B", "User Count"];

        // Map data
        const data = slabs.map(slab => [
            slab.sNo,
            slab.name,
            slab.role_code || "-",
            slab.details,
            slab.entryDate,
            slab.modifyDate,
            slab.isActive ? "Yes" : "No",
            slab.isSignupB2B,
            slab.userCount
        ]);

        // Create CSV content
        const csvContent = [
            headers.join(","),
            ...data.map(row => row.map(item => `"${item}"`).join(","))
        ].join("\n");

        // Download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Slab_Master_Export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="slab-master-page">
            <div className="slab-master-header">
                <h2><FaLink /> Slab Master</h2>
                <div className="slab-master-controls">
                    <input
                        type="text"
                        placeholder="Search On List"
                        className="search-box"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-new" onClick={handleCreateNew}>New</button>
                    <button className="btn-export" onClick={handleExport}>
                        <FaFileExcel /> <FaFilePdf /> Export
                    </button>
                </div>
            </div>


            <div className="table-container">
                <table className="slab-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Actions</th>
                            <th>Slab Name</th>
                            <th>Entry Date</th>
                            <th>Modify Date</th>
                            <th>IsActive</th>
                            <th>IsSignupB2B</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSlabs.map((slab) => (
                            <tr key={slab.id}>
                                <td>{slab.sNo}</td>
                                <td style={{ position: 'relative' }}>
                                    <button
                                        className="action-toggle"
                                        onClick={() => toggleActionMenu(slab.id)}
                                    >
                                        <FaCaretDown />
                                    </button>
                                    {openActionId === slab.id && (
                                        <div className="action-dropdown">
                                            <div className="dropdown-header">Action Menu</div>
                                            <button onClick={() => handleEdit(slab)}>
                                                Edit
                                            </button>
                                            <button onClick={() => navigate('/commission/plans')}>
                                                Recharge Commission Slab
                                            </button>
                                            <button onClick={() => handleDelete(slab.id)} className="delete-option">
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="slab-name-cell">
                                    <strong>{slab.name}</strong>
                                    <div className="slab-links">
                                        <span
                                            className="user-link"
                                            onClick={() => navigate(`/users/user-list?slab=${slab.name}`)}
                                        >
                                            {slab.userCount} Users
                                        </span>
                                    </div>
                                </td>
                                <td>{slab.entryDate}</td>
                                <td>{slab.modifyDate}</td>
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={slab.isActive}
                                            onChange={() => handleToggle(slab.id, slab.isActive)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </td>
                                <td>
                                    <span className={slab.isActive ? "status-yes" : "status-no"}>
                                        {slab.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SlabModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSlab}
                initialData={editingSlab}
            />
        </div>
    );
}
