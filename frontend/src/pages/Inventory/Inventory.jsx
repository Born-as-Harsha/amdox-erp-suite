import "./Inventory.css";

function Inventory() {

    const products = [

        {
            id: "PRD001",
            name: "Laptop",
            category: "Electronics",
            stock: 45,
            price: "₹55,000",
            status: "Available"
        },

        {
            id: "PRD002",
            name: "Office Chair",
            category: "Furniture",
            stock: 12,
            price: "₹6,500",
            status: "Low Stock"
        },

        {
            id: "PRD003",
            name: "Printer",
            category: "Electronics",
            stock: 0,
            price: "₹18,000",
            status: "Out of Stock"
        }

    ];

    return (

        <div className="inventory">

            <div className="inventory-header">

                <h1>Inventory Management</h1>

                <button>Add Product</button>

            </div>

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search Product..."
                />

            </div>

            <div className="inventory-stats">

                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p>842</p>
                </div>

                <div className="stat-card">
                    <h3>Categories</h3>
                    <p>18</p>
                </div>

                <div className="stat-card">
                    <h3>Available</h3>
                    <p>810</p>
                </div>

                <div className="stat-card">
                    <h3>Low Stock</h3>
                    <p>32</p>
                </div>

            </div>

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

                    {products.map((product) => (

                        <tr key={product.id}>

                            <td>{product.id}</td>

                            <td>{product.name}</td>

                            <td>{product.category}</td>

                            <td>{product.stock}</td>

                            <td>{product.price}</td>

                            <td>

                                <span
                                    className={
                                        product.status === "Available"
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

export default Inventory;