import { useEffect, useState, useMemo } from "react";
import "./Employees.css";
import {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee as deleteEmployeeApi,
    getEmployeeStats
} from "../../api/employeeApi";
import { useSearch } from "../../context/SearchContext";
import { FaPlus, FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash } from "react-icons/fa";

function Employees() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        leaveEmployees: 0,
        departments: 0
    });
    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        id: "",
        mongoId: "",
        name: "",
        department: "",
        designation: "",
        email: "",
        phone: "",
        status: "Active"
    });

    // Filtering, sorting and paging state
    const { searchTerm } = useSearch();
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        loadEmployees();
        loadStats();
    }, []);

    // Reset back to page 1 on search/filter update
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDepartment, selectedStatus]);

    async function loadStats() {
        try {
            const response = await getEmployeeStats();
            setStats(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadEmployees() {
        try {
            const response = await getEmployees();
            const formattedEmployees = response.data.map((employee) => ({
                id: employee.employeeId,
                mongoId: employee._id,
                name: employee.name,
                department: employee.department,
                designation: employee.designation,
                email: employee.email,
                phone: employee.phone,
                status: employee.status
            }));
            setEmployees(formattedEmployees);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteEmployee(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );
        if (!confirmDelete) return;

        try {
            await deleteEmployeeApi(id);
            await loadEmployees();
            await loadStats();
        } catch (error) {
            console.error(error);
            alert("Unable to delete employee.");
        }
    }

    async function handleSaveEmployee(e) {
        e.preventDefault();

        if (
            !newEmployee.id ||
            !newEmployee.name ||
            !newEmployee.department ||
            !newEmployee.designation ||
            !newEmployee.email ||
            !newEmployee.phone
        ) {
            alert("Please fill all fields before saving.");
            return;
        }

        try {
            if (isEditing) {
                await updateEmployee(editingId, {
                    employeeId: newEmployee.id,
                    name: newEmployee.name,
                    department: newEmployee.department,
                    designation: newEmployee.designation,
                    email: newEmployee.email,
                    phone: newEmployee.phone,
                    status: newEmployee.status
                });
            } else {
                await addEmployee({
                    employeeId: newEmployee.id,
                    name: newEmployee.name,
                    department: newEmployee.department,
                    designation: newEmployee.designation,
                    email: newEmployee.email,
                    phone: newEmployee.phone,
                    status: newEmployee.status
                });
            }

            await loadEmployees();
            await loadStats();

            setNewEmployee({
                id: "",
                mongoId: "",
                name: "",
                department: "",
                designation: "",
                email: "",
                phone: "",
                status: "Active"
            });

            setShowForm(false);
            setIsEditing(false);
            setEditingId("");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message);
        }
    }

    function handleEditEmployee(employee) {
        setIsEditing(true);
        setEditingId(employee.mongoId);
        setNewEmployee({ ...employee });
        setShowForm(true);
    }

    function handleAddEmployeeClick() {
        setIsEditing(false);
        setEditingId("");
        setNewEmployee({
            id: "",
            mongoId: "",
            name: "",
            department: "",
            designation: "",
            email: "",
            phone: "",
            status: "Active"
        });
        setShowForm(true);
    }

    function handleCancel() {
        setShowForm(false);
        setIsEditing(false);
        setEditingId("");
    }

    // Dynamic lists for filters
    const departmentOptions = useMemo(() => {
        const departments = new Set(employees.map(emp => emp.department).filter(Boolean));
        return ["All", ...Array.from(departments)];
    }, [employees]);

    // Sorting trigger helper
    const triggerSort = (column) => {
        if (sortBy === column) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    // Render sort icon state
    const renderSortIcon = (column) => {
        if (sortBy !== column) return <FaSort className="sort-icon-muted" />;
        return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    };

    // Filter, sort and page processing
    const filteredEmployees = useMemo(() => {
        let result = [...employees];

        // 1. Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (emp) =>
                    (emp.name || "").toLowerCase().includes(term) ||
                    (emp.id || "").toLowerCase().includes(term) ||
                    (emp.department || "").toLowerCase().includes(term) ||
                    (emp.designation || "").toLowerCase().includes(term)
            );
        }

        // 2. Department Filter
        if (selectedDepartment && selectedDepartment !== "All") {
            result = result.filter((emp) => emp.department === selectedDepartment);
        }

        // 3. Status Filter
        if (selectedStatus && selectedStatus !== "All") {
            result = result.filter((emp) => emp.status === selectedStatus);
        }

        // 4. Sort
        if (sortBy) {
            result.sort((a, b) => {
                const valA = (a[sortBy] || "").toString().toLowerCase();
                const valB = (b[sortBy] || "").toString().toLowerCase();
                if (valA < valB) return sortDirection === "asc" ? -1 : 1;
                if (valA > valB) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [employees, searchTerm, selectedDepartment, selectedStatus, sortBy, sortDirection]);

    // Paginate subset
    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredEmployees, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;

    return (
        <div className="employees-view-container">
            <div className="employees-header-row">
                <div>
                    <h1>Employees Management</h1>
                    <p>Onboard, modify, list, and categorize organizational personnel resource logs.</p>
                </div>
                <button type="button" className="erp-btn-primary" onClick={handleAddEmployeeClick}>
                    <FaPlus /> Add Employee
                </button>
            </div>

            {/* KPI Cards section */}
            <div className="employees-stats-grid">
                <div className="erp-card emp-stat-card">
                    <h3>Total Employees</h3>
                    <h2>{stats.totalEmployees}</h2>
                    <small>System headcount</small>
                </div>
                <div className="erp-card emp-stat-card">
                    <h3>Departments</h3>
                    <h2>{stats.departments}</h2>
                    <small>Active units</small>
                </div>
                <div className="erp-card emp-stat-card">
                    <h3>Active Employees</h3>
                    <h2>{stats.activeEmployees}</h2>
                    <small>Operational</small>
                </div>
                <div className="erp-card emp-stat-card">
                    <h3>On Leave</h3>
                    <h2>{stats.leaveEmployees}</h2>
                    <small>Temporarily out</small>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="erp-filters-bar">
                <div className="filter-group">
                    <span className="filter-label">Department:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        {departmentOptions.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Status:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Leave">Leave</option>
                    </select>
                </div>
            </div>

            {/* Main Table section */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("id")}>
                                ID {renderSortIcon("id")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("name")}>
                                Name {renderSortIcon("name")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("department")}>
                                Department {renderSortIcon("department")}
                            </th>
                            <th>Designation</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployees.length > 0 ? (
                            paginatedEmployees.map((emp) => (
                                <tr key={emp.mongoId}>
                                    <td><strong>{emp.id}</strong></td>
                                    <td>{emp.name}</td>
                                    <td>{emp.department}</td>
                                    <td>{emp.designation}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.phone}</td>
                                    <td>
                                        <span className={`erp-badge ${emp.status.toLowerCase()}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="edit-icon-btn"
                                            onClick={() => handleEditEmployee(emp)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-icon-btn"
                                            onClick={() => handleDeleteEmployee(emp.mongoId)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No matching employees found in directory.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Table Paginator */}
                <div className="erp-pagination">
                    <span className="erp-pagination-info">
                        Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredEmployees.length} total staff)
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
            </div>

            {/* Modal Form Dialog */}
            {showForm && (
                <div className="modal-backdrop">
                    <div className="erp-card modal-form-card">
                        <h2>{isEditing ? "Modify Personnel Record" : "Onboard New Employee"}</h2>
                        <form onSubmit={handleSaveEmployee} className="modal-grid-form">
                            <div className="erp-form-group">
                                <label>Employee ID</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newEmployee.id}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                                    disabled={isEditing}
                                    placeholder="EMP101"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newEmployee.department}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                                    placeholder="Engineering"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Designation</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newEmployee.designation}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
                                    placeholder="Senior Software Architect"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="erp-input"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    placeholder="john.doe@company.com"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newEmployee.phone}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Corporate Status</label>
                                <select
                                    className="erp-input"
                                    value={newEmployee.status}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Leave">On Leave</option>
                                </select>
                            </div>

                            <div className="modal-actions-row">
                                <button type="button" className="erp-btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary">
                                    {isEditing ? "Save Adjustments" : "Onboard Staff"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Employees;