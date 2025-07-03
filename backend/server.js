import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import userAuthRouter from "./routes/userAuthRoutes.js";
import adminAuthRouter from "./routes/adminAuthRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to ESMatrimonial API",
  });
});

app.use(userRouter);
app.use(userAuthRouter);
app.use(adminAuthRouter);
