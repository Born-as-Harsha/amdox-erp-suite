import "./Employees.css";

function Employees() {

    const employees = [

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

    ];

    return (

        <div className="employees">

            <div className="employees-header">

                <h1>Employees Management</h1>

                <button>Add Employee</button>

            </div>

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search Employee..."
                />

            </div>

            <div className="employee-stats">

                <div className="stat-card">
                    <h3>Total Employees</h3>
                    <p>125</p>
                </div>

                <div className="stat-card">
                    <h3>Departments</h3>
                    <p>8</p>
                </div>

                <div className="stat-card">
                    <h3>Active Employees</h3>
                    <p>118</p>
                </div>

                <div className="stat-card">
                    <h3>On Leave</h3>
                    <p>7</p>
                </div>

            </div>

            <h2 className="table-title">
                Employee List
            </h2>

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

                    {employees.map((employee) => (

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

                                <button className="edit-btn">
                                    Edit
                                </button>

                                <button className="delete-btn">
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Employees;