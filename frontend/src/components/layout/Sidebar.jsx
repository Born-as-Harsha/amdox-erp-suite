import "./Layout.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUsers,
    FaBoxes,
    FaMoneyBillWave,
    FaProjectDiagram,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

function Sidebar({ isCollapsed, toggleCollapse }) {

    const navigate = useNavigate();

    let role = "";

    try {

        const storedUser =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user");

        if (storedUser) {

            const user = JSON.parse(storedUser);
            role = user?.role || "";

        }

    } catch (error) {

        console.error(error);

    }

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/");

    };

    return (

        <aside className="sidebar">

            <div>

                <div className="sidebar-header">

                    {!isCollapsed && <h2>ERP Menu</h2>}

                    <button
                        type="button"
                        className="collapse-toggle-btn"
                        onClick={toggleCollapse}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>

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

            </div>

            <button
                className="logout-btn"
                onClick={logout}
            >

                <FaSignOutAlt />

                <span>Logout</span>

            </button>

        </aside>

    );

}

export default Sidebar;