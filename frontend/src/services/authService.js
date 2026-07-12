import axios from "axios";

// Base URL from .env
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Login
export const login = async (userData) => {
    try {
        const response = await api.post("/auth/login", userData);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "Unable to connect to the server.",
            }
        );
    }
};

// Register
export const register = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "Unable to connect to the server.",
            }
        );
    }
};

// =====================================
// USER MANAGEMENT ENDPOINTS (Admin Only)
// =====================================
export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export const resetUserPassword = async (id, newPassword) => {
    const response = await api.post(`/users/${id}/reset-password`, { newPassword });
    return response.data;
};

export default api;