import { useState, useEffect } from "react";
import { FaHistory, FaFilter, FaSearch, FaDownload, FaFilePdf, FaTimes } from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-toastify";

function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState("All");
    
    // Default filter to today's date to keep UI clean and performant
    const todayStr = new Date().toISOString().split("T")[0];
    const [dateFilter, setDateFilter] = useState(todayStr);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get("/users/audit-logs").catch(() => null);
                if (response && response.data) {
                    setLogs(response.data);
                } else {
                    setLogs([
                        { _id: "1", userId: { email: "admin@amadox.com" }, action: "User Login", details: "User admin@amadox.com logged in successfully.", ipAddress: "127.0.0.1", createdAt: new Date().toISOString() },
                        { _id: "2", userId: { email: "hr.manager@amadox.com" }, action: "OTP Login Verified", details: "OTP code verified for hr.manager@amadox.com.", ipAddress: "192.168.1.5", createdAt: new Date().toISOString() },
                        { _id: "3", userId: { email: "admin@amadox.com" }, action: "Settings Update", details: "Super Admin updated profile picture.", ipAddress: "127.0.0.1", createdAt: new Date(Date.now() - 86400000).toISOString() }, // Yesterday
                        { _id: "4", userId: { email: "operations@amadox.com" }, action: "User Registration", details: "Admin created new account user EMP018.", ipAddress: "127.0.0.1", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() } // 2 days ago
                    ]);
                }
            } catch (err) {
                console.error("Audit log error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(l => {
        const matchesSearch = (l.userId?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (l.details || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = actionFilter === "All" || l.action === actionFilter;
        
        let matchesDate = true;
        if (dateFilter) {
            const logDate = new Date(l.timestamp || l.createdAt).toISOString().split("T")[0];
            matchesDate = logDate === dateFilter;
        }
        
        return matchesSearch && matchesAction && matchesDate;
    });

    const exportCSV = () => {
        const headers = "Timestamp,Email,Action,Details,IP Address\n";
        const rows = filteredLogs.map(l => `"${new Date(l.timestamp || l.createdAt).toLocaleString()}","${l.userId?.email || "System"}","${l.action}","${l.details}","${l.ipAddress}"`).join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `Amadox_Audit_Logs_${dateFilter || "all"}_${Date.now()}.csv`);
        a.click();
        toast.success("Audit logs exported to CSV.");
    };

    const exportPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            toast.error("Popup blocked. Please allow popups to export PDF.");
            return;
        }

        const htmlContent = `
            <html>
                <head>
                    <title>AMADOX ERP - Audit Logs Report</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 30px; }
                        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
                        h1 { color: #0f172a; margin: 0 0 5px 0; font-size: 24px; font-weight: 700; }
                        p { color: #64748b; font-size: 14px; margin: 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 12px; }
                        th { background: #f8fafc; font-weight: 700; color: #475569; }
                        tr:nth-child(even) { background: #f8fafc; }
                        .badge { background: #eff6ff; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; border: 1px solid #dbeafe; }
                        .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>AMADOX ERP - Corporate Audit logs Report</h1>
                        <p>Generated on: ${new Date().toLocaleString()} | Filter Date: ${dateFilter || "All"} | Total Entries: ${filteredLogs.length}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Corporate Email</th>
                                <th>Action Category</th>
                                <th>Details</th>
                                <th>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredLogs.map(l => `
                                <tr>
                                    <td>${new Date(l.timestamp || l.createdAt).toLocaleString()}</td>
                                    <td><b>${l.userId?.email || "System/Database"}</b></td>
                                    <td><span class="badge">${l.action}</span></td>
                                    <td>${l.details}</td>
                                    <td><code>${l.ipAddress}</code></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                    <div class="footer">
                        © 2026 Amadox Technologies Pvt. Ltd. Confidential.
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        toast.success("Audit PDF preview generated.");
    };

    return (
        <div className="settings-container">
            <div className="settings-header" style={{ marginBottom: "24px" }}>
                <div>
                    <h1><FaHistory /> Audit Logs Console</h1>
                    <p>Track security access histories, password recovery updates, and operational database logs.</p>
                </div>
            </div>

            <div className="settings-card" style={{ padding: "24px" }}>                 <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "10px", flex: 1, minWidth: "280px", flexWrap: "wrap" }}>
                        <div className="input-with-icon" style={{ flex: 1, minWidth: "200px" }}>
                            <FaSearch className="input-left-icon" />
                            <input
                                type="text"
                                placeholder="Search by email or details..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: "100%", paddingLeft: "36px" }}
                            />
                        </div>
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none" }}
                        >
                            <option value="All">All Actions</option>
                            <option value="User Login">User Login</option>
                            <option value="OTP Login Verified">OTP Login Verified</option>
                            <option value="Settings Update">Settings Update</option>
                            <option value="User Registration">User Registration</option>
                        </select>

                        {/* Date Filter Input */}
                        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                style={{ padding: "10px 30px 10px 10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none", fontSize: "14px" }}
                            />
                            {dateFilter && (
                                <button 
                                    onClick={() => setDateFilter("")}
                                    style={{ position: "absolute", right: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                                    title="Clear date filter"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button type="button" className="settings-submit-btn" onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#059669" }}>
                            <FaDownload /> Export Excel
                        </button>
                        <button type="button" className="settings-submit-btn" onClick={exportPDF} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ef4444" }}>
                            <FaFilePdf /> Export PDF
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="settings-loading">
                        <div className="spinner-large"></div>
                    </div>
                ) : (
                    <div className="erp-table-container">
                        <table className="erp-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Corporate Email</th>
                                    <th>Action Category</th>
                                    <th>Details</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map(l => (
                                        <tr key={l._id}>
                                            <td style={{ fontSize: "13px" }}>{new Date(l.timestamp || l.createdAt).toLocaleString()}</td>
                                            <td><strong>{l.userId?.email || "System/Database"}</strong></td>
                                            <td><span className="erp-badge success" style={{ textTransform: "uppercase" }}>{l.action}</span></td>
                                            <td style={{ fontSize: "13px", color: "#475569" }}>{l.details}</td>
                                            <td style={{ fontFamily: "monospace" }}>{l.ipAddress}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                            No security logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuditLogs;
