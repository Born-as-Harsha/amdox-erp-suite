import Project from "../models/Project.js";

// Get All Projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Project
export const addProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Project
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json(project);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Project
export const deleteProject = async (req, res) => {
    try {

        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Project Statistics
export const getProjectStats = async (req, res) => {
    try {

        const totalProjects = await Project.countDocuments();

        const planning = await Project.countDocuments({
            status: "Planning"
        });

        const inProgress = await Project.countDocuments({
            status: "In Progress"
        });

        const completed = await Project.countDocuments({
            status: "Completed"
        });

        res.json({
            totalProjects,
            planning,
            inProgress,
            completed
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};