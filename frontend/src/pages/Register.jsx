import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const[name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                name,
                email,
                password
            });
            console.log(res.data);

            navigate("/login");

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }
    return(
        <div>
            <h1>Register Page</h1>

            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
                <br />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
                <br />

                <button type="submit">Register</button>
            </form>

        </div>
    );
}

export default Register;