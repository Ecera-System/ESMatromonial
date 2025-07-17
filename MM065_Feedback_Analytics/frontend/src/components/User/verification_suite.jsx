// UserVerificationDashboard.jsx
import React, { useState } from "react";
import { CheckCircle, Upload, X, Menu } from "lucide-react";
import BackButton from "../BackButton";

export default function UserVerificationDashboard() {
  const [toast, setToast] = useState("");
  const [step, setStep] = useState("welcome");
  const [mockAadharNumber, setMockAadharNumber] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
    aadhar: false,
  });

  const handleMockOCR = () => {
    setMockAadharNumber("1234 5678 9012");
    setStep("aadhar-mobile");
  };

  const verificationSteps = [
    { id: "email", label: "Email Verification", completed: verificationStatus.email },
    { id: "phone", label: "Phone Number Verification", completed: verificationStatus.phone },
    { id: "aadhar", label: "Aadhaar Verification", completed: verificationStatus.aadhar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200">
        <BackButton />
        <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">Verification Suite</h1>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Desktop Back Button */}
        <div className="hidden md:block absolute top-4 left-4 z-20">
          <BackButton />
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setShowSidebar(false)}>
            <div className="bg-white w-full max-w-sm h-full p-4 sm:p-6 shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">Verification Steps</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {verificationSteps.map(({ id, label, completed }) => (
                  <li
                    key={id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setStep(id === "aadhar" ? "aadhar-upload" : id);
                      setShowSidebar(false);
                    }}
                  >
                    <span
                      className={`text-sm sm:text-base ${
                        step.startsWith(id) ? "text-orange-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </span>
                    {completed && <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setStep("documents");
                  setShowSidebar(false);
                }}
                className="mt-4 sm:mt-6 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base"
              >
                View Uploaded Documents
              </button>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-1/4 min-w-[250px] max-w-[300px] pr-4 pl-6 pt-16 border-r border-gray-200 relative">
          <h2 className="text-xl font-semibold mb-4">Verification Steps</h2>
          <ul className="space-y-4">
            {verificationSteps.map(({ id, label, completed }) => (
              <li
                key={id}
                className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setStep(id === "aadhar" ? "aadhar-upload" : id)}
              >
                <span
                  className={`${
                    step.startsWith(id) ? "text-orange-600 font-semibold underline" : "text-gray-700"
                  } hover:underline`}
                >
                  {label}
                </span>
                {completed && <CheckCircle className="text-green-500 w-5 h-5" />}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setStep("documents")}
            className="mt-6 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            View Uploaded Documents
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl border border-white/30 transition-all duration-500 ease-in-out">
            {step === "welcome" && (
              <div className="text-center space-y-4 animate-slide-up">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">Welcome to the मन Verification Suite</h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Get verified to increase your profile credibility and improve match quality.
                </p>
                <button
                  onClick={() => setStep("email")}
                  className="mt-4 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors w-full sm:w-auto text-sm sm:text-base"
                >
                  Start Verification
                </button>
              </div>
            )}

            {step === "email" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800">Email Verification</h1>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Enter your email address"
                />
                <button
                  onClick={() => {
                    setVerificationStatus((prev) => ({ ...prev, email: true }));
                    setStep("phone");
                    setToast("Email verified successfully");
                    setTimeout(() => setToast(""), 3000);
                  }}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base"
                >
                  Send Verification Email
                </button>
              </div>
            )}

            {step === "phone" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800">Phone Number Verification</h1>
                <input
                  type="tel"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Enter your phone number"
                />
                <button
                  onClick={() => {
                    setVerificationStatus((prev) => ({ ...prev, phone: true }));
                    setStep("aadhar-upload");
                    setToast("Phone number verified successfully");
                    setTimeout(() => setToast(""), 3000);
                  }}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base"
                >
                  Send OTP
                </button>
              </div>
            )}

            {step === "aadhar-upload" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800">Aadhaar Verification</h1>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Aadhaar (PDF or Image)
                </label>
                <input
                  type="file"
                  accept=".pdf, image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
                <button
                  onClick={handleMockOCR}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base"
                >
                  Scan & Continue
                </button>
              </div>
            )}

            {step === "aadhar-mobile" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800">Enter Mobile Linked to Aadhaar</h1>
                <input
                  type="text"
                  value={mockAadharNumber}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none text-sm sm:text-base"
                />
                <input
                  type="tel"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Enter your mobile number"
                  onChange={(e) => setManualPhone(e.target.value)}
                />
                <button
                  onClick={() => setStep("aadhar-otp")}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base"
                >
                  Send OTP
                </button>
              </div>
            )}

            {step === "aadhar-otp" && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800">OTP Verification</h1>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder={`Enter OTP sent to ${manualPhone}`}
                />
                <button
                  onClick={() => {
                    setVerificationStatus((prev) => ({ ...prev, aadhar: true }));
                    setToast("Aadhaar verified successfully");
                    setTimeout(() => setToast(""), 3000);
                  }}
                  className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base"
                >
                  Verify
                </button>
                <p className="text-sm text-center text-gray-500">
                  Didn&apos;t get OTP?{" "}
                  <a href="#" className="text-orange-500 hover:underline">
                    Resend
                  </a>
                </p>
              </div>
            )}

            {step === "documents" && (
              <div className="space-y-6 text-center animate-fade-in">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Uploaded Documents</h1>
                <p className="text-gray-600 text-sm sm:text-base">Your uploaded documents will appear here.</p>
                <div className="bg-gray-100 py-6 px-4 rounded-lg text-sm text-gray-500 min-h-[100px] flex items-center justify-center">
                  (Mock preview area for documents)
                </div>
                <button
                  onClick={() => setStep("welcome")}
                  className="mt-4 py-3 px-6 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base"
                >
                  Back to Dashboard
                </button>
              </div>
            )}

            <p className="text-xs sm:text-sm text-gray-500 mt-6 text-center">
              This information is securely processed for user safety. We do not store Aadhaar data.
            </p>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-3 rounded-xl text-sm shadow-lg animate-fade-in z-50 max-w-[90vw] text-center">
          {toast}
        </div>
      )}

      {/* Verification Status Badge */}
      {verificationStatus.email && verificationStatus.phone && verificationStatus.aadhar && (
        <div className="fixed top-4 right-4 flex items-center space-x-2 bg-green-100 border border-green-400 text-green-800 px-3 py-2 rounded-xl shadow-md animate-fade-in text-sm">
          <CheckCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Profile Verified</span>
          <span className="sm:hidden">Verified</span>
        </div>
      )}
    </div>
  );
}