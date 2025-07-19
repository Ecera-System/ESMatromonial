import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import userAuthRouter from "./routes/userAuthRoutes.js";
import adminAuthRouter from "./routes/adminAuthRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import callRouter from "./routes/callRoutes.js";
import passport from "passport";
import "./config/passport.js";
import googleRouter from "./routes/googleAuth.js";
import cors from "cors";
import logger from "./utils/logger.js";
import { startSchedulers } from "./services/schedulerService.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { initializeSocket } from "./utils/socket.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import { checkSubscriptionAndTrial } from "./middleware/subscriptionCheck.js";
import { authenticate } from "./middleware/auth.js";
import couponRoutes from "./routes/couponRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(checkSubscriptionAndTrial);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT;
app.use(passport.initialize());
// Socket.IO setup
const server = http.createServer(app);
// Initialize socket.io with proper implementation
initializeSocket(server);

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    // Initialize the daily recommendation scheduler
    startSchedulers();
  });
};

startServer();

app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  return res.status(200).json({
    success: true,
    message: "Welcome to ESMatrimonial API",
  });
});

// Email verification page route
app.get("/verify-email/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "email-verification.html"));
});

// Password reset page route
app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "password-reset.html"));
});

app.use("/api/v1/auth", userAuthRouter);
app.use("/api/v1/users", authenticate, userRouter);
app.use("/api/v1/auth/admin", adminAuthRouter);
app.use("/api/v1/admin", authenticate, adminRouter);
app.use("/api/v1/admin/coupons", couponRoutes);
app.use("/api/v1/admin/analytics", analyticsRoutes);
app.use("/api/v1/auth", googleRouter);
app.use("/api/v1/calls", authenticate, callRouter);
app.use("/api/v1/chat", authenticate, chatRoutes);
app.use("/api/v1/messages", authenticate, messageRoutes);
app.use("/api/v1/notifications", authenticate, notificationRoutes);
app.use("/api/v1/upload", authenticate, uploadRoutes);
app.use("/api/v1/visiter", authenticate, visitorRoutes);
app.use("/api/v1/requests", authenticate, requestRoutes);
app.use("/api/v1/subscription", authenticate, subscriptionRoutes);
app.use("/api/v1/verification", authenticate, verificationRoutes);
app.use("/api/v1/feed", authenticate, feedRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Server error: ${err.message}`);
  res.status(500).json({ error: "Server error" });
});
