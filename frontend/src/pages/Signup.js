import {useState} from "react";
import {signup} from "../api/Signup";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./css/Signup.css";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        firstname: "",
        lastname: "",
        password: ""
    });

    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    //handle input change and update state
    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.firstname || !form.lastname || !form.password) {
            setMessage("Please fill in all fields");
            return;
        }

        const res = await signup(form);

        if (res.status) {
            setMessage("Signup successful!");
            navigate("/");
        } else {
            setMessage(res.message || "Error signing up");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Signup</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                    />
                    <input
                        name="firstname"
                        placeholder="First name"
                        onChange={handleChange}
                    />
                    <input
                        name="lastname"
                        placeholder="Last name"
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                    />
                    <button className={"signupBtn"} type="submit">Sign Up</button>
                </form>

                <div className="login-link">
                    <p>Already have an account?</p>
                    <Link to="/">
                        <button className={"backBtn"}>Back to Login</button>
                    </Link>
                </div>

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}
