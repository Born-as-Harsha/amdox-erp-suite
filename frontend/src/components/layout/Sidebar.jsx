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
    FaChevronRight,
    FaUserClock,
    FaFileInvoiceDollar,
    FaCalendarTimes,
    FaTruck,
    FaTasks,
    FaChartLine
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

    // Helper to render dynamic NavLink
    const renderLink = (to, icon, label) => (
        <li>
            <NavLink
                to={to}
                className={({ isActive }) => (isActive ? "active-link" : "")}
            >
                {icon}
                <span>{label}</span>
            </NavLink>
        </li>
    );

    const isAdmin = role === "Super Admin" || role === "Admin";

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
                        {/* Dashboard is visible to all roles */}
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}

                        {/* Super Admin & Admin Menus */}
                        {isAdmin && (
                            <>
                                {renderLink("/employees", <FaUsers />, "Employees")}
                                {renderLink("/inventory", <FaBoxes />, "Inventory")}
                                {renderLink("/finance", <FaMoneyBillWave />, "Finance")}
                                {renderLink("/projects", <FaProjectDiagram />, "Projects")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                                {renderLink("/settings", <FaCog />, "Settings")}
                            </>
                        )}

                        {/* HR Menus */}
                        {role === "HR" && (
                            <>
                                {renderLink("/employees", <FaUsers />, "Employees")}
                                {renderLink("/payroll", <FaFileInvoiceDollar />, "Payroll")}
                                {renderLink("/attendance", <FaUserClock />, "Attendance")}
                                {renderLink("/leave", <FaCalendarTimes />, "Leave")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                            </>
                        )}

                        {/* Finance Menus */}
                        {role === "Finance" && (
                            <>
                                {renderLink("/finance", <FaMoneyBillWave />, "Finance")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                            </>
                        )}

                        {/* Inventory Manager Menus */}
                        {role === "Inventory Manager" && (
                            <>
                                {renderLink("/inventory", <FaBoxes />, "Inventory")}
                                {renderLink("/suppliers", <FaTruck />, "Suppliers")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                            </>
                        )}

                        {/* Project Manager Menus */}
                        {role === "Project Manager" && (
                            <>
                                {renderLink("/projects", <FaProjectDiagram />, "Projects")}
                                {renderLink("/tasks", <FaTasks />, "Tasks")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                            </>
                        )}

                        {/* Executive Menus */}
                        {role === "Executive" && (
                            <>
                                {renderLink("/analytics", <FaChartLine />, "Analytics")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
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