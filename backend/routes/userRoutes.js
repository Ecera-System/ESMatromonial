// User profile routes
import { getAllUsers, getUserById } from "../controllers/userController.js";
import express from "express";
const userRouter = express.Router();

userRouter.get("/api/v1/users", getAllUsers);
userRouter.get("/api/v1/users/:id", getUserById);

export default userRouter;
