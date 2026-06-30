import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import Inventory from "./pages/Inventory/Inventory";
import Finance from "./pages/Finance/Finance";
import Projects from "./pages/Projects/Projects";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["Admin", "HR"]}>
                                <Employees />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Inventory />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/finance"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Finance />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Projects />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Reports />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Settings />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;