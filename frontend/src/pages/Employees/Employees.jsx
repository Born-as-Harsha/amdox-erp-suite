import { useEffect, useState } from "react";
import "./Employees.css";
import {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee as deleteEmployeeApi
} from "../../api/employeeApi";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [search, setSearch] = useState("");
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

    useEffect(() => {
        loadEmployees();
    }, []);

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

    async function handleDeleteEmployee(employee) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteEmployeeApi(employee.mongoId);
            await loadEmployees();
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
            alert("Unable to save employee.");
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
        setShowForm(false);
    }

    const filteredEmployees = employees.filter(
        (employee) =>
            employee.name.toLowerCase().includes(search.toLowerCase()) ||
            employee.department.toLowerCase().includes(search.toLowerCase()) ||
            employee.designation.toLowerCase().includes(search.toLowerCase())
    );

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
        (employee) => employee.status === "Active"
    ).length;
    const leaveEmployees = employees.filter(
        (employee) => employee.status === "Leave"
    ).length;
    const departments = new Set(
        employees.map((employee) => employee.department)
    ).size;

    return (
        <div className="employees">
            <div className="employees-header">
                <h1>Employees Management</h1>
                <button onClick={handleAddEmployeeClick}>Add Employee</button>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search Employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="employee-stats">
                <div className="stat-card">
                    <h3>Total Employees</h3>
                    <p>{totalEmployees}</p>
                </div>
                <div className="stat-card">
                    <h3>Departments</h3>
                    <p>{departments}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Employees</h3>
                    <p>{activeEmployees}</p>
                </div>
                <div className="stat-card">
                    <h3>On Leave</h3>
                    <p>{leaveEmployees}</p>
                </div>
            </div>

            <h2 className="table-title">Employee List</h2>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                            <tr key={employee.mongoId}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.department}</td>
                                <td>{employee.designation}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone}</td>
                                <td>
                                    <span
                                        className={
                                            employee.status === "Active"
                                                ? "status active"
                                                : "status leave"
                                        }
                                    >
                                        {employee.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEditEmployee(employee)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDeleteEmployee(employee)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="8"
                                style={{
                                    textAlign: "center",
                                    padding: "20px"
                                }}
                            >
                                No employee found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showForm && (
                <div className="employee-form">
                    <h2>{isEditing ? "Edit Employee" : "Add New Employee"}</h2>

                    <form onSubmit={handleSaveEmployee}>
                        <div className="form-group">
                            <label>ID</label>
                            <input
                                type="text"
                                value={newEmployee.id}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        id: e.target.value
                                    })
                                }
                                disabled={isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={newEmployee.name}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        name: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={newEmployee.department}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        department: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Designation</label>
                            <input
                                type="text"
                                value={newEmployee.designation}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        designation: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={newEmployee.email}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        email: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                value={newEmployee.phone}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        phone: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={newEmployee.status}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        status: e.target.value
                                    })
                                }
                            >
                                <option value="Active">Active</option>
                                <option value="Leave">Leave</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit">
                                {isEditing ? "Update Employee" : "Save Employee"}
                            </button>
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Employees;