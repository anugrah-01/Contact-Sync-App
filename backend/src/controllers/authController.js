import { registerUserService } from "../services/authService.js";
import { loginUserService } from "../services/authService.js";

export const registerUser = async(req, res) =>{
    try {
        const {name, email, password} = req.body;

        const newUser = await registerUserService(name, email, password);

        res.status(200).json({
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const {token, user} = await loginUserService(email, password);

        res.status(200).json({
           message: "Login successful", 
           token,
           user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
