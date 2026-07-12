import { useState, useMemo } from "react";
import { FaPrint, FaClock } from "react-icons/fa";

function Attendance() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const attendanceRecords = [
        { id: "EMP101", name: "Rahul Sharma", date: "2026-07-12", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "On-Time" },
        { id: "EMP102", name: "Priya Patel", date: "2026-07-12", checkIn: "09:15 AM", checkOut: "06:00 PM", status: "Late" },
        { id: "EMP103", name: "Amit Kumar", date: "2026-07-12", checkIn: "09:02 AM", checkOut: "06:00 PM", status: "On-Time" },
        { id: "EMP104", name: "Sneha Reddy", date: "2026-07-12", checkIn: "09:45 AM", checkOut: "06:00 PM", status: "Late" },
        { id: "EMP105", name: "Vikram Malhotra", date: "2026-07-12", checkIn: "-", checkOut: "-", status: "Absent" }
    ];

    const filteredRecords = useMemo(() => {
        return attendanceRecords.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, selectedStatus]);

    const stats = useMemo(() => {
        const present = attendanceRecords.filter(r => r.status !== "Absent").length;
        const absent = attendanceRecords.filter(r => r.status === "Absent").length;
        const late = attendanceRecords.filter(r => r.status === "Late").length;
        return { present, absent, late };
    }, []);

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }} className="no-print">
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Attendance Logs</h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Track daily clock-in schedules, late entries, and absenteeism reports.</p>
                </div>
                <div>
                    <button type="button" className="erp-btn-secondary" onClick={() => window.print()}>
                        <FaPrint /> Print Logs
                    </button>
                </div>
            </div>

            {/* KPI statistics cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Present Today</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#16a34a" }}>{stats.present}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Clocked in staff</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Late Entries</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#d97706" }}>{stats.late}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Entries after 09:10 AM</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Absent today</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#ef4444" }}>{stats.absent}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>No active check-in</small>
                </div>
            </div>

            {/* Filter controls */}
            <div className="erp-filters-bar no-print" style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Status:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Records</option>
                        <option value="On-Time">On-Time</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Search:</span>
                    <input
                        type="text"
                        placeholder="Search employee..."
                        className="erp-filter-select"
                        style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Attendance Table */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Clock In</th>
                            <th>Clock Out</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.date}</td>
                                    <td><strong>{item.id}</strong></td>
                                    <td>{item.name}</td>
                                    <td>
                                        <FaClock style={{ color: "#94a3b8", marginRight: "6px", verticalAlign: "middle" }} />
                                        {item.checkIn}
                                    </td>
                                    <td>{item.checkOut}</td>
                                    <td>
                                        <span className={`erp-badge ${
                                            item.status === "On-Time" ? "success" :
                                            item.status === "Late" ? "warning" : "danger"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No attendance logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Attendance;
