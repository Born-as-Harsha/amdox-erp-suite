import "./Layout.css";
import { NavLink, useNavigate } from "react-router-dom";
import { logout as apiLogout } from "../../services/authService";
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

    const logout = async () => {
        try {
            const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                await apiLogout(user.email);
            }
        } catch (e) {
            console.error("Logout API error", e);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("rememberMeToken");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            navigate("/");
        }
    };

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

    const isSuperAdmin = role === "Super Admin";
    const isAdmin = role === "Admin" || isSuperAdmin;
    const isHR = role === "HR Manager" || role === "HR Executive" || role === "HR";
    const isFinance = role === "Finance Manager" || role === "Accountant" || role === "Finance";
    const isInventory = role === "Inventory Manager" || role === "Store Keeper";
    const isProject = role === "Project Manager" || role === "Project Lead";
    const isExecutive = role === "Executive";
    const isEmployee = role === "Employee";
    const isViewer = role === "Viewer";

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

                        {/* Super Admin User Management */}
                        {isSuperAdmin && renderLink("/users", <FaUsers />, "User Management")}

                        {/* General Admin Access */}
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

                        {/* HR Roles */}
                        {isHR && (
                            <>
                                {renderLink("/employees", <FaUsers />, "Employees")}
                                {role === "HR Manager" && (
                                    <>
                                        {renderLink("/payroll", <FaFileInvoiceDollar />, "Payroll")}
                                        {renderLink("/attendance", <FaUserClock />, "Attendance")}
                                        {renderLink("/leave", <FaCalendarTimes />, "Leave")}
                                    </>
                                )}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                                {renderLink("/settings", <FaCog />, "Settings")}
                            </>
                        )}

                        {/* Finance Roles */}
                        {isFinance && (
                            <>
                                {renderLink("/finance", <FaMoneyBillWave />, "Finance")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                                {renderLink("/settings", <FaCog />, "Settings")}
                            </>
                        )}

                        {/* Inventory Roles */}
                        {isInventory && (
                            <>
                                {renderLink("/inventory", <FaBoxes />, "Inventory")}
                                {role === "Inventory Manager" && renderLink("/suppliers", <FaTruck />, "Suppliers")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                                {renderLink("/settings", <FaCog />, "Settings")}
                            </>
                        )}

                        {/* Projects Roles */}
                        {isProject && (
                            <>
                                {renderLink("/projects", <FaProjectDiagram />, "Projects")}
                                {role === "Project Manager" && renderLink("/tasks", <FaTasks />, "Tasks")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                                {renderLink("/settings", <FaCog />, "Settings")}
                            </>
                        )}

                        {/* Executive Roles */}
                        {isExecutive && (
                            <>
                                {renderLink("/analytics", <FaChartLine />, "Analytics")}
                                {renderLink("/reports", <FaChartBar />, "Reports")}
                                {renderLink("/settings", <FaCog />, "Settings")}
                            </>
                        )}

                        {/* Employee & Viewer Standard Links */}
                        {(isEmployee || isViewer) && (
                            <>
                                {renderLink("/settings", <FaCog />, "Settings")}
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