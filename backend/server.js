import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js"


//Load environment variables
dotenv.config();

//Create Express application
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);

// Test API route
app.get('/',(req,res) => {
    res.send("Crypto Tracker Backend is running!");
})

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})