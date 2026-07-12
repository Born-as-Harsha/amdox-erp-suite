import express from "express";
import {
    getProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectStats
} from "../controllers/projectController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

const projectsAllowed = ["Super Admin", "Admin", "Project Manager", "Project Lead", "Employee"];

router.get("/", protect, authorizeRoles(...projectsAllowed), getProjects);
router.get("/stats", protect, authorizeRoles(...projectsAllowed), getProjectStats);
router.post("/", protect, authorizeRoles("Super Admin", "Admin", "Project Manager", "Project Lead"), addProject);
router.put("/:id", protect, authorizeRoles("Super Admin", "Admin", "Project Manager", "Project Lead"), updateProject);
router.delete("/:id", protect, authorizeRoles("Super Admin", "Admin", "Project Manager"), deleteProject);

export default router;