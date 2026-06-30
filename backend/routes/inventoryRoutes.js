import express from "express";

import {
    getInventory,
    addProduct,
    updateProduct,
    deleteProduct,
    getInventoryStats
} from "../controllers/inventoryController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// INVENTORY ROUTES
// ==========================

router.get("/", protect, getInventory);

router.get("/stats", protect, getInventoryStats);

router.post("/", protect, addProduct);

router.put("/:id", protect, updateProduct);

router.delete("/:id", protect, deleteProduct);

export default router;