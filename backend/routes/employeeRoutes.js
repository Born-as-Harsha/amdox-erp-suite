import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/stats", getEmployeeStats);

router.get("/", protect, getEmployees);

router.post("/", protect, createEmployee);

router.put("/:id", protect, updateEmployee);

router.delete("/:id", protect, deleteEmployee);
export default router;