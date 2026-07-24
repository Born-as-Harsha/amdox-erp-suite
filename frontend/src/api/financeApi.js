import api from "../services/api";

// Get all transactions
export const getTransactions = () =>
    api.get("/finance");

// Add transaction
export const addTransaction = (transaction) =>
    api.post("/finance", transaction);

// Update transaction
export const updateTransaction = (id, transaction) =>
    api.put(`/finance/${id}`, transaction);

// Delete transaction
export const deleteTransaction = (id) =>
    api.delete(`/finance/${id}`);

// Finance statistics
export const getFinanceStats = () =>
    api.get("/finance/stats");