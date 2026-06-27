import "./Finance.css";

function Finance() {

    const transactions = [

        {
            id: "TRX001",
            description: "Employee Salary",
            type: "Expense",
            amount: "₹2,50,000",
            date: "25-Jun-2026",
            status: "Completed"
        },

        {
            id: "TRX002",
            description: "Client Payment",
            type: "Income",
            amount: "₹6,80,000",
            date: "26-Jun-2026",
            status: "Received"
        },

        {
            id: "TRX003",
            description: "Office Rent",
            type: "Expense",
            amount: "₹80,000",
            date: "27-Jun-2026",
            status: "Pending"
        }

    ];

    return (

        <div className="finance">

            <div className="finance-header">

                <h1>Finance Management</h1>

                <button>Add Transaction</button>

            </div>

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search Transaction..."
                />

            </div>

            <div className="finance-stats">

                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>₹18.5L</p>
                </div>

                <div className="stat-card">
                    <h3>Total Expenses</h3>
                    <p>₹8.2L</p>
                </div>

                <div className="stat-card">
                    <h3>Profit</h3>
                    <p>₹10.3L</p>
                </div>

                <div className="stat-card">
                    <h3>Transactions</h3>
                    <p>245</p>
                </div>

            </div>

            <h2 className="table-title">Recent Transactions</h2>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {transactions.map((item) => (

                        <tr key={item.id}>

                            <td>{item.id}</td>
                            <td>{item.description}</td>
                            <td>{item.type}</td>
                            <td>{item.amount}</td>
                            <td>{item.date}</td>

                            <td>

                                <span
                                    className={
                                        item.status === "Completed"
                                            ? "status completed"
                                            : item.status === "Received"
                                            ? "status received"
                                            : "status pending"
                                    }
                                >
                                    {item.status}
                                </span>

                            </td>

                            <td>

                                <button className="edit-btn">
                                    View
                                </button>

                                <button className="delete-btn">
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Finance;