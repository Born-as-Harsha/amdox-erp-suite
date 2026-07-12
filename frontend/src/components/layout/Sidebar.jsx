import "./Layout.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
    FaChartLine,
    FaHistory,
    FaUserTie
} from "react-icons/fa";

function Sidebar({ isCollapsed, toggleCollapse }) {
    const navigate = useNavigate();
    const { user, logoutUserContext } = useAuth();
    const role = user?.role || "";

    const logout = async () => {
        try {
            if (user?.email) {
                await apiLogout(user.email);
            }
        } catch (e) {
            console.error("Logout API error", e);
        } finally {
            logoutUserContext();
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

    // Dynamic sidebar menus matching specification strictly
    const renderRoleLinks = () => {
        switch (role) {
            case "Super Admin":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/users", <FaUsers />, "User Management")}
                        {renderLink("/employees", <FaUsers />, "Employees")}
                        {renderLink("/finance", <FaMoneyBillWave />, "Finance")}
                        {renderLink("/inventory", <FaBoxes />, "Inventory")}
                        {renderLink("/projects", <FaProjectDiagram />, "Projects")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                        {renderLink("/audit-logs", <FaHistory />, "Audit Logs")}
                        {renderLink("/system-config", <FaCog />, "System Config")}
                        {renderLink("/analytics", <FaChartLine />, "Analytics")}
                    </>
                );
            case "Admin":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/employees", <FaUsers />, "Employees")}
                        {renderLink("/finance", <FaMoneyBillWave />, "Finance")}
                        {renderLink("/inventory", <FaBoxes />, "Inventory")}
                        {renderLink("/projects", <FaProjectDiagram />, "Projects")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "HR Manager":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/employees", <FaUsers />, "Employees")}
                        {renderLink("/attendance", <FaUserClock />, "Attendance")}
                        {renderLink("/leave", <FaCalendarTimes />, "Leave")}
                        {renderLink("/recruitment", <FaUserTie />, "Recruitment")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "HR Executive":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/employees", <FaUsers />, "Employees")}
                        {renderLink("/attendance", <FaUserClock />, "Attendance")}
                        {renderLink("/leave", <FaCalendarTimes />, "Leave")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Finance Manager":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/finance", <FaMoneyBillWave />, "Finance")}
                        {renderLink("/invoices", <FaFileInvoiceDollar />, "Invoices")}
                        {renderLink("/payroll", <FaFileInvoiceDollar />, "Payroll")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Accountant":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/finance", <FaMoneyBillWave />, "Finance")}
                        {renderLink("/invoices", <FaFileInvoiceDollar />, "Invoices")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Inventory Manager":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/inventory", <FaBoxes />, "Inventory")}
                        {renderLink("/suppliers", <FaTruck />, "Suppliers")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Store Keeper":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/inventory", <FaBoxes />, "Inventory")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Project Manager":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/projects", <FaProjectDiagram />, "Projects")}
                        {renderLink("/teams", <FaUsers />, "Teams")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Project Lead":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/projects", <FaProjectDiagram />, "Projects")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Employee":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/tasks", <FaTasks />, "My Tasks")}
                        {renderLink("/leave", <FaCalendarTimes />, "Leave")}
                        {renderLink("/attendance", <FaUserClock />, "Attendance")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Executive":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/analytics", <FaChartLine />, "Analytics")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            case "Viewer":
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/reports", <FaChartBar />, "Reports")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
            default:
                return (
                    <>
                        {renderLink("/dashboard", <FaTachometerAlt />, "Dashboard")}
                        {renderLink("/settings", <FaCog />, "Settings")}
                    </>
                );
        }
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
                        {renderRoleLinks()}
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