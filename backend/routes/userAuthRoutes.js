import express from "express";
import { register, login, getMe, debugUser, fixPassword } from "../controllers/authController.js";
import { authenticateToken, requireUser } from "../middleware/auth.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/api/v1/auth/register", register);
userAuthRouter.post("/api/v1/auth/login", login);
userAuthRouter.get("/api/v1/auth/me", authenticateToken, requireUser, getMe);

// Temporary debug routes - REMOVE IN PRODUCTION
userAuthRouter.get("/api/v1/auth/debug/:email", debugUser);
userAuthRouter.post("/api/v1/auth/fix-password", fixPassword);

export default userAuthRouter;
