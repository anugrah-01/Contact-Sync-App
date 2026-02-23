import { registerUserService } from "../services/authService.js";

export const registerUser = async(req, res) =>{
    try {
        const {name, email, password} = req.body;
        
        const newUser = await registerUserService(name, email, password);

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};