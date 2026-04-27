import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "#models";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        await User.create({ username, email, passwordHash });
        if (process.env.NODE_ENV === "development") {
            console.log("User created", { username, email });
        };
        return res.status(201).json({
            message: "User registered",
            user: {
                username,
                email,
            }
        });
    } catch (error) {
        if ((error as any).code === 11000) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
    } return res.status(500).json({ message: "Something went wrong" });

};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
        {
            userId: user._id.toString(),
            email: user.email
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1h",
        }
    );
    return res.status(200).json({
        message: "Login successful",
        token,
    });
};

export const me = async (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Protected route works",
        user: req.user,
    });
};

