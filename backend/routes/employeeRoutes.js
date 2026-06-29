import express from "express";

import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/stats", getEmployeeStats);

router.get("/", getEmployees);

router.post("/", createEmployee);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);

export default router;