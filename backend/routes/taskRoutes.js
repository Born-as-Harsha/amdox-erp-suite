import express from "express";
import { createTask, getTasks, updateTask, addTaskComment } from "../controllers/taskController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .post(protect, authorizeRoles("Super Admin", "Admin", "Project Manager"), createTask)
    .get(protect, getTasks);

router.route("/:id")
    .put(protect, updateTask);

router.route("/:id/comments")
    .post(protect, addTaskComment);

export default router;
