import { useState } from "react";
import { FaFileInvoiceDollar, FaSearch, FaPlusCircle, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";

function Invoices() {
    const [invoices, setInvoices] = useState([
        { id: "INV-2026-001", client: "Google Cloud Labs", date: "2026-07-10", amount: "$15,200.00", status: "Paid" },
        { id: "INV-2026-002", client: "Microsoft Enterprise", date: "2026-07-09", amount: "$24,500.00", status: "Sent" },
        { id: "INV-2026-003", client: "Amadox Global LLC", date: "2026-07-08", amount: "$9,800.00", status: "Overdue" },
        { id: "INV-2026-004", client: "Vite Builders Corp", date: "2026-07-07", amount: "$5,450.00", status: "Paid" }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const handleMarkAsPaid = (id) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Paid" } : inv));
        toast.success("Invoice payment verified and marked as Paid!");
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              inv.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="settings-container">
            <div className="settings-header" style={{ marginBottom: "24px" }}>
                <div>
                    <h1><FaFileInvoiceDollar /> Invoices Console</h1>
                    <p>Track cash flow, issue corporate billing invoices, audit revenue status, and client ledger lists.</p>
                </div>
            </div>

            <div className="settings-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "10px", flex: 1, minWidth: "280px" }}>
                        <div className="input-with-icon" style={{ flex: 1 }}>
                            <FaSearch className="input-left-icon" />
                            <input
                                type="text"
                                placeholder="Search by Client Name or INV ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: "100%", paddingLeft: "36px" }}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none" }}
                        >
                            <option value="All">All Invoices</option>
                            <option value="Paid">Paid</option>
                            <option value="Sent">Sent</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>

                    <button type="button" className="settings-submit-btn" style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={() => toast.info("Opening Invoice builder modal...")}>
                        <FaPlusCircle /> Draft Invoice
                    </button>
                </div>

                <div className="erp-table-container">
                    <table className="erp-table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Client Name</th>
                                <th>Billing Date</th>
                                <th>Invoice Amount</th>
                                <th>Payment Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map(inv => (
                                <tr key={inv.id}>
                                    <td><strong>{inv.id}</strong></td>
                                    <td>{inv.client}</td>
                                    <td>{inv.date}</td>
                                    <td style={{ color: "#0f172a", fontWeight: "600" }}>{inv.amount}</td>
                                    <td>
                                        <span className={`erp-badge ${
                                            inv.status === "Paid" ? "success" : 
                                            inv.status === "Sent" ? "pending" : "danger"
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            {inv.status !== "Paid" && (
                                                <button type="button" className="erp-pagination-btn" style={{ padding: "4px 8px", background: "#dcfce7", color: "#15803d", border: "none" }} onClick={() => handleMarkAsPaid(inv.id)}>
                                                    Mark Paid
                                                </button>
                                            )}
                                            <button type="button" className="erp-pagination-btn" style={{ padding: "4px 8px", border: "none" }} onClick={() => toast.info(`Downloading PDF sheet for ${inv.id}`)}>
                                                <FaDownload /> PDF
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Invoices;
