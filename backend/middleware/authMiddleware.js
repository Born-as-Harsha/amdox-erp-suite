import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "User not found." });
            }

            if (req.user.status === "Inactive") {
                return res.status(403).json({ message: "Your account is deactivated." });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                message: "Not authorized. Invalid token."
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "No token provided."
        });
    }
};

// Role-Based Middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role (${req.user?.role || "Guest"}) is not authorized to access this resource.`
            });
        }
        next();
    };
};

// Permission-Based Middleware
export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Not authorized." });
            }

            // Find role and check permissions
            const roleDoc = await Role.findOne({ roleName: req.user.role });
            if (!roleDoc || !roleDoc.permissions.includes(requiredPermission)) {
                return res.status(403).json({
                    message: `Forbidden: You lack the permission '${requiredPermission}'`
                });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};

export default protect;