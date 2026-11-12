import { application } from "express";
import jwt from "jsonwebtoken"

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message:"Access denied, invalid token "
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch(error) {
        res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}

export default authMiddleware;