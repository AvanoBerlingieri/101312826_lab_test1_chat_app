import {useState} from "react";
import {login} from "../api/Login.js";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "./css/Login.css"

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    // Handle changes in input fields
    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setMessage("Please Fill In All Fields");
            return;
        }

        const res = await login(form);
        if (res.status) {
            setMessage("Login successful!");
            localStorage.setItem("user", JSON.stringify(res.user)); // sets username in localstorage
            navigate("/home");
        } else {
            setMessage(res.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                    />
                    <button className={"loginBtn"} type="submit">Login</button>
                </form>

                <div className="signup-link">
                    <p>Don't have an account?</p>
                    <Link to="/signup">
                        <button className={"signupBtn"}>Go to Signup</button>
                    </Link>
                </div>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}
