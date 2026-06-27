import "./Projects.css";

function Projects() {

    const projects = [
        {
            id: "PRJ001",
            name: "ERP Development",
            manager: "Rahul Sharma",
            progress: "80%",
            deadline: "15 Jul 2026",
            status: "In Progress"
        },
        {
            id: "PRJ002",
            name: "HR Portal",
            manager: "Priya Reddy",
            progress: "100%",
            deadline: "10 Jun 2026",
            status: "Completed"
        },
        {
            id: "PRJ003",
            name: "Inventory Upgrade",
            manager: "Arjun Kumar",
            progress: "30%",
            deadline: "30 Jul 2026",
            status: "Pending"
        }
    ];

    return (
        <div className="projects">

            <div className="projects-header">
                <h1>Project Management</h1>
                <button>Add Project</button>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search Project..."
                />
            </div>

            <div className="project-stats">

                <div className="stat-card">
                    <h3>Total Projects</h3>
                    <p>16</p>
                </div>

                <div className="stat-card">
                    <h3>Completed</h3>
                    <p>8</p>
                </div>

                <div className="stat-card">
                    <h3>In Progress</h3>
                    <p>5</p>
                </div>

                <div className="stat-card">
                    <h3>Pending</h3>
                    <p>3</p>
                </div>

            </div>

            <h2 className="table-title">Project List</h2>

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Project</th>
                        <th>Manager</th>
                        <th>Progress</th>
                        <th>Deadline</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {projects.map((project) => (

                        <tr key={project.id}>

                            <td>{project.id}</td>
                            <td>{project.name}</td>
                            <td>{project.manager}</td>
                            <td>{project.progress}</td>
                            <td>{project.deadline}</td>

                            <td>

                                <span
                                    className={
                                        project.status === "Completed"
                                            ? "status completed"
                                            : project.status === "In Progress"
                                            ? "status progress"
                                            : "status pending"
                                    }
                                >
                                    {project.status}
                                </span>

                            </td>

                            <td>

                                <button className="edit-btn">Edit</button>

                                <button className="delete-btn">Delete</button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );

}

export default Projects;