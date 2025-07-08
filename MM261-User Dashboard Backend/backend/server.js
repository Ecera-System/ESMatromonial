import express from "express";
import mongoose from 'mongoose';  
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

// Routers
import userRouter from "./routes/userRoutes.js";
import userAuthRouter from "./routes/userAuthRoutes.js";
import adminAuthRouter from "./routes/adminAuthRoutes.js";
import visitorRouter from "./routes/visitorRoutes.js";
import requestRouter from "./routes/requestRoutes.js";


// load environment variables
dotenv.config();

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Test route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to ESMatrimonial API",
  });
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth/user", userAuthRouter);
app.use("/api/v1/auth/admin", adminAuthRouter);
app.use("/api/v1/visitors", visitorRouter);
app.use("/api/v1/requests", requestRouter);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
