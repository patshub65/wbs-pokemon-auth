import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    // token check
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid token format" });
    }
    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "Server configuration error" });
        }

        const decoded = jwt.verify(
            token as string,
            secret
        ) as {
            userId: string;
            email: string;
        };
        req.user = decoded;
        next();

    } catch (error) {
        console.error("JWT verify error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }

};