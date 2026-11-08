import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//Load environment variables
dotenv.config();

//Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test API route
app.get('/',(req,res) => {
    res.send("Crypto Tracker Backend is running!");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})