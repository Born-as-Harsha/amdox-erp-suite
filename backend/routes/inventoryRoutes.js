import express from "express";
import {
    getInventory,
    addProduct,
    updateProduct,
    deleteProduct,
    getInventoryStats
} from "../controllers/inventoryController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

const inventoryAllowed = ["Super Admin", "Admin", "Inventory Manager", "Store Keeper"];

router.get("/", protect, authorizeRoles(...inventoryAllowed), getInventory);
router.get("/stats", protect, authorizeRoles(...inventoryAllowed), getInventoryStats);
router.post("/", protect, authorizeRoles("Super Admin", "Admin", "Inventory Manager"), addProduct);
router.put("/:id", protect, authorizeRoles("Super Admin", "Admin", "Inventory Manager"), updateProduct);
router.delete("/:id", protect, authorizeRoles("Super Admin", "Admin", "Inventory Manager"), deleteProduct);

export default router;