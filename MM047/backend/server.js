import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import userAuthRouter from "./routes/userAuthRoutes.js";
import adminAuthRouter from "./routes/adminAuthRoutes.js";
import passport from "passport";
import "./config/passport.js";
import googleRouter from "./routes/googleAuth.js";
import cors from "cors";

import { authenticate, requireAdmin, requireUser } from "./middleware/auth.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(passport.initialize());
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// console.log(process.env.GOOGLE_CLIENT_ID);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to ESMatrimonial API",
  });
});

app.use(userRouter);
app.use(userAuthRouter);
app.use(adminAuthRouter);
app.use("/api/auth", googleRouter);
