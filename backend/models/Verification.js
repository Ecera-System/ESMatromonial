import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Email verification
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    // Phone verification
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: String,
    phoneVerificationOTP: String,
    phoneVerificationExpires: Date,

    // Aadhaar verification
    aadhaarVerified: {
      type: Boolean,
      default: false,
    },
    aadhaarNumber: String,
    aadhaarDocument: {
      url: String,
      publicId: String,
      originalName: String,
    },
    aadhaarData: {
      name: String,
      dob: String,
      uid: String,
      gender: String,
      mobile: String,
      email: String,
    },
    aadhaarVerificationOTP: String,
    aadhaarVerificationExpires: Date,

    // Overall verification status
    isFullyVerified: {
      type: Boolean,
      default: false,
    },
    verificationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Verification metadata
    verificationStartedAt: Date,
    verificationCompletedAt: Date,
    lastVerificationAttempt: Date,

    // Admin verification
    adminVerified: {
      type: Boolean,
      default: false,
    },
    adminVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    adminVerifiedAt: Date,
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
verificationSchema.index({ userId: 1 });
verificationSchema.index({ isFullyVerified: 1 });

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;
