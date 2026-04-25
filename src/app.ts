import "dotenv/config";
import express from "express";
import { connectDB } from "#db";
import { authRoutes } from "#routes";

const app = express();
const PORT = process.env.PORT || 3000;
// middleware
app.use(express.json());
// routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Auth API running");
});

// start server AFTER connecting to DB
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();