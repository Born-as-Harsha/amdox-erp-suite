import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

        try {

            const data = await login({

                email,

                password

            });

            localStorage.setItem(

                "token",

                data.token

            );

            localStorage.setItem(

                "user",

                JSON.stringify(data)

            );

            alert("Login Successful");

            navigate("/dashboard");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                error.message

            );

        }

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

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "20px"
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "15px"
                        }}
                    />

                    <button
                        type="submit"
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

                </form>

            </div>

        </div>

    );

}

export default Login;