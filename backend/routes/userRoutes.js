import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword
} from "../controllers/userController.js";

const router = express.Router();

// Only Super Admins can perform these user operations
router.get("/", protect, authorizeRoles("Super Admin"), getUsers);
router.post("/", protect, authorizeRoles("Super Admin"), createUser);
router.put("/:id", protect, authorizeRoles("Super Admin"), updateUser);
router.delete("/:id", protect, authorizeRoles("Super Admin"), deleteUser);
router.post("/:id/reset-password", protect, authorizeRoles("Super Admin"), resetUserPassword);

export default router;
