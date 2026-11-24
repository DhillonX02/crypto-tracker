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
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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