import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {

        e.preventDefault();

        setLoading(true);

        try {

            const data = await login({

                email,

                password

            });

            localStorage.setItem("token", data.token);

            localStorage.setItem(

                "user",

                JSON.stringify(data)

            );

            navigate("/dashboard");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                error.message

            );

        }

        finally{

            setLoading(false);

        }

    }

    return (

        <div className="login-page">

            <div className="login-card">

                <div className="company-logo">

                    A

                </div>

                <h1 className="company-title">

                    AMADOX TECHNOLOGIES

                </h1>

                <p className="company-subtitle">

                    Enterprise AI-Powered Cloud ERP Suite

                </p>

                <h2>

                    Secure Login

                </h2>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>Email Address</label>

                        <input

                            type="email"

                            value={email}

                            onChange={(e)=>setEmail(e.target.value)}

                            placeholder="Enter your email"

                            required

                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input

                            type="password"

                            value={password}

                            onChange={(e)=>setPassword(e.target.value)}

                            placeholder="Enter your password"

                            required

                        />

                    </div>

                    <button

                        className="login-btn"

                        disabled={loading}

                    >

                        {

                            loading

                            ?

                            "Signing In..."

                            :

                            "Login"

                        }

                    </button>

                </form>

                <p className="footer-text">

                    © 2026 Amadox Technologies Pvt. Ltd.

                </p>

            </div>

        </div>

    );

}

export default Login;