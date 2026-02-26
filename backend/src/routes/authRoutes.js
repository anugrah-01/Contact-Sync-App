import express, { Router } from "express";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import { authMidd } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMidd, (req, res) => {
    res.json({
        message: "Protected route working",
        userFromToken: req.user
    });
});


export default router;