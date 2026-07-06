import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

// Get all transactions
export const getTransactions = () =>
    API.get("/finance");

// Add transaction
export const addTransaction = (transaction) =>
    API.post("/finance", transaction);

// Update transaction
export const updateTransaction = (id, transaction) =>
    API.put(`/finance/${id}`, transaction);

// Delete transaction
export const deleteTransaction = (id) =>
    API.delete(`/finance/${id}`);

// Finance statistics
export const getFinanceStats = () =>
    API.get("/finance/stats");