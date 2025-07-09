import cors from "cors"; // ✅ Import CORS
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { createServer } from 'http';
import { Server } from 'socket.io';
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userAuthRoutes from './routes/userAuthRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import { authenticateSocket } from './middleware/auth.js';
import socketHandler from './socket/socketHandler.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors()); // ✅ Enable CORS
app.use(express.json());

// ✅ Routes
app.use(userAuthRoutes); // User auth routes
app.use(adminAuthRoutes); // Admin auth routes
app.use("/api/subscription", subscriptionRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

io.use(authenticateSocket);
socketHandler(io);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("🧠 Matrimony Backend is running...");
});

// ✅ MongoDB connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

startServer();

export default app; // For testing (supertest)
