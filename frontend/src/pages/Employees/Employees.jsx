import { useState } from "react";
import "./Employees.css";

function Employees() {
    const [employees, setEmployees] = useState([
        {
            id: "EMP001",
            name: "Rahul Sharma",
            department: "Human Resources",
            designation: "HR Manager",
            email: "rahul@erp.com",
            phone: "9876543210",
            status: "Active"
        },
        {
            id: "EMP002",
            name: "Priya Reddy",
            department: "Finance",
            designation: "Accountant",
            email: "priya@erp.com",
            phone: "9876543211",
            status: "Active"
        },
        {
            id: "EMP003",
            name: "Arjun Kumar",
            department: "Inventory",
            designation: "Store Manager",
            email: "arjun@erp.com",
            phone: "9876543212",
            status: "Leave"
        }
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        id: "",
        name: "",
        department: "",
        designation: "",
        email: "",
        phone: "",
        status: "Active"
    });

    function deleteEmployee(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        const updatedEmployees = employees.filter(
            (employee) => employee.id !== id
        );
        setEmployees(updatedEmployees);
    }

    function handleSaveEmployee(e) {
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

        if (isEditing) {
            const updatedEmployees = employees.map((employee) =>
                employee.id === editingId ? newEmployee : employee
            );
            setEmployees(updatedEmployees);
            setIsEditing(false);
            setEditingId("");
        } else {
            const employeeExists = employees.some(
                (employee) => employee.id === newEmployee.id
            );

            if (employeeExists) {
                alert("Employee ID already exists.");
                return;
            }

            setEmployees([...employees, newEmployee]);
        }

        setNewEmployee({
            id: "",
            name: "",
            department: "",
            designation: "",
            email: "",
            phone: "",
            status: "Active"
        });
        setShowForm(false);
    }

    function handleEditEmployee(employee) {
        setIsEditing(true);
        setEditingId(employee.id);
        setNewEmployee({ ...employee });
        setShowForm(true);
    }

    function handleAddEmployeeClick() {
        setIsEditing(false);
        setEditingId("");
        setNewEmployee({
            id: "",
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
                            <tr key={employee.id}>
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
                                            deleteEmployee(employee.id)
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