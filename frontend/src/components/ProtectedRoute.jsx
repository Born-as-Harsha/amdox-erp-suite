import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
    // Check both localStorage and sessionStorage
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const location = useLocation();

    // If no token, redirect to login
    if (!token) {
        return (
            <Navigate
                to="/"
                replace
                state={{ from: location }}
            />
        );
    }

    // Token exists, allow access
    return children;
}

export default ProtectedRoute;