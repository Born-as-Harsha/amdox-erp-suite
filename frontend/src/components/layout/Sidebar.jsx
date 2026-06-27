import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            <h2>ERP Menu</h2>

            <ul>

                <li><NavLink to="/dashboard">Dashboard</NavLink></li>

                <li><NavLink to="/employees">Employees</NavLink></li>

                <li><NavLink to="/inventory">Inventory</NavLink></li>

                <li><NavLink to="/finance">Finance</NavLink></li>

                <li><NavLink to="/projects">Projects</NavLink></li>

                <li><NavLink to="/reports">Reports</NavLink></li>

                <li><NavLink to="/settings">Settings</NavLink></li>

                <li><NavLink to="/">Logout</NavLink></li>

            </ul>

        </aside>
    );
}

export default Sidebar;