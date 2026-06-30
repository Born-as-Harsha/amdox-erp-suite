import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.role;

    function handleLogout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Logged out successfully");

        navigate("/");

    }

    return (

        <div className="sidebar">

            <h2>ERP Menu</h2>

            <ul>

                <li>
                    <NavLink to="/dashboard">
                        Dashboard
                    </NavLink>
                </li>

                {(role === "Admin" || role === "HR") && (

                    <li>
                        <NavLink to="/employees">
                            Employees
                        </NavLink>
                    </li>

                )}

                {role === "Admin" && (

                    <>
                        <li>
                            <NavLink to="/inventory">
                                Inventory
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/finance">
                                Finance
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/projects">
                                Projects
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/reports">
                                Reports
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/settings">
                                Settings
                            </NavLink>
                        </li>
                    </>

                )}

                <li>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#0d6efd",
                            cursor: "pointer",
                            fontSize: "16px",
                            padding: "0"
                        }}
                    >
                        Logout
                    </button>

                </li>

            </ul>

        </div>

    );

}

export default Sidebar;