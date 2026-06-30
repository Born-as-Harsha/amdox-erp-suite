function Navbar() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <header className="navbar">

            <div className="logo">
                Enterprise AI-Powered Cloud ERP Suite
            </div>

            <div className="user-info">
                Welcome, {user?.name} ({user?.role})
            </div>

        </header>

    );

}

export default Navbar;