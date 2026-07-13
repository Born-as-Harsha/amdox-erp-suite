import { useState, useEffect, useMemo } from "react";
import { FaPlus, FaTrash, FaCheckCircle, FaSpinner, FaComment, FaPaperPlane } from "react-icons/fa";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function Tasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [showModal, setShowModal] = useState(false);

    // Comment state
    const [activeCommentTaskId, setActiveCommentTaskId] = useState(null);
    const [commentText, setCommentText] = useState("");

    const [newTask, setNewTask] = useState({
        taskName: "",
        description: "",
        assignedTo: "",
        department: "",
        role: "",
        deadline: "",
        priority: "Medium"
    });

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get("/tasks");
            setTasks(res.data || []);
        } catch (err) {
            console.error("Failed to load tasks:", err);
            toast.error("Failed to retrieve task records.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        // Only Super Admin, Admin, and Project Manager can query the users list
        const canQueryUsers = ["Super Admin", "Admin", "Project Manager", "Project Lead"].includes(user?.role);
        if (!canQueryUsers) return;

        try {
            const res = await api.get("/users");
            setUsersList(res.data || []);
        } catch (err) {
            console.error("Failed to fetch users list:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, [user]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(item => {
            const matchesSearch = item.taskName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                 (item.assignedTo?.name && item.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [tasks, searchTerm, selectedStatus]);

    const stats = useMemo(() => {
        const pending = tasks.filter(t => t.status === "Pending").length;
        const completed = tasks.filter(t => t.status === "Completed").length;
        const overdue = tasks.filter(t => t.status === "Overdue" || (new Date(t.deadline) < new Date() && t.status !== "Completed")).length;
        return { pending, completed, overdue };
    }, [tasks]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!newTask.taskName || !newTask.assignedTo || !newTask.deadline) {
            toast.error("Mandatory fields are missing.");
            return;
        }

        try {
            // Find target department and role of assigned user automatically
            const targetUserObj = usersList.find(u => u._id === newTask.assignedTo);
            const payload = {
                ...newTask,
                department: targetUserObj?.department || "",
                role: targetUserObj?.role || ""
            };

            await api.post("/tasks", payload);
            toast.success("Task assigned successfully!");
            setShowModal(false);
            setNewTask({
                taskName: "",
                description: "",
                assignedTo: "",
                department: "",
                role: "",
                deadline: "",
                priority: "Medium"
            });
            fetchTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create task.");
        }
    };

    const toggleStatus = async (task) => {
        const nextProgress = task.progress === "To Do" ? "In Progress" : task.progress === "In Progress" ? "Done" : "To Do";
        const completionPercentage = nextProgress === "Done" ? 100 : nextProgress === "In Progress" ? 50 : 0;
        
        try {
            await api.put(`/tasks/${task._id}`, {
                progress: nextProgress,
                completionPercentage,
                status: nextProgress === "Done" ? "Completed" : "Pending"
            });
            toast.success("Task progress updated successfully!");
            fetchTasks();
        } catch (err) {
            toast.error("Failed to update task progress.");
        }
    };

    const handleAddComment = async (taskId) => {
        if (!commentText.trim()) return;
        try {
            await api.post(`/tasks/${taskId}/comments`, { text: commentText });
            toast.success("Comment added.");
            setCommentText("");
            setActiveCommentTaskId(null);
            fetchTasks();
        } catch (err) {
            toast.error("Failed to add comment.");
        }
    };

    const isPrivileged = ["Super Admin", "Admin", "Project Manager", "Project Lead"].includes(user?.role);

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Task Management</h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Create, assign, list, and complete project milestones and deliverables.</p>
                </div>
                {isPrivileged && (
                    <button type="button" className="erp-btn-primary" onClick={() => setShowModal(true)}>
                        <FaPlus /> Add Task
                    </button>
                )}
            </div>

            {/* KPI statistics cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Pending Tasks</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#d97706" }}>{stats.pending}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Requires attention</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Overdue Tasks</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#ef4444" }}>{stats.overdue}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Past deadline limits</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Completed Tasks</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#16a34a" }}>{stats.completed}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Fully finalized</small>
                </div>
            </div>

            {/* Filters Row */}
            <div className="erp-filters-bar" style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#475569" }}>Status:</span>
                    <select 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="erp-input"
                        style={{ padding: "6px 12px", width: "auto" }}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
                <input
                    type="text"
                    placeholder="Search tasks, details, assigned..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="erp-input"
                    style={{ maxWidth: "300px", padding: "6px 12px" }}
                />
            </div>

            {/* Tasks Table */}
            <div className="erp-table-container">
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <FaSpinner className="spinner" style={{ fontSize: "24px", color: "#2563eb" }} />
                        <p style={{ marginTop: "10px", color: "#64748b" }}>Loading task registers...</p>
                    </div>
                ) : (
                    <table className="erp-table">
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Description</th>
                                <th>Assigned To</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th>Progress</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((t) => (
                                    <tr key={t._id}>
                                        <td style={{ fontWeight: "600" }}>{t.taskName}</td>
                                        <td>{t.description || "N/A"}</td>
                                        <td>{t.assignedTo?.name || "Unassigned"}</td>
                                        <td>
                                            <span className={`status-badge ${t.priority.toLowerCase()}`} style={{ background: t.priority === "High" ? "#fee2e2" : t.priority === "Medium" ? "#fef3c7" : "#eff6ff", color: t.priority === "High" ? "#991b1b" : t.priority === "Medium" ? "#92400e" : "#1e40af" }}>
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td>{new Date(t.deadline).toLocaleDateString()}</td>
                                        <td>{t.progress} ({t.completionPercentage}%)</td>
                                        <td>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button
                                                    onClick={() => toggleStatus(t)}
                                                    className="action-btn"
                                                    title="Toggle Progress"
                                                >
                                                    <FaCheckCircle style={{ color: t.progress === "Done" ? "#16a34a" : "#94a3b8" }} />
                                                </button>
                                                <button
                                                    onClick={() => setActiveCommentTaskId(t._id)}
                                                    className="action-btn"
                                                    title="Comment on task"
                                                >
                                                    <FaComment style={{ color: "#3b82f6" }} />
                                                </button>
                                            </div>

                                            {/* Render Task Comments inline if selected */}
                                            {activeCommentTaskId === t._id && (
                                                <div className="task-comments-box" style={{ marginTop: "10px", padding: "10px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                                                    <h5 style={{ margin: "0 0 8px 0" }}>Comments ({t.comments?.length || 0})</h5>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "100px", overflowY: "auto", marginBottom: "8px" }}>
                                                        {t.comments?.map((c, idx) => (
                                                            <div key={idx} style={{ fontSize: "11px" }}>
                                                                <b>{c.user}:</b> {c.text}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Add comment..." 
                                                            value={commentText} 
                                                            onChange={(e) => setCommentText(e.target.value)} 
                                                            style={{ flex: 1, padding: "4px 8px", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                                        />
                                                        <button 
                                                            onClick={() => handleAddComment(t._id)}
                                                            style={{ padding: "4px 8px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                        >
                                                            <FaPaperPlane style={{ fontSize: "10px" }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                        No tasks matched the criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Dialog Form */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="erp-card modal-form-card" style={{ maxWidth: "500px" }}>
                        <h2>Assign New Task</h2>
                        <form onSubmit={handleSave} className="modal-grid-form" style={{ gridTemplateColumns: "1fr" }}>
                            <div className="erp-form-group">
                                <label>Task Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="erp-input"
                                    value={newTask.taskName}
                                    onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                                    placeholder="Setup database triggers"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Description</label>
                                <textarea
                                    className="erp-input"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Enter additional details..."
                                    style={{ height: "60px", resize: "none" }}
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Assigned To *</label>
                                <select
                                    required
                                    className="erp-input"
                                    value={newTask.assignedTo}
                                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                    style={{ background: "#ffffff" }}
                                >
                                    <option value="">-- Select Assigned User --</option>
                                    {usersList.map((u) => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: "flex", gap: "15px" }}>
                                <div className="erp-form-group" style={{ flex: 1 }}>
                                    <label>Deadline *</label>
                                    <input
                                        type="date"
                                        required
                                        className="erp-input"
                                        value={newTask.deadline}
                                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                    />
                                </div>
                                <div className="erp-form-group" style={{ flex: 1 }}>
                                    <label>Priority</label>
                                    <select
                                        className="erp-input"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        style={{ background: "#ffffff" }}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions-row" style={{ marginTop: "15px" }}>
                                <button type="button" className="erp-btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary">
                                    Assign Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;
