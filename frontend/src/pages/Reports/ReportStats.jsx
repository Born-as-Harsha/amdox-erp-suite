function ReportStats({ stats = {}, reports = [] }) {

    return (

        <div className="report-stats">

            <div className="stat-card">

                <h3>Total Reports</h3>

                <p>{stats.totalReports || reports.length || 0}</p>

            </div>

            <div className="stat-card">

                <h3>Generated</h3>

                <p>{stats.generated || 0}</p>

            </div>

            <div className="stat-card">

                <h3>Pending</h3>

                <p>{stats.pending || 0}</p>

            </div>

            <div className="stat-card">

                <h3>Archived</h3>

                <p>{stats.archived || 0}</p>

            </div>

        </div>

    );

}

export default ReportStats;