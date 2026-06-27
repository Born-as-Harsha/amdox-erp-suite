import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    function handleLogin() {

        navigate("/dashboard");

    }

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#f4f6f9"
            }}
        >

            <div
                style={{
                    background: "white",
                    padding: "40px",
                    borderRadius: "10px",
                    width: "350px",
                    boxShadow: "0 2px 10px rgba(0,0,0,.2)"
                }}
            >

                <h2>ERP Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "20px"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "15px"
                    }}
                />

                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        marginTop: "20px",
                        padding: "12px",
                        background: "#0d6efd",
                        color: "white",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>

            </div>

        </div>

    );

}

export default Login;