import express from "express";
import {
  getInactiveUsers,
  updateUserAction,
  sendReminderEmail,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/inactive", getInactiveUsers);
router.post("/action/:id", updateUserAction);
router.post("/send-email/:id", sendReminderEmail);

export default router;
