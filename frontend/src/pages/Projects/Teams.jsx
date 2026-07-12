import { useState } from "react";
import { FaUsers, FaSearch, FaUserPlus, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";

function Teams() {
    const [teamMembers, setTeamMembers] = useState([
        { id: "1", name: "Aman Sen", role: "DevOps Engineer", project: "AI Cloud ERP Suite", allocation: "100%", status: "Active" },
        { id: "2", name: "Deepa Nair", role: "UI Designer", project: "Client Portal Roster", allocation: "50%", status: "Active" },
        { id: "3", name: "Ketan Rao", role: "Backend Developer", project: "AI Cloud ERP Suite", allocation: "80%", status: "On Leave" },
        { id: "4", name: "Priya Varma", role: "QA Engineer", project: "Audit Sheet Automation", allocation: "100%", status: "Active" }
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const handleRelease = (id) => {
        setTeamMembers(prev => prev.filter(m => m.id !== id));
        toast.success("Team member released from project allocation.");
    };

    const filteredMembers = teamMembers.filter(m => {
        return m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
               m.project.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="settings-container">
            <div className="settings-header" style={{ marginBottom: "24px" }}>
                <div>
                    <h1><FaUsers /> Team Allocations</h1>
                    <p>Track project squads, assign developers to project tasks, audit allocation percentages, and release engineers.</p>
                </div>
            </div>

            <div className="settings-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
                    <div className="input-with-icon" style={{ flex: 1, minWidth: "280px" }}>
                        <FaSearch className="input-left-icon" />
                        <input
                            type="text"
                            placeholder="Search by Team Member Name, Role or Project..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", paddingLeft: "36px" }}
                        />
                    </div>

                    <button type="button" className="settings-submit-btn" style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={() => toast.info("Opening team assignment wizard...")}>
                        <FaUserPlus /> Assign Team Member
                    </button>
                </div>

                <div className="erp-table-container">
                    <table className="erp-table">
                        <thead>
                            <tr>
                                <th>Engineer Name</th>
                                <th>Enterprise Role</th>
                                <th>Assigned Campaign</th>
                                <th>Allocation Rate</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map(m => (
                                <tr key={m.id}>
                                    <td><strong>{m.name}</strong></td>
                                    <td>{m.role}</td>
                                    <td>{m.project}</td>
                                    <td style={{ fontWeight: "600" }}>{m.allocation}</td>
                                    <td>
                                        <span className={`erp-badge ${m.status === "Active" ? "success" : "pending"}`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button type="button" className="erp-pagination-btn" style={{ padding: "4px 8px", background: "#fee2e2", color: "#b91c1c", border: "none" }} onClick={() => handleRelease(m.id)}>
                                                Release
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

export default Teams;
