function FinanceStats({ stats = {}, transactions = [] }) {
    const cards = [
        {
            title: "Total Income",
            value: `₹${stats?.totalIncome || 0}`,
            icon: "💰"
        },
        {
            title: "Total Expense",
            value: `₹${stats?.totalExpense || 0}`,
            icon: "💸"
        },
        {
            title: "Balance",
            value: `₹${stats?.balance || 0}`,
            icon: "💳"
        },
        {
            title: "Transactions",
            value: transactions?.length || 0,
            icon: "📊"
        }
    ];

    return (
        <div className="finance-stats">
            {cards.map((card) => (
                <div className="stat-card" key={card.title}>
                    <div className="stat-icon">{card.icon}</div>
                    <h3>{card.title}</h3>
                    <p>{card.value}</p>
                </div>
            ))}
        </div>
    );
}

export default FinanceStats;