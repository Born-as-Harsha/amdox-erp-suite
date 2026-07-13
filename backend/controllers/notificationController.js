import Notification from "../models/Notification.js";

// Active Server-Sent Events Client Registrations
let clients = [];

// SSE Live Stream Endpoint
export const notificationStream = (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const clientObj = {
        userId: req.user._id.toString(),
        role: req.user.role,
        department: req.user.department || "",
        res
    };

    clients.push(clientObj);

    // Keep connection alive with simple heartbeat ping every 25 seconds
    const intervalId = setInterval(() => {
        res.write(":\n\n");
    }, 25000);

    req.on("close", () => {
        clearInterval(intervalId);
        clients = clients.filter(c => c.res !== res);
    });
};

// Dispatch Live Notification Event to Connected SSE Clients
export const broadcastLiveNotification = (notification) => {
    clients.forEach(client => {
        const matchesAll = notification.targetType === "All";
        const matchesUser = notification.targetType === "User" && notification.targetId === client.userId;
        const matchesRole = notification.targetType === "Role" && notification.targetId === client.role;
        const matchesDept = notification.targetType === "Department" && notification.targetId === client.department;

        if (matchesAll || matchesUser || matchesRole || matchesDept) {
            client.res.write(`data: ${JSON.stringify(notification)}\n\n`);
        }
    });
};

// Create & Dispatch Notification
export const createNotification = async (req, res) => {
    try {
        const { title, description, priority, type, targetType, targetId, expiryDate } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Notification title is required." });
        }

        // Restrict creation privileges to authorized roles
        const privilegedRoles = ["Super Admin", "Admin", "HR Manager", "Finance Manager", "Project Manager"];
        if (!privilegedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to create notifications." });
        }

        const notification = new Notification({
            title,
            description,
            priority,
            type,
            targetType,
            targetId,
            expiryDate,
            sender: req.user._id
        });

        await notification.save();

        // Broadcast to clients in real-time
        broadcastLiveNotification(notification);

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch dynamic notifications for active role
export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        const department = req.user.department || "";

        // Query targeted broadcasts matching user role/department or individual ID
        const list = await Notification.find({
            $or: [
                { targetType: "All" },
                { targetType: "Role", targetId: role },
                { targetType: "Department", targetId: department },
                { targetType: "User", targetId: userId.toString() }
            ]
        }).populate("sender", "name email profilePicture").sort({ createdAt: -1 });

        // Add virtual properties representing if active user has read/archived
        const formatted = list.map(item => {
            const isRead = item.readBy.includes(userId);
            const isArchived = item.archivedBy.includes(userId);
            return {
                ...item._doc,
                isRead,
                isArchived
            };
        });

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark Single Notification as Read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notif = await Notification.findById(id);
        if (!notif) {
            return res.status(404).json({ message: "Notification not found." });
        }

        if (!notif.readBy.includes(userId)) {
            notif.readBy.push(userId);
            await notif.save();
        }

        res.status(200).json({ success: true, message: "Marked as read." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark All Notifications as Read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        const department = req.user.department || "";

        const list = await Notification.find({
            $or: [
                { targetType: "All" },
                { targetType: "Role", targetId: role },
                { targetType: "Department", targetId: department },
                { targetType: "User", targetId: userId.toString() }
            ]
        });

        for (const notif of list) {
            if (!notif.readBy.includes(userId)) {
                notif.readBy.push(userId);
                await notif.save();
            }
        }

        res.status(200).json({ success: true, message: "All notifications marked as read." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Archive Notification
export const archiveNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notif = await Notification.findById(id);
        if (!notif) {
            return res.status(404).json({ message: "Notification not found." });
        }

        if (!notif.archivedBy.includes(userId)) {
            notif.archivedBy.push(userId);
            await notif.save();
        }

        res.status(200).json({ success: true, message: "Notification archived." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
