import api from "../services/api";

// ==========================
// GET ALL PRODUCTS
// ==========================

export const getInventory = () =>
    api.get("/inventory");

// ==========================
// ADD PRODUCT
// ==========================

export const addProduct = (product) =>
    api.post("/inventory", product);

// ==========================
// UPDATE PRODUCT
// ==========================

export const updateProduct = (id, product) =>
    api.put(`/inventory/${id}`, product);

// ==========================
// DELETE PRODUCT
// ==========================

export const deleteProduct = (id) =>
    api.delete(`/inventory/${id}`);

// ==========================
// INVENTORY STATS
// ==========================

export const getInventoryStats = () =>
    api.get("/inventory/stats");