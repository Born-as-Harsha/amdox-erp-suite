import express from "express";
import {
    notificationStream,
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// SSE live stream connection endpoint
router.get("/stream", protect, notificationStream);

router.route("/")
    .post(protect, createNotification)
    .get(protect, getMyNotifications);

router.put("/mark-all-read", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);
router.put("/:id/archive", protect, archiveNotification);

export default router;
