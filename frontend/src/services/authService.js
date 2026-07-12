import api from "./api";

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

// Verify OTP
export const verifyOtp = async (otpData) => {
    try {
        const response = await api.post("/auth/verify-otp", otpData);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "Unable to connect to the server.",
            }
        );
    }
};

// Logout
export const logout = async (email) => {
    try {
        const response = await api.post("/auth/logout", { email });
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "Unable to connect to the server.",
            }
        );
    }
};

// Forgot Password
export const forgotPassword = async (email) => {
    try {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "Unable to connect to the server.",
            }
        );
    }
};

// Reset Password
export const resetPassword = async (token, password) => {
    try {
        const response = await api.post(`/auth/reset-password/${token}`, { password });
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "Unable to connect to the server.",
            }
        );
    }
};

// Login with Remember Me
export const loginWithRememberMe = async (token) => {
    try {
        const response = await api.post("/auth/remember-me", { token });
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