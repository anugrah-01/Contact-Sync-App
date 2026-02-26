import jwt from "jsonwebtoken";

export const authMidd = (req, res, next) =>{
    try {
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
        next();

    } catch (error) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
};
