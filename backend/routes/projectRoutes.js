import express from "express";

import {
    getProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectStats
} from "../controllers/projectController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProjects);

router.get("/stats", protect, getProjectStats);

router.post("/", protect, addProject);

router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

export default router;