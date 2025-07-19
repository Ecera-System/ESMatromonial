// Admin routes
import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  getSchedulerStatus,
  searchUsers,
  getUserStats,
  getTotalUsersCount,
  getMaleUsersCount,
  getFemaleUsersCount,
  getPremiumUsersCount,
  getRecentUsersList,
  // Uncomment these if you have the models and implementations:
  getAllReports,
  disableUser,
  enableUser,
  getDisabledUsers,
  getUserById,
  getNotifications,
  markReportReviewed,
  getFeedbackAnalytics,
  getInactiveUsers,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Daily recommendation scheduler routes (admin only)
adminRouter.get("/stats/total-users", authenticate, requireAdmin, getTotalUsersCount);
adminRouter.get("/stats/male-users", authenticate, requireAdmin, getMaleUsersCount);
adminRouter.get("/stats/female-users", authenticate, requireAdmin, getFemaleUsersCount);
adminRouter.get("/stats/premium-users", authenticate, requireAdmin, getPremiumUsersCount);
adminRouter.get("/users/recent", authenticate, requireAdmin, getRecentUsersList);

adminRouter.get(
  "/scheduler-status",
  authenticate,
  requireAdmin,
  getSchedulerStatus
);

adminRouter.get("/search-users", authenticate, requireAdmin, searchUsers);

// Advanced admin endpoints
adminRouter.get("/stats", authenticate, requireAdmin, getUserStats);
// Uncomment and implement these if you have the models and controller functions:
adminRouter.get("/reports", authenticate, requireAdmin, getAllReports);
adminRouter.put("/disable/:userId", authenticate, requireAdmin, disableUser);
adminRouter.put("/enable/:userId", authenticate, requireAdmin, enableUser);
adminRouter.get(
  "/disabled-users",
  authenticate,
  requireAdmin,
  getDisabledUsers
);
adminRouter.get("/users/:userId", authenticate, requireAdmin, getUserById);
adminRouter.get("/notifications", authenticate, requireAdmin, getNotifications);
adminRouter.put(
  "/notifications/:reportId/reviewed",
  authenticate,
  requireAdmin,
  markReportReviewed
);
adminRouter.get(
  "/analytics/feedback",
  authenticate,
  requireAdmin,
  getFeedbackAnalytics
);
adminRouter.get(
  "/inactive-users",
  authenticate,
  requireAdmin,
  getInactiveUsers
);

export default adminRouter;
