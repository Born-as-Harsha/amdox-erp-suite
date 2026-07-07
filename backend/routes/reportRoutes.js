import express from "express";

import {
    getReports,
    addReport,
    updateReport,
    deleteReport,
    getReportStats
} from "../controllers/reportController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getReports);

router.get("/stats", protect, getReportStats);

router.post("/", protect, addReport);

router.put("/:id", protect, updateReport);

router.delete("/:id", protect, deleteReport);

export default router;