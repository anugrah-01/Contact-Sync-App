import { useState } from "react";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
            email,
            password
            });

            console.log(res.data);

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h1>Login Page</h1>

            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
                <br />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
                <br />

                <button type="submit">Login</button>
            </form>

        </div>
    );
}

export default Login;