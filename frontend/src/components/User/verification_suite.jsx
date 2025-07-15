// UserVerificationDashboard.jsx
import React, { useState, useEffect } from "react";
import { CheckCircle, Upload, X, Loader2 } from "lucide-react";
import BackButton from "../BackButton";
import { useAuth } from "../../contexts/Chat/AuthContext";
import {
  getVerificationStatus,
  sendEmailVerification,
  sendPhoneVerification,
  verifyPhoneOTP,
  uploadAadhaarDocument,
  verifyAadhaarDocument,
  sendAadhaarOTP,
  verifyAadhaarOTP,
} from "../../services/verificationService";

export default function UserVerificationDashboard() {
  const { user, setUser } = useAuth();
  const [toast, setToast] = useState("");
  const [step, setStep] = useState("welcome");
  const [loading, setLoading] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [aadhaarMobile, setAadhaarMobile] = useState("");
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
    aadhar: false,
  });

  // Load verification status on component mount
  useEffect(() => {
    if (user?._id) {
      loadVerificationStatus();
    }
  }, [user]);

  const loadVerificationStatus = async () => {
    try {
      const response = await getVerificationStatus(user._id);
      if (response.success) {
        setVerificationStatus({
          email: response.verification.emailVerified,
          phone: response.verification.phoneVerified,
          aadhar: response.verification.aadhaarVerified,
        });
      }
    } catch (error) {
      console.error("Error loading verification status:", error);
    }
  };

  const showToast = (message, type = "success") => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleEmailVerification = async () => {
    if (!email) {
      showToast("Please enter your email address", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await sendEmailVerification(user._id, email);
      if (response.success) {
        showToast("Verification email sent successfully");
        setVerificationStatus((prev) => ({ ...prev, email: true }));
        setStep("phone");
      } else {
        showToast(
          response.message || "Failed to send verification email",
          "error"
        );
      }
    } catch (error) {
      showToast("Error sending verification email", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerification = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      showToast("Please enter a valid 10-digit phone number", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await sendPhoneVerification(user._id, phoneNumber);
      if (response.success) {
        showToast("OTP sent successfully");
        setStep("phone-otp");
      } else {
        showToast(response.message || "Failed to send OTP", "error");
      }
    } catch (error) {
      showToast("Error sending OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyPhoneOTP(user._id, otp);
      if (response.success) {
        showToast("Phone number verified successfully");
        setVerificationStatus((prev) => ({ ...prev, phone: true }));
        setStep("aadhar-upload");
      } else {
        showToast(response.message || "Invalid OTP", "error");
      }
    } catch (error) {
      showToast("Error verifying OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarUpload = async () => {
    if (!aadhaarFile) {
      showToast("Please select a file to upload", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await uploadAadhaarDocument(user._id, aadhaarFile);
      if (response.success) {
        showToast("Aadhaar document uploaded successfully");
        setStep("aadhar-verify");
      } else {
        showToast(response.message || "Failed to upload document", "error");
      }
    } catch (error) {
      showToast("Error uploading document", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarVerification = async () => {
    setLoading(true);
    try {
      const response = await verifyAadhaarDocument(user._id);
      if (response.success) {
        setAadhaarData(response.aadhaarData);
        showToast("Aadhaar verified successfully");
        setVerificationStatus((prev) => ({ ...prev, aadhar: true }));
        setStep("aadhar-mobile");
      } else {
        showToast(response.message || "Aadhaar verification failed", "error");
      }
    } catch (error) {
      showToast("Error verifying Aadhaar", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarOTPSend = async () => {
    if (!aadhaarMobile || aadhaarMobile.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await sendAadhaarOTP(user._id, aadhaarMobile);
      if (response.success) {
        showToast("Aadhaar OTP sent successfully");
        setStep("aadhar-otp");
      } else {
        showToast(response.message || "Failed to send Aadhaar OTP", "error");
      }
    } catch (error) {
      showToast("Error sending Aadhaar OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyAadhaarOTP(user._id, otp);
      if (response.success) {
        showToast("Aadhaar OTP verified successfully");
        setVerificationStatus((prev) => ({ ...prev, aadhar: true }));
        // Fetch latest user info from backend
        await refreshUser();
        setStep("welcome");
      } else {
        showToast(response.message || "Invalid OTP", "error");
      }
    } catch (error) {
      showToast("Error verifying Aadhaar OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh user state from backend
  const refreshUser = async () => {
    try {
      const res = await fetch(`/api/v1/users/${user._id}`);
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      // ignore
    }
  };

  const verificationSteps = [
    {
      id: "email",
      label: "Email Verification",
      completed: verificationStatus.email,
    },
    {
      id: "phone",
      label: "Phone Number Verification",
      completed: verificationStatus.phone,
    },
    {
      id: "aadhar",
      label: "Aadhaar Verification",
      completed: verificationStatus.aadhar,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row p-4 sm:p-6 lg:p-8">
      <div className="absolute top-4 left-4 z-20">
        <BackButton />
      </div>
      <aside className="w-full md:w-1/4 md:pr-4 md:border-r md:border-gray-200 dark:border-gray-700 relative mb-6 md:mb-0">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Verification Steps
        </h2>
        <ul className="space-y-4">
          {verificationSteps.map(({ id, label, completed }) => (
            <li
              key={id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setStep(id === "aadhar" ? "aadhar-upload" : id)}
            >
              <span
                className={`text-base sm:text-lg ${
                  step.startsWith(id)
                    ? "text-orange-600 dark:text-orange-400 font-semibold underline"
                    : "text-gray-700 dark:text-gray-300"
                } hover:underline`}
              >
                {label}
              </span>
              {completed && <CheckCircle className="text-green-500 w-5 h-5" />}
            </li>
          ))}
        </ul>
        <div className="mt-6 md:absolute md:bottom-6 md:right-6 md:w-full md:pr-4">
          <button
            onClick={() => setStep("documents")}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base"
          >
            View Uploaded Documents
          </button>
        </div>
      </aside>

      <main className="w-full md:w-3/4 flex items-center justify-center relative animate-slide-up">
        <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg shadow-lg rounded-3xl p-6 sm:p-10 w-full max-w-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 ease-in-out animate-fade-in">
          {step === "welcome" && (
            <div className="text-center space-y-4 animate-slide-up">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Welcome to the मन Verification Suite
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Get verified to increase your profile credibility and improve
                match quality.
              </p>
              <button
                onClick={() => setStep("email")}
                className="mt-4 py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base"
              >
                Start Verification
              </button>
            </div>
          )}

          {step === "email" && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">
                Email Verification
              </h1>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your email address"
              />
              <button
                onClick={handleEmailVerification}
                disabled={loading}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Verification Email"
                )}
              </button>
            </div>
          )}

          {step === "phone" && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">
                Phone Number Verification
              </h1>
              <input
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your phone number"
              />
              <button
                onClick={handlePhoneVerification}
                disabled={loading}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}

          {step === "phone-otp" && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">
                Enter OTP
              </h1>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Enter the 6-digit OTP sent to {phoneNumber}
              </p>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-lg tracking-widest"
                placeholder="000000"
              />
              <button
                onClick={handlePhoneOTPVerification}
                disabled={loading}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}

          {step === "aadhar-upload" && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">
                Aadhaar Verification
              </h1>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload Aadhaar (PDF or Image)
              </label>
              <input
                type="file"
                accept=".pdf, image/*"
                onChange={(e) => setAadhaarFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAadhaarUpload}
                disabled={loading || !aadhaarFile}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload & Continue"
                )}
              </button>
            </div>
          )}

          {step === "aadhar-verify" && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">
                Verify Aadhaar Document
              </h1>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                We'll now scan and verify your Aadhaar document using secure OCR
                technology.
              </p>
              <button
                onClick={handleAadhaarVerification}
                disabled={loading}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Scan & Verify"
                )}
              </button>
            </div>
          )}

          {step === "aadhar-mobile" && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">
                Enter Mobile Linked to Aadhaar
              </h1>
              {aadhaarData && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Aadhaar Number: {aadhaarData.uid}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Name: {aadhaarData.name}
                  </p>
                </div>
              )}
              <input
                type="tel"
                maxLength={10}
                value={aadhaarMobile}
                onChange={(e) => setAadhaarMobile(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your mobile number"
              />
              <button
                onClick={handleAadhaarOTPSend}
                disabled={
                  loading || !aadhaarMobile || aadhaarMobile.length !== 10
                }
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}

          {step === "aadhar-otp" && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white">
                OTP Verification
              </h1>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Enter the 6-digit OTP sent to {aadhaarMobile}
              </p>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-lg tracking-widest"
                placeholder="000000"
              />
              <button
                onClick={handleAadhaarOTPVerification}
                disabled={loading || !otp || otp.length !== 6}
                className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md text-sm sm:text-base flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Didn&apos;t get OTP?{" "}
                <button
                  onClick={handleAadhaarOTPSend}
                  className="text-orange-500 dark:text-orange-400 hover:underline"
                >
                  Resend
                </button>
              </p>
            </div>
          )}

          {step === "documents" && (
            <div className="space-y-6 text-center animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Uploaded Documents
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Your uploaded documents will appear here.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 py-4 px-6 rounded-lg text-sm text-gray-500 dark:text-gray-400">
                (Mock preview area for documents)
              </div>
              <button
                onClick={() => setStep("welcome")}
                className="mt-4 py-2 px-6 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
            This information is securely processed for user safety. We do not
            store Aadhaar data.
          </p>
        </div>

        {toast && (
          <div
            className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl text-sm shadow-lg animate-fade-in ${
              toast.includes("error") ||
              toast.includes("failed") ||
              toast.includes("Invalid")
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {toast}
          </div>
        )}

        {verificationStatus.email &&
          verificationStatus.phone &&
          verificationStatus.aadhar && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-green-100 dark:bg-green-900 border border-green-400 text-green-800 dark:text-green-200 px-4 py-2 rounded-xl shadow-md animate-fade-in">
              <CheckCircle className="w-5 h-5" />
              <span>Profile Verified</span>
            </div>
          )}

        <button
          onClick={() => document.documentElement.classList.toggle("dark")}
          className="absolute top-4 left-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-sm px-3 py-1 rounded-md shadow-md text-gray-900 dark:text-gray-100"
        >
          Toggle Theme
        </button>
      </main>
    </div>
  );
}
