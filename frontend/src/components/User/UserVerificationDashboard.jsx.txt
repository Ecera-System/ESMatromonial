import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function UserVerificationDashboard() {
  const [toast, setToast] = useState("");
  const [step, setStep] = useState("welcome");
  const [mockAadharNumber, setMockAadharNumber] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
    aadhar: false,
  });

  const handleMockOCR = () => {
    setMockAadharNumber("1234 5678 9012");
    setStep("aadhar-mobile");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const verificationSteps = [
    { id: "email", label: "Email Verification", completed: verificationStatus.email },
    { id: "phone", label: "Phone Number Verification", completed: verificationStatus.phone },
    { id: "aadhar", label: "Aadhaar Verification", completed: verificationStatus.aadhar },
  ];

  const containerClasses = isDarkMode 
    ? "min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col md:flex-row p-6"
    : "min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col md:flex-row p-6";

  const cardClasses = isDarkMode
    ? "bg-gray-800/20 backdrop-blur-lg shadow-lg rounded-3xl p-10 w-full max-w-xl border border-gray-700/30 transition-all duration-500 ease-in-out"
    : "bg-white/20 backdrop-blur-lg shadow-lg rounded-3xl p-10 w-full max-w-xl border border-white/30 transition-all duration-500 ease-in-out";

  const textClasses = isDarkMode ? "text-gray-100" : "text-gray-800";
  const subtextClasses = isDarkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className={containerClasses}>
      {/* Sidebar */}
      <aside
        className={`hidden md:block w-1/4 pr-4 border-r ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        } relative`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${textClasses}`}>
          Verification Steps
        </h2>
        <ul className="space-y-6">
          {verificationSteps.map(({ id, label, completed }) => (
            <li
              key={id}
              className="cursor-pointer"
              onClick={() => setStep(id === "aadhar" ? "aadhar-upload" : id)}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`${
                    step.startsWith(id)
                      ? "text-orange-600 font-semibold underline"
                      : isDarkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  } hover:underline transition-colors`}
                >
                  {label}
                </span>
                {completed && <CheckCircle className="text-green-500 w-5 h-5" />}
              </div>
              <div
                className={`w-full h-2 mt-2 rounded-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-2 rounded-full ${
                    completed
                      ? "bg-green-500"
                      : isDarkMode
                      ? "bg-gray-500"
                      : "bg-gray-400"
                  } transition-all duration-500`}
                  style={{ width: completed ? "100%" : "0%" }}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-6 right-6 w-full pr-4">
          <button
            onClick={() => setStep("documents")}
            className="mt-6 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            View Uploaded Documents
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="w-full md:w-3/4 flex items-center justify-center relative">
        <div className={`${cardClasses} transform transition-all duration-500 opacity-100 translate-y-0`}>
          {step === "welcome" && (
            <div className="text-center space-y-4">
              <h1 className={`text-3xl font-bold ${textClasses}`}>Welcome to the मन Verification Suite</h1>
              <p className={subtextClasses}>
                Get verified to increase your profile credibility and improve match quality.
              </p>
              <button
                onClick={() => setStep("email")}
                className="mt-4 py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Start Verification
              </button>
            </div>
          )}

          {step === "email" && (
            <div className="space-y-6">
              <h1 className={`text-2xl font-bold text-center ${textClasses}`}>Email Verification</h1>
              <input
                type="email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter your email address"
              />
              <button
                onClick={() => {
                  setVerificationStatus((prev) => ({ ...prev, email: true }));
                  setStep("phone");
                  setToast("Email verified successfully");
                  setTimeout(() => setToast(""), 3000);
                }}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Send Verification Email
              </button>
            </div>
          )}

          {step === "phone" && (
            <div className="space-y-6">
              <h1 className={`text-2xl font-bold text-center ${textClasses}`}>Phone Number Verification</h1>
              <input
                type="tel"
                maxLength={10}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter your phone number"
              />
              <button
                onClick={() => {
                  setVerificationStatus((prev) => ({ ...prev, phone: true }));
                  setStep("aadhar-upload");
                  setToast("Phone number verified successfully");
                  setTimeout(() => setToast(""), 3000);
                }}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Send OTP
              </button>
            </div>
          )}

          {step === "aadhar-upload" && (
            <div className="space-y-6">
              <h1 className={`text-2xl font-bold text-center ${textClasses}`}>Aadhaar Verification</h1>
              <label className={`block text-sm font-medium mb-1 ${subtextClasses}`}>
                Upload Aadhaar (PDF or Image)
              </label>
              <input
                type="file"
                accept=".pdf, image/*"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <button
                onClick={handleMockOCR}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Scan & Continue
              </button>
            </div>
          )}

          {step === "aadhar-mobile" && (
            <div className="space-y-6">
              <h1 className={`text-2xl font-bold text-center ${textClasses}`}>Enter Mobile Linked to Aadhaar</h1>
              <input
                type="text"
                value={mockAadharNumber}
                readOnly
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  isDarkMode
                    ? "bg-gray-600 border-gray-600 text-gray-100"
                    : "bg-gray-100 border-gray-300 text-gray-900"
                }`}
              />
              <input
                type="tel"
                maxLength={10}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter your mobile number"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
              />
              <button
                onClick={() => setStep("aadhar-otp")}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Send OTP
              </button>
            </div>
          )}

          {step === "aadhar-otp" && (
            <div className="space-y-6">
              <h1 className={`text-2xl font-bold text-center ${textClasses}`}>OTP Verification</h1>
              <input
                type="text"
                maxLength={6}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder={`Enter OTP sent to ${manualPhone}`}
              />
              <button
                onClick={() => {
                  setVerificationStatus((prev) => ({ ...prev, aadhar: true }));
                  setToast("Aadhaar verified successfully");
                  setTimeout(() => setToast(""), 3000);
                }}
                className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Verify
              </button>
              <p className={`text-sm text-center ${subtextClasses}`}>
                Didn't get OTP?{" "}
                <button
                  className="text-orange-500 hover:underline transition-colors"
                  onClick={() => setToast("OTP resent successfully")}
                >
                  Resend
                </button>
              </p>
            </div>
          )}

          {step === "documents" && (
            <div className="space-y-6 text-center">
              <h1 className={`text-2xl font-bold ${textClasses}`}>Uploaded Documents</h1>
              <p className={subtextClasses}>Your uploaded documents will appear here.</p>
              <div className={`py-4 px-6 rounded-lg text-sm ${
                isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
              }`}>
                (Mock preview area for documents)
              </div>
              <button
                onClick={() => setStep("welcome")}
                className="mt-4 py-2 px-6 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          <p className={`text-sm mt-6 text-center ${subtextClasses}`}>
            This information is securely processed for user safety. We do not store Aadhaar data.
          </p>
        </div>

        {toast && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 transition-all duration-300 opacity-100">
            {toast}
          </div>
        )}

        {verificationStatus.email && verificationStatus.phone && verificationStatus.aadhar && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-xl shadow-md transition-all duration-300 opacity-100">
            <CheckCircle className="w-5 h-5" />
            <span>Profile Verified</span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className={`absolute top-4 left-4 px-3 py-1 rounded-md shadow-md text-sm transition-colors ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
              : "bg-gray-200 hover:bg-gray-300 text-gray-900"
          }`}
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </main>
    </div>
  );
}
