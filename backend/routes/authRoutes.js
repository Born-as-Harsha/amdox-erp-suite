import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    verifyRememberMe,
    verifyOtp,
    verifyResetOtp
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/remember-me", verifyRememberMe);

export default router;