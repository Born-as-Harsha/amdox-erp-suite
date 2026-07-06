function FinanceStats({ stats, transactions }) {

    return (

        <div className="finance-stats">

            <div className="stat-card">

                <h3>Total Income</h3>

                <p>₹{stats.totalIncome || 0}</p>

            </div>

            <div className="stat-card">

                <h3>Total Expense</h3>

                <p>₹{stats.totalExpense || 0}</p>

            </div>

            <div className="stat-card">

                <h3>Balance</h3>

                <p>₹{stats.balance || 0}</p>

            </div>

            <div className="stat-card">

                <h3>Transactions</h3>

                <p>{transactions.length}</p>

            </div>

        </div>

    );

}

export default FinanceStats;