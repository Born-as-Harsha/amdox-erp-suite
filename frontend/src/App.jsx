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
import AppLayout from "./components/layout/AppLayout";
import { SearchProvider } from "./context/SearchContext";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
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
                            <RoleProtectedRoute allowedRoles={["Admin", "HR"]}>
                                <Employees />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/inventory"
                        element={
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Inventory />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/finance"
                        element={
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Finance />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/projects"
                        element={
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Projects />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Reports />
                            </RoleProtectedRoute>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <RoleProtectedRoute allowedRoles={["Admin"]}>
                                <Settings />
                            </RoleProtectedRoute>
                        }
                    />
                </Route>

            </Routes>

        </BrowserRouter>

    );

}

export default App;