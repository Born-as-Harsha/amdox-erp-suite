import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import Inventory from "./pages/Inventory/Inventory";
import Finance from "./pages/Finance/Finance";
import Projects from "./pages/Projects/Projects";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/employees" element={<Employees />} />

                <Route path="/inventory" element={<Inventory />} />

                <Route path="/finance" element={<Finance />} />

                <Route path="/projects" element={<Projects />} />

                <Route path="/reports" element={<Reports />} />

                <Route path="/settings" element={<Settings />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;