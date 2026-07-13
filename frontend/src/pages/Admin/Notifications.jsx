import { useState, useEffect } from "react";
import { FaBell, FaPaperPlane, FaSearch, FaUserClock, FaTrash, FaCheck, FaKeyboard, FaPalette } from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-toastify";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");

    const [newNotif, setNewNotif] = useState({
        title: "",
        description: "",
        priority: "Medium",
        type: "Announcement",
        targetType: "All",
        targetId: ""
    });

    const presetTemplates = [
        {
            name: "Database Upgrade",
            title: "Scheduled Core Database Maintenance Notice",
            description: "We will be executing scheduled core database upgrades on Sunday at 02:00 UTC. System access will be suspended for 2 hours.",
            type: "System",
            priority: "High",
            targetType: "All",
            targetId: ""
        },
        {
            name: "Payroll Statements",
            title: "Monthly Payroll Sheets Processed",
            description: "All monthly payroll spreadsheets and bank transfer logs have been finalized. Please verify your individual pay statements on the payroll module.",
            type: "Finance",
            priority: "Medium",
            targetType: "All",
            targetId: ""
        },
        {
            name: "Corporate Holiday",
            title: "National Holiday Corporate Closure Notice",
            description: "All corporate branch offices and support desks will remain closed tomorrow in observance of the upcoming national festival holiday. Operations resume on Tuesday.",
            type: "Announcement",
            priority: "Low",
            targetType: "All",
            targetId: ""
        },
        {
            name: "Quarterly All-Hands",
            title: "Mandatory Corporate All-Hands Meeting",
            description: "The quarterly all-hands company strategy and review meeting is scheduled for tomorrow at 10:00 AM. Attendance is mandatory for all active employees.",
            type: "Announcement",
            priority: "Medium",
            targetType: "All",
            targetId: ""
        }
    ];

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Failed to load notifications history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const applyTemplate = (tpl) => {
        setNewNotif({
            title: tpl.title,
            description: tpl.description,
            priority: tpl.priority,
            type: tpl.type,
            targetType: tpl.targetType,
            targetId: tpl.targetId || ""
        });
        toast.info(`Applied "${tpl.name}" suggestion template.`);
    };

    const handleCreateNotification = async (e) => {
        e.preventDefault();
        if (!newNotif.title.trim()) return;

        try {
            await api.post("/notifications", newNotif);
            toast.success("Broadcast announcement sent successfully!");
            setNewNotif({
                title: "",
                description: "",
                priority: "Medium",
                type: "Announcement",
                targetType: "All",
                targetId: ""
            });
            fetchNotifications();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to dispatch notification.");
        }
    };

    const handleArchive = async (id) => {
        try {
            await api.put(`/notifications/${id}/archive`);
            toast.success("Notification archived.");
            fetchNotifications();
        } catch (err) {
            toast.error("Failed to archive notification.");
        }
    };

    const filteredNotifs = notifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (n.description && n.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = typeFilter === "All" || n.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                        <FaBell style={{ color: "#3b82f6", marginRight: "10px" }} /> Notifications Console
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Broadcast announcements, targets, and track history across all active user roles.</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "30px", alignItems: "start" }}>
                {/* Left Column: History list */}
                <div className="erp-card" style={{ padding: "24px" }}>
                    <h3 style={{ marginBottom: "20px", fontSize: "16px", color: "#1e293b", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>Dispatched History</h3>
                    
                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                        <div className="input-with-icon" style={{ flex: 1 }}>
                            <FaSearch className="input-left-icon" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: "100%", paddingLeft: "36px" }}
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none" }}
                        >
                            <option value="All">All Categories</option>
                            <option value="Announcement">Announcement</option>
                            <option value="Task">Task</option>
                            <option value="Reminder">Reminder</option>
                            <option value="System">System</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <div className="spinner-large" style={{ margin: "0 auto 10px auto" }}></div>
                            <p style={{ color: "#64748b" }}>Loading dispatch history...</p>
                        </div>
                    ) : filteredNotifs.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {filteredNotifs.map((n) => (
                                <div key={n._id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "15px", position: "relative", background: "#ffffff", borderLeft: n.priority === "High" ? "4px solid #ef4444" : n.priority === "Medium" ? "4px solid #d97706" : "4px solid #3b82f6" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", background: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: "4px", border: "1px solid #dbeafe" }}>{n.type}</span>
                                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>{new Date(n.createdAt).toLocaleString()}</span>
                                    </div>
                                    <h4 style={{ margin: "0 0 4px 0", color: "#0f172a", fontSize: "15px", fontWeight: "600" }}>{n.title}</h4>
                                    <p style={{ margin: "0 0 10px 0", color: "#475569", fontSize: "13px", lineHeight: "1.5" }}>{n.description}</p>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "8px", fontSize: "11px", color: "#64748b" }}>
                                        <span>Target: <b>{n.targetType} {n.targetId ? `(${n.targetId})` : ""}</b> | Sender: <b>{n.sender?.email || "System"}</b></span>
                                        <button 
                                            onClick={() => handleArchive(n._id)}
                                            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}
                                        >
                                            <FaTrash /> Archive
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                            No notifications match filters.
                        </div>
                    )}
                </div>

                {/* Right Column: Suggestions & Dispatch Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    
                    {/* Suggestions Dictionary */}
                    <div className="erp-card" style={{ padding: "20px" }}>
                        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FaKeyboard style={{ color: "#3b82f6" }} /> Suggestion Presets
                        </h4>
                        <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 15px 0" }}>Select a pre-defined suggestion dictionary template below to populate form inputs instantly.</p>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {presetTemplates.map((tpl, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => applyTemplate(tpl)}
                                    style={{ textAlign: "left", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s ease", fontSize: "12px", fontWeight: "600", color: "#334155" }}
                                    className="template-preset-btn"
                                >
                                    <span>{tpl.name}</span>
                                    <span style={{ fontSize: "10px", background: "#ffffff", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e2e8f0", color: "#64748b" }}>{tpl.type}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form panel */}
                    <div className="erp-card" style={{ padding: "24px" }}>
                        <h3 style={{ marginBottom: "20px", fontSize: "16px", color: "#1e293b", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
                            <FaPaperPlane style={{ color: "#2563eb", marginRight: "6px" }} /> Broadcaster Form
                        </h3>
                        
                        <form onSubmit={handleCreateNotification} className="settings-form">
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label>Notification Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter title (e.g. System Downtime)"
                                    value={newNotif.title}
                                    onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                                    style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label>Description Details</label>
                                <textarea
                                    rows="3"
                                    placeholder="Enter details..."
                                    value={newNotif.description}
                                    onChange={(e) => setNewNotif({ ...newNotif, description: e.target.value })}
                                    style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", resize: "none" }}
                                />
                            </div>

                            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Category</label>
                                    <select
                                        value={newNotif.type}
                                        onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                                        style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff" }}
                                    >
                                        <option value="Announcement">Announcement</option>
                                        <option value="Task">Task</option>
                                        <option value="Reminder">Reminder</option>
                                        <option value="System">System</option>
                                        <option value="Finance">Finance</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Priority</label>
                                    <select
                                        value={newNotif.priority}
                                        onChange={(e) => setNewNotif({ ...newNotif, priority: e.target.value })}
                                        style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff" }}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label>Audience Target</label>
                                <select
                                    value={newNotif.targetType}
                                    onChange={(e) => setNewNotif({ ...newNotif, targetType: e.target.value, targetId: "" })}
                                    style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff" }}
                                >
                                    <option value="All">Entire Company</option>
                                    <option value="Role">Role Filter</option>
                                    <option value="Department">Department Filter</option>
                                </select>
                            </div>

                        {newNotif.targetType !== "All" && (
                            <div className="form-group" style={{ marginBottom: "20px" }}>
                                <label>Audience Target Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder={newNotif.targetType === "Role" ? "e.g. HR Manager" : "e.g. Engineering"}
                                    value={newNotif.targetId}
                                    onChange={(e) => setNewNotif({ ...newNotif, targetId: e.target.value })}
                                    style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}
                                />
                            </div>
                        )}

                        <button type="submit" className="settings-submit-btn" style={{ width: "100%", padding: "12px" }}>
                            <FaPaperPlane style={{ marginRight: "6px" }} /> Dispatch Announcement
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Notifications;
