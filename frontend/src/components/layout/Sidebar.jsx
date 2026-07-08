import "./Layout.css";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    FaTachometerAlt,
    FaUsers,
    FaBoxes,
    FaProjectDiagram,
    FaChartBar,
    FaCog,
    FaMoneyBillWave,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.role;

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        toast.success("Logged out successfully");

        navigate("/", { replace: true });

    };

    return (

        <aside className="sidebar">

            <div className="sidebar-header">

                <h2>ERP Menu</h2>

            </div>

            <nav>

                <ul>

                    <li>

                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive ? "active-link" : ""
                            }
                        >
                            <FaTachometerAlt />
                            <span>Dashboard</span>
                        </NavLink>

                    </li>

                    {(role === "Admin" || role === "HR") && (

                        <li>

                            <NavLink
                                to="/employees"
                                className={({ isActive }) =>
                                    isActive ? "active-link" : ""
                                }
                            >
                                <FaUsers />
                                <span>Employees</span>
                            </NavLink>

                        </li>

                    )}

                    {role === "Admin" && (

                        <>

                            <li>

                                <NavLink
                                    to="/inventory"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : ""
                                    }
                                >
                                    <FaBoxes />
                                    <span>Inventory</span>
                                </NavLink>

                            </li>

                            <li>

                                <NavLink
                                    to="/finance"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : ""
                                    }
                                >
                                    <FaMoneyBillWave />
                                    <span>Finance</span>
                                </NavLink>

                            </li>

                            <li>

                                <NavLink
                                    to="/projects"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : ""
                                    }
                                >
                                    <FaProjectDiagram />
                                    <span>Projects</span>
                                </NavLink>

                            </li>

                            <li>

                                <NavLink
                                    to="/reports"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : ""
                                    }
                                >
                                    <FaChartBar />
                                    <span>Reports</span>
                                </NavLink>

                            </li>

                            <li>

                                <NavLink
                                    to="/settings"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : ""
                                    }
                                >
                                    <FaCog />
                                    <span>Settings</span>
                                </NavLink>

                            </li>

                        </>

                    )}

                </ul>

            </nav>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >

                <FaSignOutAlt />

                Logout

            </button>

        </aside>

    );

}

export default Sidebar;