// Admin routes
import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  triggerDailyRecommendations,
  getSchedulerStatus,
  searchUsers,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Daily recommendation scheduler routes (admin only)
adminRouter.post(
  "/trigger-daily-recommendations",
  authenticate,
  requireAdmin,
  triggerDailyRecommendations
);

adminRouter.get(
  "/scheduler-status",
  authenticate,
  requireAdmin,
  getSchedulerStatus
);

adminRouter.get("/search-users", authenticate, requireAdmin, searchUsers);

export default adminRouter;
