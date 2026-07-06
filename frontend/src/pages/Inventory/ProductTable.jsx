function ProductTable({ products = [], handleDelete, handleEdit }) {
    return (
        <>
            <h2 className="table-title">Product List</h2>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan="7"
                                style={{
                                    textAlign: "center",
                                    padding: "20px"
                                }}
                            >
                                No Products Found
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.productId}</td>
                                <td>{product.productName}</td>
                                <td>{product.category}</td>
                                <td>{product.quantity}</td>
                                <td>₹{product.price}</td>
                                <td>
                                    <span
                                        className={
                                            product.status === "In Stock"
                                                ? "status available"
                                                : product.status === "Low Stock"
                                                ? "status low"
                                                : "status out"
                                        }
                                    >
                                        {product.status}
                                    </span>
                                </td>

                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
}

export default ProductTable;