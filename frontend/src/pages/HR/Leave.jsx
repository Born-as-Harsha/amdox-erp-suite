import { useState, useMemo } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

function Leave() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const [leaveRequests, setLeaveRequests] = useState([
        { id: "EMP101", name: "Rahul Sharma", type: "Sick Leave", start: "2026-07-15", end: "2026-07-17", reason: "Medical recovery", status: "Pending" },
        { id: "EMP102", name: "Priya Patel", type: "Casual Leave", start: "2026-07-20", end: "2026-07-21", reason: "Family event", status: "Pending" },
        { id: "EMP103", name: "Amit Kumar", type: "Annual Leave", start: "2026-08-01", end: "2026-08-10", reason: "Summer vacation", status: "Approved" },
        { id: "EMP104", name: "Sneha Reddy", date: "2026-07-10", type: "Sick Leave", start: "2026-07-10", end: "2026-07-11", reason: "Fever checkup", status: "Rejected" }
    ]);

    const filteredRequests = useMemo(() => {
        return leaveRequests.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase()) || item.type.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [leaveRequests, searchTerm, selectedStatus]);

    const stats = useMemo(() => {
        const pending = leaveRequests.filter(r => r.status === "Pending").length;
        const approved = leaveRequests.filter(r => r.status === "Approved").length;
        const rejected = leaveRequests.filter(r => r.status === "Rejected").length;
        return { pending, approved, rejected };
    }, [leaveRequests]);

    const handleAction = (id, newStatus) => {
        setLeaveRequests(prev => prev.map(r => r.id === id && r.status === "Pending" ? { ...r, status: newStatus } : r));
    };

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Leave Approvals</h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Review, approve, or reject employee leave applications and balances.</p>
                </div>
            </div>

            {/* KPI statistics cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Pending Approvals</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#d97706" }}>{stats.pending}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Requires validation</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Approved Leaves</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#16a34a" }}>{stats.approved}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Finalized and logged</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Rejected Leaves</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#ef4444" }}>{stats.rejected}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Declined applications</small>
                </div>
            </div>

            {/* Filter controls */}
            <div className="erp-filters-bar" style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Status:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Requests</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Search:</span>
                    <input
                        type="text"
                        placeholder="Search name or type..."
                        className="erp-filter-select"
                        style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Leave Requests Table */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.id}</strong></td>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>{item.start}</td>
                                    <td>{item.end}</td>
                                    <td>{item.reason}</td>
                                    <td>
                                        <span className={`erp-badge ${
                                            item.status === "Approved" ? "success" :
                                            item.status === "Pending" ? "warning" : "danger"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        {item.status === "Pending" ? (
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    type="button"
                                                    style={{ border: "none", background: "#f0fdf4", color: "#16a34a", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }}
                                                    onClick={() => handleAction(item.id, "Approved")}
                                                >
                                                    <FaCheck /> Approve
                                                </button>
                                                <button
                                                    type="button"
                                                    style={{ border: "none", background: "#fef2f2", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }}
                                                    onClick={() => handleAction(item.id, "Rejected")}
                                                >
                                                    <FaTimes /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Decision Logged</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No leave requests matched the criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leave;
