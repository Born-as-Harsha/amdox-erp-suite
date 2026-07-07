import "./Projects.css";
import { useState } from "react";

import ProjectTable from "./ProjectTable";
import ProjectStats from "./ProjectStats";
import SearchBar from "./SearchBar";
import ProjectModal from "./ProjectModal";

function Projects() {
    const [projects, setProjects] = useState([
        {
            _id: "1",
            projectId: "PRJ001",
            projectName: "ERP Development",
            manager: "Rahul Sharma",
            budget: 500000,
            client: "ABC Pvt Ltd",
            deadline: "2026-07-15",
            description: "ERP system development project",
            status: "In Progress"
        },
        {
            _id: "2",
            projectId: "PRJ002",
            projectName: "HR Portal",
            manager: "Priya Reddy",
            budget: 300000,
            client: "XYZ Solutions",
            deadline: "2026-06-10",
            description: "HR portal implementation",
            status: "Completed"
        },
        {
            _id: "3",
            projectId: "PRJ003",
            projectName: "Inventory Upgrade",
            manager: "Arjun Kumar",
            budget: 200000,
            client: "Global Traders",
            deadline: "2026-07-30",
            description: "Inventory system upgrade",
            status: "Planning"
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        projectId: "",
        projectName: "",
        manager: "",
        budget: "",
        client: "",
        deadline: "",
        description: "",
        status: "Planning"
    });

    const stats = {
        totalProjects: projects.length,
        planning: projects.filter((project) => project.status === "Planning").length,
        inProgress: projects.filter((project) => project.status === "In Progress").length,
        completed: projects.filter((project) => project.status === "Completed").length
    };

    const filteredProjects = projects.filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (project) => {
        setEditingId(project._id);
        setFormData(project);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setProjects(projects.filter((project) => project._id !== id));
    };

    const handleSave = () => {
        if (editingId) {
            setProjects(
                projects.map((project) =>
                    project._id === editingId
                        ? { ...project, ...formData }
                        : project
                )
            );
        } else {
            const newProject = {
                _id: Date.now().toString(),
                ...formData
            };
            setProjects([...projects, newProject]);
        }

        setFormData({
            projectId: "",
            projectName: "",
            manager: "",
            budget: "",
            client: "",
            deadline: "",
            description: "",
            status: "Planning"
        });

        setEditingId(null);
        setShowModal(false);
    };

    return (
        <div className="projects">
            <div className="projects-header">
                <h1>Project Management</h1>
                <button onClick={() => setShowModal(true)}>Add Project</button>
            </div>

            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <ProjectStats
                stats={stats}
                projects={projects}
            />

            <ProjectTable
                projects={filteredProjects}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

            <ProjectModal
                showModal={showModal}
                setShowModal={setShowModal}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
                editingId={editingId}
            />
        </div>
    );
}

export default Projects;