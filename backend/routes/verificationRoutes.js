import express from "express";
import multer from "multer";
import {
  getVerificationStatus,
  sendEmailVerification,
  verifyEmail,
  sendPhoneVerification,
  verifyPhoneOTP,
  uploadAadhaarDocument,
  verifyAadhaarDocument,
  sendAadhaarOTP,
  verifyAadhaarOTP,
  getAllVerifications,
  adminVerifyUser,
} from "../controllers/verificationController.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDF files are allowed"), false);
    }
  },
});

// User verification routes (protected)
router.get("/status/:userId", authenticate, getVerificationStatus);

// Email verification
router.post("/email/send/:userId", authenticate, sendEmailVerification);
router.post("/email/verify", verifyEmail); // Public route for email verification
router.get("/email/verify", verifyEmail); // GET route for email verification with query parameter

// Phone verification
router.post("/phone/send/:userId", authenticate, sendPhoneVerification);
router.post("/phone/verify/:userId", authenticate, verifyPhoneOTP);

// Aadhaar verification
router.post(
  "/aadhaar/upload/:userId",
  authenticate,
  upload.single("aadhaar"),
  uploadAadhaarDocument
);
router.post("/aadhaar/verify/:userId", authenticate, verifyAadhaarDocument);
router.post("/aadhaar/otp/send/:userId", authenticate, sendAadhaarOTP);
router.post("/aadhaar/otp/verify/:userId", authenticate, verifyAadhaarOTP);

// Admin routes (admin only)
router.get("/admin/all", requireAdmin, getAllVerifications);
router.post("/admin/verify/:verificationId", requireAdmin, adminVerifyUser);

export default router;
