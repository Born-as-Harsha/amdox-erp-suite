import { useState, useMemo } from "react";
import { FaDownload, FaPrint } from "react-icons/fa";

function Payroll() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const payrollData = [
        { id: "EMP101", name: "Rahul Sharma", gross: 95000, deductions: 8500, net: 86500, status: "Paid" },
        { id: "EMP102", name: "Priya Patel", gross: 82000, deductions: 7200, net: 74800, status: "Paid" },
        { id: "EMP103", name: "Amit Kumar", gross: 60000, deductions: 5000, net: 55000, status: "Pending" },
        { id: "EMP104", name: "Sneha Reddy", gross: 120000, deductions: 11000, net: 109000, status: "Paid" },
        { id: "EMP105", name: "Vikram Malhotra", gross: 75000, deductions: 6500, net: 68500, status: "Pending" }
    ];

    const filteredPayroll = useMemo(() => {
        return payrollData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, selectedStatus]);

    const stats = useMemo(() => {
        const totalGross = filteredPayroll.reduce((sum, item) => sum + item.gross, 0);
        const totalDeductions = filteredPayroll.reduce((sum, item) => sum + item.deductions, 0);
        const totalNet = filteredPayroll.reduce((sum, item) => sum + item.net, 0);
        return { totalGross, totalDeductions, totalNet };
    }, [filteredPayroll]);

    const exportToCSV = () => {
        const headers = ["Employee ID", "Employee Name", "Gross Salary", "Deductions", "Net Salary", "Status"];
        const rows = filteredPayroll.map(item => [item.id, item.name, item.gross, item.deductions, item.net, item.status]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Payroll_Audit.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }} className="no-print">
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Payroll Ledger</h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Manage, audit, and distribute employee payouts, gross earnings, and deductions.</p>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" className="erp-btn-secondary" onClick={exportToCSV}>
                        <FaDownload /> Export CSV
                    </button>
                    <button type="button" className="erp-btn-secondary" onClick={() => window.print()}>
                        <FaPrint /> Print
                    </button>
                </div>
            </div>

            {/* KPI statistics cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Gross Payroll</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>₹{stats.totalGross.toLocaleString("en-IN")}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Total budget commitment</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Total Deductions</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#ef4444" }}>₹{stats.totalDeductions.toLocaleString("en-IN")}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Taxes & Provident funds</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Net Disbursed</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#16a34a" }}>₹{stats.totalNet.toLocaleString("en-IN")}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Final take-home salaries</small>
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
                        <option value="All">All Payments</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
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

            {/* Payroll Table */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Gross Salary</th>
                            <th>Deductions</th>
                            <th>Net Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayroll.length > 0 ? (
                            filteredPayroll.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.id}</strong></td>
                                    <td>{item.name}</td>
                                    <td>₹{item.gross.toLocaleString("en-IN")}</td>
                                    <td>₹{item.deductions.toLocaleString("en-IN")}</td>
                                    <td><strong>₹{item.net.toLocaleString("en-IN")}</strong></td>
                                    <td>
                                        <span className={`erp-badge ${item.status === "Paid" ? "success" : "warning"}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No payroll records matched the criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Payroll;
