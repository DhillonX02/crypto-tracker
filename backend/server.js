import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js"
import watchlistRoutes from "./src/routes/watchlistRoutes.js";


//Load environment variables
dotenv.config();

//Create Express application
const app = express();


// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://crypto-tracker-puce-three.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth",authRoutes);

app.use('/api/watchlist',watchlistRoutes);

// Test API route
app.get('/',(req,res) => {
    res.send("Crypto Tracker Backend is running!");
})

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})