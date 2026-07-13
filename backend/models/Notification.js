import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        type: {
            type: String,
            enum: [
                "Announcement",
                "Task",
                "Reminder",
                "Approval",
                "Meeting",
                "Holiday",
                "Finance",
                "Inventory",
                "Project",
                "Security",
                "Maintenance",
                "Emergency",
                "Training",
                "Audit",
                "Broadcast",
                "System"
            ],
            default: "Announcement"
        },
        targetType: {
            type: String,
            enum: ["All", "Role", "Department", "User"],
            default: "All"
        },
        // Store target details (e.g. role name, department name, or specific User ID)
        targetId: {
            type: String,
            default: ""
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        attachment: {
            type: String,
            default: ""
        },
        expiryDate: {
            type: Date
        },
        // We will store readStatus as a map or tracking array of User IDs that have read it
        // Or store a single status if it's targeted directly to one user.
        // Let's do an array of users who read it for "All", "Role", "Department" notifications,
        // and a boolean for individual user notifications.
        // Actually, to make it extremely clean and performant:
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        archivedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Notification", notificationSchema);
