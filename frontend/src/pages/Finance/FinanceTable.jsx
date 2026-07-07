function FinanceTable({
    transactions,
    onEdit,
    onDelete
    
}) {

    return (

        <table>

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Title</th>

                    <th>Type</th>

                    <th>Amount</th>

                    <th>Category</th>

                    <th>Date</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                {transactions.length === 0 ? (

                    <tr>

                        <td
                            colSpan="7"
                            style={{
                                textAlign: "center",
                                padding: "20px"
                            }}
                        >

                            No Transactions Found

                        </td>

                    </tr>

                ) : (

                    transactions.map((transaction) => (

                        <tr key={transaction._id}>

                            <td>

                                {transaction.transactionId}

                            </td>

                            <td>

                                {transaction.title}

                            </td>

                            <td>

                                {transaction.type}

                            </td>

                            <td>

                                ₹{transaction.amount}

                            </td>

                            <td>

                                {transaction.category}

                            </td>

                            <td>

                                {

                                    new Date(

                                        transaction.date

                                    ).toLocaleDateString()

                                }

                            </td>

                            <td>

                                <button

                                    className="edit-btn"

                                    onClick={() =>

                                        onEdit(transaction)

                                    }

                                >

                                    Edit

                                </button>

                                <button

                                    className="delete-btn"

                                    onClick={() =>

                                        onDelete(transaction._id)

                                    }

                                >

                                    Delete

                                </button>

                            </td>

                        </tr>

                    ))

                )}

            </tbody>

        </table>

    );

}

export default FinanceTable;