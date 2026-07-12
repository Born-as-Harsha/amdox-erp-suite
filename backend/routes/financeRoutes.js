import express from "express";
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFinanceStats
} from "../controllers/financeController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

const financeAllowed = ["Super Admin", "Admin", "Finance Manager", "Accountant"];

router.get("/", protect, authorizeRoles(...financeAllowed), getTransactions);
router.get("/stats", protect, authorizeRoles(...financeAllowed), getFinanceStats);
router.post("/", protect, authorizeRoles("Super Admin", "Admin", "Finance Manager"), addTransaction);
router.put("/:id", protect, authorizeRoles("Super Admin", "Admin", "Finance Manager"), updateTransaction);
router.delete("/:id", protect, authorizeRoles("Super Admin", "Admin", "Finance Manager"), deleteTransaction);

export default router;