import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        department: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            default: ""
        },
        deadline: {
            type: Date,
            required: true
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        progress: {
            type: String,
            enum: ["To Do", "In Progress", "Review", "Done"],
            default: "To Do"
        },
        completionPercentage: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Overdue"],
            default: "Pending"
        },
        attachments: [
            {
                type: String
            }
        ],
        comments: [
            {
                user: {
                    type: String,
                    required: true
                },
                text: {
                    type: String,
                    required: true
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        createdBy: {
            type: String,
            default: "System"
        },
        updatedBy: {
            type: String,
            default: "System"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Task", taskSchema);
