// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// App Configuration
export const APP_CONFIG = {
  name: "ES Matrimonial",
  version: "1.0.0",
  description: "A modern matrimonial platform",
};

// Verification Configuration
export const VERIFICATION_CONFIG = {
  emailVerificationExpiry: 24 * 60 * 60 * 1000, // 24 hours
  phoneVerificationExpiry: 10 * 60 * 1000, // 10 minutes
  aadhaarVerificationExpiry: 10 * 60 * 1000, // 10 minutes
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableAadhaarVerification: true,
  enablePhoneVerification: true,
  enableEmailVerification: true,
  enableAdminVerification: true,
};
