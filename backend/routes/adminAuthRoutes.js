import express from "express";
import {
  adminRegister,
  adminLogin,
} from "../controllers/adminAuthController.js";
import { adminGetMe } from "../controllers/adminAuthController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const adminAuthRouter = express.Router();

adminAuthRouter.post("/api/v1/auth/admin/register", adminRegister);
adminAuthRouter.post("/api/v1/auth/admin/login", adminLogin);
adminAuthRouter.get(
  "/api/v1/auth/admin/me",
  authenticate,
  requireAdmin,
  adminGetMe
);

export default adminAuthRouter;
