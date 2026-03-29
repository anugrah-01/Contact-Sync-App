import jwt from "jsonwebtoken";

export const authMidd = (req, res, next) =>{
    try {
        console.log("Middleware hit");
        const authHeader = req.headers.authorization;

        if(!authHeader){
            const err = new Error("Authorization header missing");
            throw err;
        } 

        const token = authHeader.split(" ")[1];

        if(!token){
            const err = new Error("Token missing");
            throw err;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("TOKEN:", token);
        console.log("DECODED:", decoded);

        next();

    } catch (error) {
        console.error("AUTH ERROR:", error);
        return res.status(401).json({
            message: "Invalid token",
            error: error.message
        });
    }
};
