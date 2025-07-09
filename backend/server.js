import cors from "cors"; // ✅ Import CORS
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors()); // ✅ Enable CORS
app.use(express.json());

// ✅ Routes
app.use("/api/subscription", subscriptionRoutes);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("🧠 Matrimony Backend is running...");
});

// ✅ MongoDB connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

startServer();

export default app; // For testing (supertest)
