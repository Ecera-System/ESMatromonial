import { API_BASE_URL } from "../config/config";
console.log(API_BASE_URL);

// Get verification status for a user
export const getVerificationStatus = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/status/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting verification status:", error);
    throw error;
  }
};

// Send email verification
export const sendEmailVerification = async (userId, email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/email/send/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
};

// Verify email with token
export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/email/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

// Send phone verification OTP
export const sendPhoneVerification = async (userId, phoneNumber) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/phone/send/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ phoneNumber }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending phone verification:", error);
    throw error;
  }
};

// Verify phone OTP
export const verifyPhoneOTP = async (userId, otp) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/phone/verify/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ otp }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying phone OTP:", error);
    throw error;
  }
};

// Upload Aadhaar document
export const uploadAadhaarDocument = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append("aadhaar", file);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/aadhaar/upload/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading Aadhaar document:", error);
    throw error;
  }
};

// Verify Aadhaar document
export const verifyAadhaarDocument = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/aadhaar/verify/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying Aadhaar document:", error);
    throw error;
  }
};

// Send Aadhaar verification OTP
export const sendAadhaarOTP = async (userId, mobileNumber) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/aadhaar/otp/send/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mobileNumber }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending Aadhaar OTP:", error);
    throw error;
  }
};

// Verify Aadhaar OTP
export const verifyAadhaarOTP = async (userId, otp) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/aadhaar/otp/verify/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ otp }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying Aadhaar OTP:", error);
    throw error;
  }
};

// Get all verifications (admin only)
export const getAllVerifications = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/admin/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting all verifications:", error);
    throw error;
  }
};

// Admin verify a user
export const adminVerifyUser = async (verificationId, adminId, notes) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/verification/admin/verify/${verificationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ adminId, notes }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error admin verifying user:", error);
    throw error;
  }
};
