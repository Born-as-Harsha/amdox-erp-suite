function ReportStats({ stats = {}, reports = [] }) {
    return (
        <div className="report-stats">
            <div className="stat-card">
                <h3>Total Reports</h3>
                <p>{stats.totalReports || reports.length || 0}</p>
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

export default ReportStats;