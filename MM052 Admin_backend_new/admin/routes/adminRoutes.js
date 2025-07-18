// Admin routes
import express from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.js";
import {
  getUserStats,
  getAllReports,
  disableUser,
  enableUser,
  getDisabledUsers,
  getUserById,
  getNotifications,
  markReportReviewed,
  getFeedbackAnalytics,
  getInactiveUsers,
  searchUsers,
} from "../controllers/adminController.js";

const adminRouter = express.Router();


adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/stats", getUserStats);
adminRouter.get("/search-users", searchUsers);
adminRouter.get("/reports", getAllReports);
adminRouter.put("/disable/:userId", disableUser);
adminRouter.get("/notifications", getNotifications);
adminRouter.put("/notifications/:reportId/reviewed", markReportReviewed);
adminRouter.get("/analytics/feedback", getFeedbackAnalytics);
adminRouter.get("/inactive-users", getInactiveUsers);
adminRouter.put("/disable/:userId", disableUser);
adminRouter.put("/enable/:userId", enableUser);
adminRouter.get("/disabled-users", getDisabledUsers);
adminRouter.get("/user/:userId", getUserById);



export default adminRouter;
