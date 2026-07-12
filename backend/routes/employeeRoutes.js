import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("Super Admin", "Admin", "HR Manager", "HR Executive"), getEmployeeStats);
router.get("/", protect, authorizeRoles("Super Admin", "Admin", "HR Manager", "HR Executive"), getEmployees);
router.post("/", protect, authorizeRoles("Super Admin", "Admin", "HR Manager"), createEmployee);
router.put("/:id", protect, authorizeRoles("Super Admin", "Admin", "HR Manager"), updateEmployee);
router.delete("/:id", protect, authorizeRoles("Super Admin", "Admin", "HR Manager"), deleteEmployee);

export default router;