import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useTheme } from "../contexts/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userProfile, setUserProfile] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showManagePlan, setShowManagePlan] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [profileRes, plansRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`, config),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/subscription/plans`
          ),
        ]);

        setUserProfile(profileRes.data.user);
        setSubscriptionPlans(Array.isArray(plansRes.data) ? plansRes.data : []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch settings");
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/change-password`,
        passwordData,
        config
      );
      alert("Password changed successfully");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to change password");
    }
  };

  const handlePlanUpgrade = async (planId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/subscription/payment/order`,
        { planId },
        config
      );
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "ESMatrimonial",
        description: `Upgrade to ${data.plan.name}`,
        order_id: data.order.id,
        handler: async (response) => {
          await axios.post(
            `${import.meta.env.VITE_API_URL}api/v1/subscription/payment/verify`,
            response,
            config
          );
          alert("Plan upgraded successfully");
          // Refresh user profile
          const profileRes = await axios.get("/api/v1/users/me", config);
          setUserProfile(profileRes.data.user);
        },
        prefill: {
          name: `${userProfile.firstName} ${userProfile.lastName}`,
          email: userProfile.email,
          contact: userProfile.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to upgrade plan");
    }
  };

  const handleSave = async (section) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let url = "";
      let data = {};

      switch (section) {
        case "privacy":
          url = `${import.meta.env.VITE_API_URL}/api/v1/users/privacy-settings`;
          data = userProfile.privacy;
          break;
        case "notifications":
          url = `${import.meta.env.VITE_API_URL}/api/v1/notifications/settings`;
          data = userProfile.notificationSettings;
          break;
        default:
          return;
      }

      await axios.put(url, data, config);
      alert(`${section} settings saved successfully`);
    } catch (err) {
      alert(err.response?.data?.error || `Failed to save ${section} settings`);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/users/delete-account`,
          config
        );
        alert("Account deleted successfully");
        localStorage.removeItem("token");
        navigate("/signup");
      } catch (err) {
        alert(err.response?.data?.error || "Failed to delete account");
      }
    }
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg transition-all duration-300 ${
        activeTab === id
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
          : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      className={`min-h-screen py-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
      }`}
    >
      {/* Manage Plan Modal */}
      {showManagePlan && userProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
              onClick={() => setShowManagePlan(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Manage Your Subscription
            </h2>
            <div className="mb-4">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {userProfile.subscription.planName || "Free Plan"}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Status:{" "}
                {userProfile.subscription.isActive ? "Active" : "Inactive"}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Expires on:{" "}
                {userProfile.subscription?.expiresAt
                  ? new Date(
                      userProfile.subscription.expiresAt
                    ).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Features:
              </h3>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm">
                {userProfile.subscription?.features &&
                userProfile.subscription.features.length > 0 ? (
                  userProfile.subscription.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))
                ) : (
                  <li>Standard access to platform features</li>
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                onClick={() => {
                  setShowManagePlan(false);
                  navigate("/plans");
                  setActiveTab("subscription");
                }}
              >
                Upgrade / Change Plan
              </button>
              <button
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                onClick={() =>
                  window.open("mailto:matromatch@ecerasystem.com", "_blank")
                }
              >
                Contact Support
              </button>
              {/* Uncomment below if you want to allow cancelation */}
              {/* <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-all duration-300">Cancel Subscription</button> */}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your profile, subscription, and privacy settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <nav className="space-y-2">
                <TabButton
                  id="profile"
                  label="Profile Settings"
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  }
                />
                <TabButton
                  id="security"
                  label="Security"
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  }
                />
                <TabButton
                  id="subscription"
                  label="Subscription"
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  }
                />
                <TabButton
                  id="privacy"
                  label="Privacy"
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  }
                />
                <TabButton
                  id="notifications"
                  label="Notifications"
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  }
                />
                <TabButton
                  id="support"
                  label="Support"
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Profile Settings
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={`${userProfile.firstName} ${userProfile.lastName}`}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-100 dark:bg-gray-700 dark:text-white"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-100 dark:bg-gray-700 dark:text-white"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userProfile.phone}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-100 dark:bg-gray-700 dark:text-white"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={userProfile.privacy.profileVisibility}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 dark:text-white"
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            privacy: {
                              ...userProfile.privacy,
                              profileVisibility: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="public">Public</option>
                        <option value="premium-only">
                          Premium Members Only
                        </option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Visibility
                      </label>
                      <select
                        value={userProfile.privacy.contactVisibility}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 dark:text-white"
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            privacy: {
                              ...userProfile.privacy,
                              contactVisibility: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="premium-only">
                          Premium Members Only
                        </option>
                        <option value="verified-only">
                          Verified Members Only
                        </option>
                        <option value="all">All Members</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end"></div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Security Settings
                </h2>

                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Password
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Last changed 3 months ago
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setShowChangePassword(!showChangePassword)
                        }
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  {showChangePassword && (
                    <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Change Password
                      </h4>
                      <form
                        onSubmit={handlePasswordSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300"
                          >
                            Update Password
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowChangePassword(false)}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300">
                      Enable 2FA
                    </button>
                  </div> */}
                </div>
              </div>
            )}

            {/* Subscription Plans */}
            {activeTab === "subscription" &&
              userProfile &&
              subscriptionPlans && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Subscription Plans
                  </h2>

                  <div className="mb-8 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Current Plan
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {userProfile.subscription.planName}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Expires on{" "}
                          {userProfile.subscription?.expiresAt
                            ? new Date(
                                userProfile.subscription.expiresAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <button
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                        onClick={() => setShowManagePlan(true)}
                      >
                        Manage Plan
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                          plan._id === userProfile.subscription.plan
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                        }`}
                      >
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            {plan.name}
                          </h3>
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                            {plan.price}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            per {plan.duration}
                          </p>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <svg
                                className="w-5 h-5 text-green-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handlePlanUpgrade(plan._id)}
                          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                            plan._id === userProfile.subscription.plan
                              ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105"
                          }`}
                          disabled={plan._id === userProfile.subscription.plan}
                        >
                          {plan._id === userProfile.subscription.plan
                            ? "Current Plan"
                            : "Upgrade Now"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Privacy Settings
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Profile Privacy
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">
                            Show Profile to
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Control who can see your profile
                          </p>
                        </div>
                        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white">
                          <option>Everyone</option>
                          <option>Premium Members Only</option>
                          <option>Verified Members Only</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">
                            Show Contact Info
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Control who can see your contact details
                          </p>
                        </div>
                        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white">
                          <option>Premium Members Only</option>
                          <option>Verified Members Only</option>
                          <option>After Connection</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Data Privacy
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">
                            Data Usage
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Allow us to use your data for better matches
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={userProfile.privacy.dataUsage}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                privacy: {
                                  ...userProfile.privacy,
                                  dataUsage: e.target.checked,
                                },
                              })
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">
                            Marketing Communications
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive promotional emails and offers
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={
                              userProfile.privacy.marketingCommunications
                            }
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                privacy: {
                                  ...userProfile.privacy,
                                  marketingCommunications: e.target.checked,
                                },
                              })
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => handleSave("privacy")}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Save Changes
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4">
                    Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-700 dark:text-red-300">
                          Delete Account
                        </h4>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-all duration-300"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Notification Settings
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900 dark:text-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-4">
                      Email Notifications
                    </h3>
                    <div className="space-y-4 dark:text-white">
                      {[
                        {
                          id: "new-matches",
                          label: "New Matches",
                          desc: "Get notified when you have new matches",
                        },
                        {
                          id: "messages",
                          label: "Messages",
                          desc: "Get notified when you receive new messages",
                        },
                        {
                          id: "profile-views",
                          label: "Profile Views",
                          desc: "Get notified when someone views your profile",
                        },
                        {
                          id: "connectionRequests",
                          label: "Connection Requests",
                          desc: "Get notified about new connection requests",
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center dark:text-white justify-between"
                        >
                          <div className="dark:text-white">
                            <h4 className=" dark:text-white font-medium text-gray-700">
                              {item.label}
                            </h4>
                            <p className="text-sm dark:text-white  text-gray-600">
                              {item.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={
                                userProfile.notificationSettings.email[item.id]
                              }
                              onChange={(e) =>
                                setUserProfile({
                                  ...userProfile,
                                  notificationSettings: {
                                    ...userProfile.notificationSettings,
                                    email: {
                                      ...userProfile.notificationSettings.email,
                                      [item.id]: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 border dark:bg-gray-900 border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-4">
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          id: "instantMessages",
                          label: "Instant Messages",
                          desc: "Get push notifications for new messages",
                        },
                        {
                          id: "matches",
                          label: "New Matches",
                          desc: "Get push notifications for new matches",
                        },
                        {
                          id: "reminders",
                          label: "Reminders",
                          desc: "Get reminders to check your account",
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex dark:text-white items-center justify-between"
                        >
                          <div>
                            <h4 className="font-medium dark:text-white text-gray-700">
                              {item.label}
                            </h4>
                            <p className="text-sm dark:text-white text-gray-600">
                              {item.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={
                                userProfile.notificationSettings.push[item.id]
                              }
                              onChange={(e) =>
                                setUserProfile({
                                  ...userProfile,
                                  notificationSettings: {
                                    ...userProfile.notificationSettings,
                                    push: {
                                      ...userProfile.notificationSettings.push,
                                      [item.id]: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleSave("notifications")}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Support */}
            {activeTab === "support" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Support & Help
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border dark:bg-gray-900 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Help Center
                      </h3>
                      <p className="text-blue-600 mb-4">
                        Browse frequently asked questions and guides
                      </p>
                      <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all duration-300">
                        Visit Help Center
                      </button>
                    </div>

                    <div className="bg-green-50 border dark:bg-gray-900 border-green-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Contact Support
                      </h3>
                      <p className="text-green-600 mb-4">
                        Get help from our support team
                      </p>
                      <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-all duration-300">
                        Contact Us
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 border dark:bg-gray-900 border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg dark:text-white font-semibold text-gray-800 mb-4">
                      Quick Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Terms of Service
                      </a>
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Privacy Policy
                      </a>
                      {/* <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Safety Guidelines
                      </a>
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Community Guidelines
                      </a>
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Success Stories
                      </a>
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Blog
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
