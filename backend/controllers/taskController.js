import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Create Task (PM / Admin / Super Admin only)
export const createTask = async (req, res) => {
    try {
        const { taskName, description, assignedTo, department, role, deadline, priority } = req.body;
        if (!taskName || !assignedTo || !deadline) {
            return res.status(400).json({ message: "Mandatory fields missing." });
        }

        const task = new Task({
            taskName,
            description,
            assignedTo,
            department,
            role,
            deadline: new Date(deadline),
            priority,
            createdBy: req.user.name,
            updatedBy: req.user.name
        });

        await task.save();

        // Automatically dispatch notification
        const assignedUser = await User.findById(assignedTo);
        if (assignedUser) {
            const notif = new Notification({
                title: "New Task Assigned",
                description: `You have been assigned a new task: ${taskName}. Deadline: ${new Date(deadline).toLocaleDateString()}`,
                priority,
                type: "Task",
                targetType: "User",
                targetId: assignedTo.toString(),
                sender: req.user._id
            });
            await notif.save();
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve Tasks (Filters by department, status, role, or assigned user)
export const getTasks = async (req, res) => {
    try {
        const { department, status, progress, assignedTo } = req.query;
        const queryObj = {};

        // Employees can only fetch tasks assigned to them
        if (req.user.role === "Employee") {
            queryObj.assignedTo = req.user._id;
        } else {
            if (assignedTo) queryObj.assignedTo = assignedTo;
            if (department) queryObj.department = department;
        }

        if (status) queryObj.status = status;
        if (progress) queryObj.progress = progress;

        const tasks = await Task.find(queryObj).populate("assignedTo", "name email role department designation");
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Task Progress/Status (Any employee assigned or manager)
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress, completionPercentage, status } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Restrict employee updates to their assigned tasks
        if (req.user.role === "Employee" && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized task modification." });
        }

        if (progress) task.progress = progress;
        if (completionPercentage !== undefined) {
            task.completionPercentage = completionPercentage;
            if (completionPercentage >= 100) {
                task.status = "Completed";
                task.progress = "Done";
            }
        }
        if (status) task.status = status;

        task.updatedBy = req.user.name;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Comment to Task
export const addTaskComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Comment content missing." });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        task.comments.push({
            user: req.user.name,
            text,
            timestamp: new Date()
        });

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
