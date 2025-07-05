// User profile routes
import {
  getAllUsers,
  getUserById,
  getProfileCompletion,
  getDailyRecommendation,
  skipRecommendation,
  likeRecommendation,
} from "../controllers/userController.js";
import express from "express";
import { authenticate, requireUser } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.get(
  "/daily-recommendation",
  authenticate,
  requireUser,
  getDailyRecommendation
);
userRouter.get("/profile-completion/:id", getProfileCompletion);
userRouter.get("/:id", getUserById);
userRouter.get("/", getAllUsers);
userRouter.post("/skip", authenticate, requireUser, skipRecommendation);
userRouter.post("/like", authenticate, requireUser, likeRecommendation);

export default userRouter;
