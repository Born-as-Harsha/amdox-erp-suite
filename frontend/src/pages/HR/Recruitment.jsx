import { useState } from "react";
import { FaUserPlus, FaSearch, FaUserTie, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

function Recruitment() {
    const [candidates, setCandidates] = useState([
        { id: "1", name: "Ananya Sharma", role: "Frontend Developer", department: "Engineering", status: "Interviewing", date: "2026-07-10" },
        { id: "2", name: "Rohan Varma", role: "HR Recruiter", department: "HR Operations", status: "Offered", date: "2026-07-09" },
        { id: "3", name: "Vikram Malhotra", role: "Financial Analyst", department: "Finance", status: "Rejected", date: "2026-07-08" },
        { id: "4", name: "Simran Kaur", role: "DevOps Engineer", department: "Engineering", status: "Shortlisted", date: "2026-07-07" }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const handleShortlist = (id) => {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "Shortlisted" } : c));
        toast.success("Candidate shortlisted for interview!");
    };

    const handleReject = (id) => {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "Rejected" } : c));
        toast.error("Candidate application archived.");
    };

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              c.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="settings-container">
            <div className="settings-header" style={{ marginBottom: "24px" }}>
                <div>
                    <h1><FaUserTie /> Recruitment Management</h1>
                    <p>Track job candidates, shortlist resumes, manage department allocations, and coordinate interview logs.</p>
                </div>
            </div>

            <div className="settings-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "10px", flex: 1, minWidth: "280px" }}>
                        <div className="input-with-icon" style={{ flex: 1 }}>
                            <FaSearch className="input-left-icon" />
                            <input
                                type="text"
                                placeholder="Search candidates or job roles..."
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
                            <option value="All">All Statuses</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <button type="button" className="settings-submit-btn" style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={() => toast.info("Opening new candidate registration form...")}>
                        <FaUserPlus /> Add New Candidate
                    </button>
                </div>

                <div className="erp-table-container">
                    <table className="erp-table">
                        <thead>
                            <tr>
                                <th>Candidate Name</th>
                                <th>Position Applied</th>
                                <th>Department</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map(c => (
                                <tr key={c.id}>
                                    <td><strong>{c.name}</strong></td>
                                    <td>{c.role}</td>
                                    <td>{c.department}</td>
                                    <td>{c.date}</td>
                                    <td>
                                        <span className={`erp-badge ${
                                            c.status === "Offered" ? "success" : 
                                            c.status === "Interviewing" ? "pending" : 
                                            c.status === "Rejected" ? "danger" : "info"
                                        }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        {c.status === "Interviewing" && (
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button type="button" className="erp-pagination-btn" style={{ padding: "4px 8px", background: "#dcfce7", color: "#15803d", border: "none" }} onClick={() => handleShortlist(c.id)}>
                                                    Shortlist
                                                </button>
                                                <button type="button" className="erp-pagination-btn" style={{ padding: "4px 8px", background: "#fee2e2", color: "#b91c1c", border: "none" }} onClick={() => handleReject(c.id)}>
                                                    Archive
                                                </button>
                                            </div>
                                        )}
                                        {c.status !== "Interviewing" && <span style={{ color: "#64748b", fontSize: "12px" }}>Processed</span>}
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

export default Recruitment;
