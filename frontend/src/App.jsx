import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import Payroll from "./pages/HR/Payroll";
import Attendance from "./pages/HR/Attendance";
import Leave from "./pages/HR/Leave";
import Inventory from "./pages/Inventory/Inventory";
import Suppliers from "./pages/Inventory/Suppliers";
import Finance from "./pages/Finance/Finance";
import Projects from "./pages/Projects/Projects";
import Tasks from "./pages/Projects/Tasks";
import Analytics from "./pages/Executive/Analytics";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import UserManagement from "./pages/Admin/UserManagement";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { SearchProvider } from "./context/SearchContext";

function App() {
    const allRoles = ["Super Admin", "Admin", "HR", "Finance Manager", "Inventory Manager", "Project Manager", "Executive"];

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Login />}
                />
                
                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    element={
                        <ProtectedRoute>
                            <SearchProvider>
                                <AppLayout />
                            </SearchProvider>
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/employees"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "HR"]}>
                                <Employees />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/payroll"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "HR"]}>
                                <Payroll />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/attendance"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "HR"]}>
                                <Attendance />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/leave"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "HR"]}>
                                <Leave />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/inventory"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "Inventory Manager"]}>
                                <Inventory />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/suppliers"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "Inventory Manager"]}>
                                <Suppliers />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/finance"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "Finance Manager", "Finance"]}>
                                <Finance />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/projects"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "Project Manager"]}>
                                <Projects />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/tasks"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "Project Manager"]}>
                                <Tasks />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/analytics"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin", "Admin", "Executive"]}>
                                <Analytics />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <RoleProtectedRoute allowedRoles={allRoles}>
                                <Reports />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <RoleProtectedRoute allowedRoles={allRoles}>
                                <Settings />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <RoleProtectedRoute allowedRoles={["Super Admin"]}>
                                <UserManagement />
                            </RoleProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;