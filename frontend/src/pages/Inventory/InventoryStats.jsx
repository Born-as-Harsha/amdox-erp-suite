function InventoryStats({ products }) {

    const totalProducts = products.length;

    const totalCategories =
        [...new Set(products.map(product => product.category))].length;

    const availableProducts =
        products.filter(
            product => product.status === "In Stock"
        ).length;

    const lowStockProducts =
        products.filter(
            product => product.status === "Low Stock"
        ).length;

    return (

        <div className="inventory-stats">

            <div className="stat-card">

                <h3>Total Products</h3>

                <p>{totalProducts}</p>

            </div>

            <div className="stat-card">

                <h3>Categories</h3>

                <p>{totalCategories}</p>

            </div>

            <div className="stat-card">

                <h3>Available</h3>

                <p>{availableProducts}</p>

            </div>

            <div className="stat-card">

                <h3>Low Stock</h3>

                <p>{lowStockProducts}</p>

            </div>

        </div>

    );

}

export default InventoryStats;