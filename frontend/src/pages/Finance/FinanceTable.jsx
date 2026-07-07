function ProjectTable({
    projects,
    handleEdit,
    handleDelete
}) {
    return (
        <>
            <h2 className="table-title">
                Recent Projects
            </h2>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Project Name</th>
                        <th>Manager</th>
                        <th>Budget</th>
                        <th>Client</th>
                        <th>Deadline</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        projects.length === 0 ? (
                            <tr>
                                <td colSpan="7">
                                    No Projects Found
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project._id}>
                                    <td>{project.projectId}</td>
                                    <td>{project.projectName}</td>
                                    <td>{project.manager}</td>
                                    <td>₹{project.budget}</td>
                                    <td>{project.client}</td>
                                    <td>
                                        {
                                            new Date(
                                                project.deadline
                                            ).toLocaleDateString()
                                        }
                                    </td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(project)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(project._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
        </>
    );
}

export default ProjectTable;