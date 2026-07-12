import { useState, useMemo } from "react";
import { FaPlus, FaTrash, FaCheckCircle, FaSpinner } from "react-icons/fa";

function Tasks() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [showModal, setShowModal] = useState(false);

    const [tasks, setTasks] = useState([
        { id: "TSK001", title: "Setup Database Schema", project: "ERP Suite", assigned: "Rahul Sharma", deadline: "2026-07-20", status: "Completed" },
        { id: "TSK002", title: "Build React Router Guard", project: "ERP Suite", assigned: "Sneha Reddy", deadline: "2026-07-25", status: "In Progress" },
        { id: "TSK003", title: "Redesign Inventory Table", project: "Logistics App", assigned: "Amit Kumar", deadline: "2026-07-30", status: "To-Do" },
        { id: "TSK004", title: "Design Financial Flow", project: "Finance App", assigned: "Priya Patel", deadline: "2026-08-05", status: "To-Do" }
    ]);

    const [newTask, setNewTask] = useState({
        id: "",
        title: "",
        project: "",
        assigned: "",
        deadline: "",
        status: "To-Do"
    });

    const filteredTasks = useMemo(() => {
        return tasks.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.project.toLowerCase().includes(searchTerm.toLowerCase()) || item.assigned.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [tasks, searchTerm, selectedStatus]);

    const stats = useMemo(() => {
        const todo = tasks.filter(t => t.status === "To-Do").length;
        const progress = tasks.filter(t => t.status === "In Progress").length;
        const completed = tasks.filter(t => t.status === "Completed").length;
        return { todo, progress, completed };
    }, [tasks]);

    const handleSave = (e) => {
        e.preventDefault();
        if (!newTask.id || !newTask.title || !newTask.project || !newTask.assigned || !newTask.deadline) {
            alert("Please fill all mandatory fields.");
            return;
        }
        setTasks(prev => [...prev, newTask]);
        setShowModal(false);
        setNewTask({ id: "", title: "", project: "", assigned: "", deadline: "", status: "To-Do" });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const toggleStatus = (id) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const nextStatus = t.status === "To-Do" ? "In Progress" : t.status === "In Progress" ? "Completed" : "To-Do";
                return { ...t, status: nextStatus };
            }
            return t;
        }));
    };

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Task Management</h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Create, assign, list, and complete project milestones and deliverables.</p>
                </div>
                <button type="button" className="erp-btn-primary" onClick={() => setShowModal(true)}>
                    <FaPlus /> Add Task
                </button>
            </div>

            {/* KPI statistics cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>To-Do Tasks</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#ef4444" }}>{stats.todo}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Backlog queue</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>In Progress</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#d97706" }}>{stats.progress}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Active development</small>
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
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Status:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Tasks</option>
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Search:</span>
                    <input
                        type="text"
                        placeholder="Search title, project..."
                        className="erp-filter-select"
                        style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tasks Table */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th>Task ID</th>
                            <th>Title</th>
                            <th>Project</th>
                            <th>Assigned To</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.id}</strong></td>
                                    <td>{item.title}</td>
                                    <td>{item.project}</td>
                                    <td>{item.assigned}</td>
                                    <td>{item.deadline}</td>
                                    <td>
                                        <span
                                            className={`erp-badge ${
                                                item.status === "Completed" ? "success" :
                                                item.status === "In Progress" ? "warning" : "danger"
                                            }`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => toggleStatus(item.id)}
                                            title="Click to cycle status"
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="delete-icon-btn"
                                            onClick={() => handleDelete(item.id)}
                                            title="Delete Task"
                                        >
                                            <FaTrash />
                                        </button>
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
            </div>

            {/* Modal Dialog Form */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="erp-card modal-form-card">
                        <h2>Add New Task</h2>
                        <form onSubmit={handleSave} className="modal-grid-form">
                            <div className="erp-form-group">
                                <label>Task ID</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newTask.id}
                                    onChange={(e) => setNewTask({ ...newTask, id: e.target.value })}
                                    placeholder="TSK005"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Task Title</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="Implement JWT Verification"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Project Name</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newTask.project}
                                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                                    placeholder="ERP Suite"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Assigned Employee</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newTask.assigned}
                                    onChange={(e) => setNewTask({ ...newTask, assigned: e.target.value })}
                                    placeholder="Rahul Sharma"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Deadline Date</label>
                                <input
                                    type="date"
                                    className="erp-input"
                                    value={newTask.deadline}
                                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions-row">
                                <button type="button" className="erp-btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary">
                                    Add Task
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
