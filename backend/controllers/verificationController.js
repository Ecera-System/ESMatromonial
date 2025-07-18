import Verification from "../models/Verification.js";
import User from "../models/User.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import crypto from "crypto";
import {
  verifyAadhaarDocument as verifyAadhaarDocumentUtil,
  verifyAadhaarDocumentMock,
} from "../utils/aadhaarDecoder.js";
import fs from "fs";
import path from "path";

// Get verification status for a user
export const getVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    let verification = await Verification.findOne({ userId });

    if (!verification) {
      // Create new verification record if doesn't exist
      verification = new Verification({ userId });
      await verification.save();
    }

    res.json({
      success: true,
      verification: {
        emailVerified: verification.emailVerified,
        phoneVerified: verification.phoneVerified,
        aadhaarVerified: verification.aadhaarVerified,
        isFullyVerified: verification.isFullyVerified,
        verificationScore: verification.verificationScore,
        verificationStartedAt: verification.verificationStartedAt,
        verificationCompletedAt: verification.verificationCompletedAt,
      },
    });
  } catch (error) {
    console.error("Error getting verification status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Send email verification
export const sendEmailVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let verification = await Verification.findOne({ userId });
    if (!verification) {
      verification = new Verification({ userId });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    verification.emailVerificationToken = verificationToken;
    verification.emailVerificationExpires = expiresAt;
    verification.verificationStartedAt = new Date();
    await verification.save();

    // Send verification email
    const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
    const verificationUrl = `${serverUrl}/api/v1/verification/email/verify?token=${verificationToken}`;

    await sendVerificationEmail(email, verificationToken, verificationUrl);

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email verification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Verify email with token
export const verifyEmail = async (req, res) => {
  try {
    // Handle both GET (query parameter) and POST (body) requests
    const token = req.method === "GET" ? req.query.token : req.body.token;

    const verification = await Verification.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!verification) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    verification.emailVerified = true;
    verification.emailVerificationToken = undefined;
    verification.emailVerificationExpires = undefined;

    // Update verification score
    verification.verificationScore = Math.min(
      100,
      verification.verificationScore + 30
    );

    // Check if fully verified
    if (verification.phoneVerified && verification.aadhaarVerified) {
      verification.isFullyVerified = true;
      verification.verificationCompletedAt = new Date();
    }

    await verification.save();

    // Update user's email verification status
    await User.findByIdAndUpdate(verification.userId, {
      isEmailVerified: true,
    });

    // For GET requests (email links), redirect to frontend
    if (req.method === "GET") {
      return res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
    }

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Send phone verification OTP
export const sendPhoneVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { phoneNumber } = req.body;

    let verification = await Verification.findOne({ userId });
    if (!verification) {
      verification = new Verification({ userId });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    verification.phoneNumber = phoneNumber;
    verification.phoneVerificationOTP = otp;
    verification.phoneVerificationExpires = expiresAt;
    verification.verificationStartedAt =
      verification.verificationStartedAt || new Date();
    await verification.save();

    // TODO: Integrate with SMS service (Twilio, etc.)
    // For now, just return the OTP for testing
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
      // Remove this in production
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Error sending phone verification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Verify phone OTP
export const verifyPhoneOTP = async (req, res) => {
  try {
    const { userId } = req.params;
    const { otp } = req.body;

    const verification = await Verification.findOne({ userId });
    if (!verification) {
      return res
        .status(404)
        .json({ success: false, message: "Verification record not found" });
    }

    if (verification.phoneVerificationOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (verification.phoneVerificationExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    verification.phoneVerified = true;
    verification.phoneVerificationOTP = undefined;
    verification.phoneVerificationExpires = undefined;

    // Update verification score
    verification.verificationScore = Math.min(
      100,
      verification.verificationScore + 30
    );

    // Check if fully verified
    if (verification.emailVerified && verification.aadhaarVerified) {
      verification.isFullyVerified = true;
      verification.verificationCompletedAt = new Date();
    }

    await verification.save();

    res.json({ success: true, message: "Phone number verified successfully" });
  } catch (error) {
    console.error("Error verifying phone OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Upload and verify Aadhaar document
export const uploadAadhaarDocument = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    let verification = await Verification.findOne({ userId });
    if (!verification) {
      verification = new Verification({ userId });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.path,
      "aadhaar-documents"
    );

    verification.aadhaarDocument = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      originalName: req.file.originalname,
    };
    verification.verificationStartedAt =
      verification.verificationStartedAt || new Date();
    await verification.save();

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Aadhaar document uploaded successfully",
      documentUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error uploading Aadhaar document:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Verify Aadhaar document using OCR and QR code
export const verifyAadhaarDocument = async (req, res) => {
  try {
    const { userId } = req.params;

    const verification = await Verification.findOne({ userId });
    if (!verification || !verification.aadhaarDocument) {
      return res
        .status(404)
        .json({ success: false, message: "Aadhaar document not found" });
    }

    // Download the file from Cloudinary for processing
    const response = await fetch(verification.aadhaarDocument.url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempPath = path.join(process.cwd(), "temp_aadhaar.jpg");
    fs.writeFileSync(tempPath, buffer);

    try {
      // Use JavaScript QR decoder instead of Python
      const result = await verifyAadhaarDocumentMock(tempPath); // Use mock for development

      // Clean up temp file
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

      if (result.verified) {
        // Aadhaar uniqueness check
        const existingUser = await User.findOne({
          aadhaarNumber: result.uid,
          _id: { $ne: verification.userId },
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message:
              "This Aadhaar number is already associated with another account.",
          });
        }
        verification.aadhaarVerified = true;
        verification.aadhaarData = {
          name: result.name,
          dob: result.dob,
          uid: result.uid,
          gender: result.gender,
          mobile: result.mobile,
          email: result.email,
        };
        verification.aadhaarNumber = result.uid;

        // Update verification score
        verification.verificationScore = Math.min(
          100,
          verification.verificationScore + 40
        );

        // Check if fully verified
        if (verification.emailVerified && verification.phoneVerified) {
          verification.isFullyVerified = true;
          verification.verificationCompletedAt = new Date();

          // Update user verification status
          await User.findByIdAndUpdate(verification.userId, {
            isVerified: true,
            verificationCompleted: true,
          });
        }

        await verification.save();

        res.json({
          success: true,
          message: "Aadhaar verified successfully",
          aadhaarData: result,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Aadhaar verification failed",
          error: result.error,
        });
      }
    } catch (processError) {
      // Clean up temp file on error
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

      console.error("Aadhaar verification processing error:", processError);
      res.status(500).json({
        success: false,
        message: "Failed to process Aadhaar verification",
        error: processError.message,
      });
    }
  } catch (error) {
    console.error("Error verifying Aadhaar document:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Send Aadhaar verification OTP
export const sendAadhaarOTP = async (req, res) => {
  try {
    const { userId } = req.params;
    const { mobileNumber } = req.body;

    const verification = await Verification.findOne({ userId });
    if (!verification || !verification.aadhaarVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Aadhaar not verified yet" });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    verification.aadhaarVerificationOTP = otp;
    verification.aadhaarVerificationExpires = expiresAt;
    await verification.save();

    // TODO: Integrate with SMS service for Aadhaar OTP
    console.log(`Aadhaar OTP for ${mobileNumber}: ${otp}`);

    res.json({
      success: true,
      message: "Aadhaar OTP sent successfully",
      // Remove this in production
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Error sending Aadhaar OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Verify Aadhaar OTP
export const verifyAadhaarOTP = async (req, res) => {
  try {
    const { userId } = req.params;
    const { otp } = req.body;

    const verification = await Verification.findOne({ userId });
    if (!verification) {
      return res
        .status(404)
        .json({ success: false, message: "Verification record not found" });
    }

    if (verification.aadhaarVerificationOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (verification.aadhaarVerificationExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    verification.aadhaarVerificationOTP = undefined;
    verification.aadhaarVerificationExpires = undefined;
    await verification.save();

    res.json({ success: true, message: "Aadhaar OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying Aadhaar OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all verifications (admin only)
export const getAllVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find()
      .populate("userId", "firstName lastName email")
      .populate("adminVerifiedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, verifications });
  } catch (error) {
    console.error("Error getting all verifications:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin verify a user
export const adminVerifyUser = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { adminId, notes } = req.body;

    const verification = await Verification.findById(verificationId);
    if (!verification) {
      return res
        .status(404)
        .json({ success: false, message: "Verification not found" });
    }

    verification.adminVerified = true;
    verification.adminVerifiedBy = adminId;
    verification.adminVerifiedAt = new Date();
    verification.adminNotes = notes;
    await verification.save();

    // Update user's verification status
    await User.findByIdAndUpdate(verification.userId, {
      isVerified: true,
    });

    res.json({ success: true, message: "User verified by admin successfully" });
  } catch (error) {
    console.error("Error admin verifying user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
