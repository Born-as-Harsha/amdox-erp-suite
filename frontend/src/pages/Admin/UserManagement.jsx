import "./UserManagement.css";
import { useEffect, useMemo, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser, resetUserPassword } from "../../services/authService";
import { FaPlus, FaTrash, FaEdit, FaKey, FaUserCheck, FaUserMinus, FaDownload, FaSpinner, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [saving, setSaving] = useState(false);

    const initialFormData = {
        employeeId: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "Employee",
        department: "Engineering",
        designation: "Software Engineer",
        status: "Active"
    };
    const [formData, setFormData] = useState(initialFormData);
    const [newPassword, setNewPassword] = useState("");

    // Filtering, sorting and paging state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        loadUsers();
    }, []);

    // Reset pagination on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRole, selectedStatus]);

    async function loadUsers() {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Load users error", error);
            toast.error("Failed to load user directory.");
        } finally {
            setLoading(false);
        }
    }

    const openAddModal = () => {
        setFormData(initialFormData);
        setSelectedUser(null);
        setShowFormModal(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            employeeId: user.employeeId || "",
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            password: "", // do not fill password on edit
            role: user.role || "Employee",
            department: user.department || "",
            designation: user.designation || "",
            status: user.status || "Active"
        });
        setShowFormModal(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user account permanently?");
        if (!confirmDelete) return;

        try {
            await deleteUser(id);
            toast.success("User account deleted.");
            loadUsers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user.");
        }
    };

    const toggleStatus = async (user) => {
        const nextStatus = user.status === "Active" ? "Inactive" : "Active";
        try {
            await updateUser(user._id, { status: nextStatus });
            toast.success(`User is now ${nextStatus}.`);
            loadUsers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to toggle status.");
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        if (!formData.employeeId.trim() || !formData.name.trim() || !formData.email.trim() || (!selectedUser && !formData.password.trim())) {
            toast.error("Please fill all mandatory fields.");
            return;
        }

        setSaving(true);
        try {
            if (selectedUser) {
                await updateUser(selectedUser._id, formData);
                toast.success("User details updated.");
            } else {
                await createUser(formData);
                toast.success("User account created successfully.");
            }
            setShowFormModal(false);
            loadUsers();
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to save user.");
        } finally {
            setSaving(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setSaving(true);
        try {
            await resetUserPassword(selectedUser._id, newPassword);
            toast.success("Password reset successfully.");
            setShowPasswordModal(false);
            setNewPassword("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reset password.");
        } finally {
            setSaving(false);
        }
    };

    const exportUsersCSV = () => {
        const headers = ["Employee ID", "Full Name", "Email", "Phone", "Role", "Department", "Designation", "Status", "Last Login"];
        const rows = filteredUsers.map(u => [
            u.employeeId,
            u.name,
            u.email,
            u.phone,
            u.role,
            u.department,
            u.designation,
            u.status,
            u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `AMADOX_User_Directory_${new Date().toISOString().substring(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Table Header Sorting trigger
    const triggerSort = (column) => {
        if (sortBy === column) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    // Render sorting icon
    const renderSortIcon = (column) => {
        if (sortBy !== column) return <FaSort className="sort-icon-muted" />;
        return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    };

    // Unique Roles options list
    const roleOptions = ["All", "Super Admin", "Admin", "HR Manager", "HR Executive", "Finance Manager", "Accountant", "Inventory Manager", "Store Keeper", "Project Manager", "Project Lead", "Employee", "Executive", "Viewer"];

    // Search, Filter, Sort processing
    const filteredUsers = useMemo(() => {
        let result = [...users];

        // 1. Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (u) =>
                    (u.name || "").toLowerCase().includes(term) ||
                    (u.employeeId || "").toLowerCase().includes(term) ||
                    (u.email || "").toLowerCase().includes(term) ||
                    (u.department || "").toLowerCase().includes(term)
            );
        }

        // 2. Role Filter
        if (selectedRole && selectedRole !== "All") {
            result = result.filter(u => u.role === selectedRole);
        }

        // 3. Status Filter
        if (selectedStatus && selectedStatus !== "All") {
            result = result.filter(u => u.status === selectedStatus);
        }

        // 4. Sort
        if (sortBy) {
            result.sort((a, b) => {
                let valA = a[sortBy];
                let valB = b[sortBy];
                if (typeof valA === "string") {
                    valA = valA.toLowerCase();
                    valB = (valB || "").toLowerCase();
                }
                if (valA < valB) return sortDirection === "asc" ? -1 : 1;
                if (valA > valB) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [users, searchTerm, selectedRole, selectedStatus, sortBy, sortDirection]);

    // Paginate subset
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

    // Counts stats
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.status === "Active").length;
        const inactive = users.filter(u => u.status === "Inactive").length;
        return { total, active, inactive };
    }, [users]);

    if (loading) {
        return (
            <div className="users-loading-view">
                <FaSpinner className="spinner" />
                <h2>Loading User Directories...</h2>
            </div>
        );
    }

    return (
        <div className="users-view-container">
            <div className="users-header-row">
                <div>
                    <h1>User Account Management</h1>
                    <p>Manage enterprise auth details, toggle active logs, assign RBAC permissions, and verify accounts.</p>
                </div>
                <div className="users-actions-row">
                    <button type="button" className="erp-btn-secondary" onClick={exportUsersCSV}>
                        <FaDownload /> Export CSV
                    </button>
                    <button type="button" className="erp-btn-primary" onClick={openAddModal}>
                        <FaPlus /> Create User
                    </button>
                </div>
            </div>

            {/* KPI statistics cards */}
            <div className="users-stats-grid">
                <div className="erp-card user-stat-card">
                    <h3>Total Accounts</h3>
                    <h2>{stats.total}</h2>
                    <small>System directories</small>
                </div>
                <div className="erp-card user-stat-card">
                    <h3>Active Profiles</h3>
                    <h2>{stats.active}</h2>
                    <small>Authorized access logs</small>
                </div>
                <div className="erp-card user-stat-card">
                    <h3>Deactivated</h3>
                    <h2>{stats.inactive}</h2>
                    <small>Blocked accounts</small>
                </div>
            </div>

            {/* Filters Row */}
            <div className="erp-filters-bar">
                <div className="filter-group">
                    <span className="filter-label">Role:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        {roleOptions.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Status:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active Only</option>
                        <option value="Inactive">Inactive Only</option>
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Search:</span>
                    <input
                        type="text"
                        placeholder="Search name, ID..."
                        className="erp-filter-select"
                        style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Directory Table */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("employeeId")}>
                                ID {renderSortIcon("employeeId")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("name")}>
                                Name {renderSortIcon("name")}
                            </th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => (
                                <tr key={user._id}>
                                    <td><strong>{user.employeeId}</strong></td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className="erp-badge primary">{user.role}</span>
                                    </td>
                                    <td>{user.department}</td>
                                    <td>
                                        <span className={`erp-badge ${user.status === "Active" ? "success" : "danger"}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="edit-icon-btn"
                                            onClick={() => handleEdit(user)}
                                            title="Edit User"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="edit-icon-btn"
                                            style={{ color: "#d97706" }}
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowPasswordModal(true);
                                            }}
                                            title="Reset Password"
                                        >
                                            <FaKey />
                                        </button>
                                        <button
                                            type="button"
                                            className="edit-icon-btn"
                                            style={{ color: user.status === "Active" ? "#dc2626" : "#16a34a" }}
                                            onClick={() => toggleStatus(user)}
                                            title={user.status === "Active" ? "Deactivate User" : "Activate User"}
                                        >
                                            {user.status === "Active" ? <FaUserMinus /> : <FaUserCheck />}
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-icon-btn"
                                            onClick={() => handleDelete(user._id)}
                                            title="Delete User"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No users found matching the filter criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Table Paginator */}
                <div className="erp-pagination">
                    <span className="erp-pagination-info">
                        Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredUsers.length} total accounts)
                    </span>
                    <div className="erp-pagination-buttons">
                        <button
                            type="button"
                            className="erp-pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            className="erp-pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Form Dialog */}
            {showFormModal && (
                <div className="modal-backdrop">
                    <div className="erp-card modal-form-card">
                        <h2>{selectedUser ? "Modify Enterprise User" : "Create Enterprise User"}</h2>
                        <form onSubmit={handleSaveUser} className="modal-grid-form">
                            <div className="erp-form-group">
                                <label>Employee ID *</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    disabled={Boolean(selectedUser)}
                                    placeholder="EMP209"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Verma"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    className="erp-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@amdox.com"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 98765 09988"
                                />
                            </div>

                            {!selectedUser && (
                                <div className="erp-form-group">
                                    <label>Initial Password *</label>
                                    <input
                                        type="password"
                                        className="erp-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Min 6 characters"
                                    />
                                </div>
                            )}

                            <div className="erp-form-group">
                                <label>Enterprise Role</label>
                                <select
                                    className="erp-input"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Admin">Admin</option>
                                    <option value="HR Manager">HR Manager</option>
                                    <option value="HR Executive">HR Executive</option>
                                    <option value="Finance Manager">Finance Manager</option>
                                    <option value="Accountant">Accountant</option>
                                    <option value="Inventory Manager">Inventory Manager</option>
                                    <option value="Store Keeper">Store Keeper</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="Project Lead">Project Lead</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Executive">Executive</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>

                            <div className="erp-form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="Engineering"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Designation</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    placeholder="Senior Engineer"
                                />
                            </div>

                            <div className="erp-form-group-full">
                                <label>Status</label>
                                <select
                                    className="erp-input"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive (Deactivated)</option>
                                </select>
                            </div>

                            <div className="modal-actions-row">
                                <button type="button" className="erp-btn-secondary" onClick={() => setShowFormModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary" disabled={saving}>
                                    {saving ? "Saving..." : selectedUser ? "Save Changes" : "Create Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showPasswordModal && (
                <div className="modal-backdrop">
                    <div className="erp-card modal-form-card" style={{ maxWidth: "420px" }}>
                        <h2>Reset Password</h2>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
                            Reset password for: <strong>{selectedUser?.email}</strong>
                        </p>
                        <form onSubmit={handleResetPassword}>
                            <div className="erp-form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    className="erp-input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                            <div className="modal-actions-row">
                                <button type="button" className="erp-btn-secondary" onClick={() => setShowPasswordModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary" disabled={saving}>
                                    {saving ? "Resetting..." : "Reset Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
