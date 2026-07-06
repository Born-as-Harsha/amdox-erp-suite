import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Add JWT token automatically
API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

// ==========================
// GET ALL PRODUCTS
// ==========================

export const getInventory = () =>
    API.get("/inventory");

// ==========================
// ADD PRODUCT
// ==========================

export const addProduct = (product) =>
    API.post("/inventory", product);

// ==========================
// UPDATE PRODUCT
// ==========================

export const updateProduct = (id, product) =>
    API.put(`/inventory/${id}`, product);

// ==========================
// DELETE PRODUCT
// ==========================

export const deleteProduct = (id) =>
    API.delete(`/inventory/${id}`);

// ==========================
// INVENTORY STATS
// ==========================

export const getInventoryStats = () =>
    API.get("/inventory/stats");