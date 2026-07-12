import "./Projects.css";
import { useEffect, useState, useMemo } from "react";
import {
    getProjects,
    addProject,
    updateProject,
    deleteProject as deleteProjectApi,
    getProjectStats
} from "../../api/projectApi";
import { useSearch } from "../../context/SearchContext";
import { FaPlus, FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaSpinner, FaCalendar, FaUser, FaMoneyBillWave } from "react-icons/fa";

function Projects() {
    const initialFormData = {
        projectId: "",
        projectName: "",
        client: "",
        manager: "",
        budget: "",
        status: "Planning",
        deadline: ""
    };

    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        planning: 0,
        inProgress: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [saving, setSaving] = useState(false);

    // Filtering, sorting and paging state
    const { searchTerm } = useSearch();
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedManager, setSelectedManager] = useState("All");
    const [sortBy, setSortBy] = useState("projectName");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        loadProjectsData();
    }, []);

    // Reset pagination on filter update
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectedManager]);

    async function loadProjectsData() {
        setLoading(true);
        try {
            const [projRes, statsRes] = await Promise.all([
                getProjects(),
                getProjectStats()
            ]);
            setProjects(Array.isArray(projRes?.data) ? projRes.data : []);
            setStats(statsRes?.data || { totalProjects: 0, planning: 0, inProgress: 0, completed: 0 });
        } catch (error) {
            console.error("Load projects error", error);
        } finally {
            setLoading(false);
        }
    }

    const openAddModal = () => {
        setFormData(initialFormData);
        setEditingId(null);
        setShowModal(true);
    };

    const handleEdit = (project) => {
        setEditingId(project._id);
        setFormData({
            projectId: project.projectId || "",
            projectName: project.projectName || "",
            client: project.client || "",
            manager: project.manager || "",
            budget: project.budget || "",
            status: project.status || "Planning",
            deadline: project.deadline ? project.deadline.substring(0, 10) : ""
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        try {
            await deleteProjectApi(id);
            await loadProjectsData();
        } catch (error) {
            console.error(error);
            alert("Failed to delete project.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (
            !formData.projectId.trim() ||
            !formData.projectName.trim() ||
            !formData.client.trim() ||
            !formData.manager.trim() ||
            formData.budget === "" ||
            !formData.deadline
        ) {
            alert("Please fill all mandatory fields.");
            return;
        }

        setSaving(true);
        const payload = {
            projectId: formData.projectId.trim(),
            projectName: formData.projectName.trim(),
            client: formData.client.trim(),
            manager: formData.manager.trim(),
            budget: Number(formData.budget),
            status: formData.status,
            deadline: formData.deadline
        };

        try {
            if (editingId) {
                await updateProject(editingId, payload);
            } else {
                await addProject(payload);
            }
            await loadProjectsData();
            setShowModal(false);
            setFormData(initialFormData);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to save project.");
        } finally {
            setSaving(false);
        }
    };

    // Unique managers list
    const managerOptions = useMemo(() => {
        const managers = new Set(projects.map(p => p.manager).filter(Boolean));
        return ["All", ...Array.from(managers)];
    }, [projects]);

    // Status based progress calculator
    const getProgressValue = (status) => {
        if (status === "Planning") return 15;
        if (status === "In Progress") return 65;
        if (status === "Completed") return 100;
        return 0;
    };

    // Sorting trigger
    const triggerSort = (column) => {
        if (sortBy === column) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    // Search, Filter, Sort processing
    const filteredProjects = useMemo(() => {
        let result = [...projects];

        // 1. Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (p) =>
                    (p.projectName || "").toLowerCase().includes(term) ||
                    (p.projectId || "").toLowerCase().includes(term) ||
                    (p.client || "").toLowerCase().includes(term) ||
                    (p.manager || "").toLowerCase().includes(term)
            );
        }

        // 2. Status Filter
        if (selectedStatus && selectedStatus !== "All") {
            result = result.filter(p => p.status === selectedStatus);
        }

        // 3. Manager Filter
        if (selectedManager && selectedManager !== "All") {
            result = result.filter(p => p.manager === selectedManager);
        }

        // 4. Sort
        if (sortBy) {
            result.sort((a, b) => {
                let valA = a[sortBy];
                let valB = b[sortBy];

                if (sortBy === "deadline") {
                    valA = new Date(valA).getTime();
                    valB = new Date(valB).getTime();
                } else if (typeof valA === "string") {
                    valA = valA.toLowerCase();
                    valB = (valB || "").toLowerCase();
                }

                if (valA < valB) return sortDirection === "asc" ? -1 : 1;
                if (valA > valB) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [projects, searchTerm, selectedStatus, selectedManager, sortBy, sortDirection]);

    // Paginate subset
    const paginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProjects, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;

    if (loading) {
        return (
            <div className="projects-loading-view">
                <FaSpinner className="spinner" />
                <h2>Loading Enterprise Projects...</h2>
            </div>
        );
    }

    return (
        <div className="projects-view-container">
            <div className="projects-header-row">
                <div>
                    <h1>Projects Management</h1>
                    <p>Orchestrate client deliverables, budget allocations, schedules, and manager tasks.</p>
                </div>
                <button type="button" className="erp-btn-primary" onClick={openAddModal}>
                    <FaPlus /> Add Project
                </button>
            </div>

            {/* KPI Cards section */}
            <div className="projects-stats-grid">
                <div className="erp-card proj-stat-card">
                    <h3>Total Projects</h3>
                    <h2>{stats.totalProjects}</h2>
                    <small>System campaigns</small>
                </div>
                <div className="erp-card proj-stat-card">
                    <h3>Planning</h3>
                    <h2>{stats.planning}</h2>
                    <small>Scope phase</small>
                </div>
                <div className="erp-card proj-stat-card">
                    <h3>In Progress</h3>
                    <h2>{stats.inProgress}</h2>
                    <small>Development phase</small>
                </div>
                <div className="erp-card proj-stat-card">
                    <h3>Completed</h3>
                    <h2>{stats.completed}</h2>
                    <small>Archived successes</small>
                </div>
            </div>

            {/* Filters and Sorting control bar */}
            <div className="erp-filters-bar">
                <div className="filter-group">
                    <span className="filter-label">Status:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Manager:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedManager}
                        onChange={(e) => setSelectedManager(e.target.value)}
                    >
                        {managerOptions.map((mgr) => (
                            <option key={mgr} value={mgr}>{mgr}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Sort By:</span>
                    <select
                        className="erp-filter-select"
                        value={sortBy}
                        onChange={(e) => triggerSort(e.target.value)}
                    >
                        <option value="projectName">Project Name</option>
                        <option value="budget">Budget Valuation</option>
                        <option value="deadline">Deadline Schedule</option>
                    </select>
                </div>
                
                <button
                    type="button"
                    className="sort-direction-btn"
                    onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                >
                    Order: {sortDirection.toUpperCase()}
                </button>
            </div>

            {/* Project Cards Grid Layout */}
            <div className="projects-grid-layout">
                {paginatedProjects.length > 0 ? (
                    paginatedProjects.map((proj) => (
                        <div key={proj._id} className="erp-card project-display-card">
                            <div className="project-card-header">
                                <span className="project-id-tag">{proj.projectId}</span>
                                <span className={`erp-badge ${proj.status.toLowerCase().replace(" ", "-")}`}>
                                    {proj.status}
                                </span>
                            </div>

                            <h2>{proj.projectName}</h2>
                            <p className="project-client-name">Client: <strong>{proj.client}</strong></p>

                            {/* Progress bar visual */}
                            <div className="project-progress-block">
                                <div className="progress-bar-label">
                                    <span>Milestones Progress</span>
                                    <span>{getProgressValue(proj.status)}%</span>
                                </div>
                                <div className="progress-bar-track">
                                    <div
                                        className={`progress-bar-fill ${proj.status.toLowerCase().replace(" ", "-")}`}
                                        style={{ width: `${getProgressValue(proj.status)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="project-card-meta">
                                <div className="meta-item">
                                    <FaUser />
                                    <span>{proj.manager}</span>
                                </div>
                                <div className="meta-item">
                                    <FaCalendar />
                                    <span>{new Date(proj.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="project-card-footer">
                                <div className="project-budget-val">
                                    <FaMoneyBillWave />
                                    <span>₹{Number(proj.budget).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="project-card-actions">
                                    <button
                                        type="button"
                                        className="edit-icon-btn"
                                        onClick={() => handleEdit(proj)}
                                        title="Edit Project"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-icon-btn"
                                        onClick={() => handleDelete(proj._id)}
                                        title="Delete Project"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="erp-card no-projects-card">
                        <h3>No projects matched the search filters.</h3>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="erp-pagination">
                <span className="erp-pagination-info">
                    Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredProjects.length} total projects)
                </span>
                <div className="erp-pagination-buttons">
                    <button
                        type="button"
                        className="erp-pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        className="erp-pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal Dialog Form */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="erp-card modal-form-card">
                        <h2>{editingId ? "Modify Campaign Details" : "Initiate Corporate Project"}</h2>
                        <form onSubmit={handleSave} className="modal-grid-form">
                            <div className="erp-form-group">
                                <label>Project Code / ID</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    disabled={Boolean(editingId)}
                                    placeholder="PRJ309"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Project Name</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    placeholder="E-Commerce Integration"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Client Organization</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    placeholder="Acme Corp"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Project Manager</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.manager}
                                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                    placeholder="Vikram Singh"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Budget Allocation (INR)</label>
                                <input
                                    type="number"
                                    className="erp-input"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    placeholder="450000"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Deadline Date</label>
                                <input
                                    type="date"
                                    className="erp-input"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>

                            <div className="erp-form-group-full">
                                <label>Milestone Phase</label>
                                <select
                                    className="erp-input"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Planning">Planning</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="modal-actions-row">
                                <button type="button" className="erp-btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary" disabled={saving}>
                                    {saving ? "Saving..." : editingId ? "Save Project" : "Add Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projects;