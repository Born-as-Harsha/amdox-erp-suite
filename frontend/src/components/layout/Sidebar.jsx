import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            <h2>ERP Menu</h2>

            <ul>

                <li><Link to="/dashboard">Dashboard</Link></li>

                <li><Link to="/employees">Employees</Link></li>

                <li><Link to="/inventory">Inventory</Link></li>

                <li><Link to="/finance">Finance</Link></li>

                <li><Link to="/projects">Projects</Link></li>

                <li><Link to="/reports">Reports</Link></li>

                <li><Link to="/settings">Settings</Link></li>

                <li><Link to="/">Logout</Link></li>

            </ul>

        </aside>
    );
}

export default Sidebar;