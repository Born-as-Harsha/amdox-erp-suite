function ProjectStats({ stats = {}, projects = [] }) {
    return (
        <div className="project-stats">
            <div className="stat-card">
                <h3>Total Projects</h3>
                <p>{stats.totalProjects || projects.length || 0}</p>
            </div>

            <div className="stat-card">
                <h3>Planning</h3>
                <p>{stats.planning || 0}</p>
            </div>

            <div className="stat-card">
                <h3>In Progress</h3>
                <p>{stats.inProgress || 0}</p>
            </div>

            <div className="stat-card">
                <h3>Completed</h3>
                <p>{stats.completed || 0}</p>
            </div>
        </div>
    );
}

export default ProjectStats;