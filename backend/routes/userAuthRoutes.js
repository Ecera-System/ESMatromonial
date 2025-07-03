import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { authenticate, requireUser } from "../middleware/auth.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/api/v1/auth/register", register);
userAuthRouter.post("/api/v1/auth/login", login);
userAuthRouter.get("/api/v1/auth/me", authenticate, requireUser, getMe);

export default userAuthRouter;
