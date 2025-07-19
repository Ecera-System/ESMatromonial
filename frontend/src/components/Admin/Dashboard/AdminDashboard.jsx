import React, { useState, useEffect } from "react";
import {
  getTotalUsers,
  getMaleUsers,
  getFemaleUsers,
  getPremiumUsers,
  getRecentUsers,
  searchUsersAdmin,
} from "../../../services/adminService";
import {
  Users,
  UserCheck2,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  Crown,
  Menu,
  X,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  UserX,
  AlertTriangle,
  Star,
  UserMinus,
  Tag,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import AdminFeedbackPage from "../../../pages/AdminFeedbackPage";
import InactiveUser from "../InactiveUser/InactiveUser";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [totalUsers, setTotalUsers] = useState(0);
  const [maleUsers, setMaleUsers] = useState(0);
  const [femaleUsers, setFemaleUsers] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          total,
          male,
          female,
          premium,
          recent,
        ] = await Promise.all([
          getTotalUsers(),
          getMaleUsers(),
          getFemaleUsers(),
          getPremiumUsers(),
          getRecentUsers(),
        ]);
        setTotalUsers(total);
        setMaleUsers(male);
        setFemaleUsers(female);
        setPremiumUsers(premium);
        setRecentUsers(recent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim() !== "") {
        setSearchLoading(true);
        try {
          const users = await searchUsersAdmin(searchTerm);
          setSearchedUsers(users);
        } catch (error) {
          console.error("Error searching users:", error);
          setSearchedUsers([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchedUsers([]);
      }
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      change: "+12%", // Placeholder, implement actual change calculation if needed
    },
    {
      title: "Female Users",
      value: femaleUsers.toLocaleString(),
      icon: UserCheck2,
      color: "bg-green-500",
      change: "+8%", // Placeholder
    },
    {
      title: "Total Premium Users",
      value: premiumUsers.toLocaleString(),
      icon: Crown,
      color: "bg-purple-500",
      change: "+25%", // Placeholder
    },
    {
      title: "Male Users",
      value: maleUsers.toLocaleString(),
      icon: User,
      color: "bg-red-500",
      change: "-5%", // Placeholder
    },
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    // { id: 'users', label: 'User Management', icon: Users },
    // { id: 'feedback', label: 'Feedback', icon: Star },
    // { id: 'coupons', label: 'Coupon Management', icon: Tag },
    // { id: 'reports', label: 'Reports', icon: AlertTriangle },
    // { id: 'inactive-users', label: 'Inactive User Management', icon: UserMinus },
    // { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    // Clear admin data from localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    // Navigate to admin sign-in page
    navigate("/admin/signin", { replace: true });
  };

  const handleNavigation = (itemId) => {
    setActiveTab(itemId);
    setSidebarOpen(false);

    // Navigate to separate pages for all admin sections
    if (itemId === "feedback") {
      navigate("/admin/feedback");
    } else if (itemId === "inactive-users") {
      navigate("/admin/inactive-users");
    } else if (itemId === "coupons") {
      navigate("/admin/coupons");
    } else if (itemId === "users") {
      navigate("/admin/users");
    } else if (itemId === "reports") {
      navigate("/admin/reports");
    } else if (itemId === "settings") {
      navigate("/admin/settings");
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Mobile Header */}
      <div
        className={`lg:hidden ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-b px-4 py-3 flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-indigo-600" />
            <h1
              className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Panel
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            className={`p-2 rounded-lg ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } relative`}
          >
            <Bell
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border-r transition-transform duration-300 ease-in-out`}
        >
          {/* Sidebar Header */}
          <div
            className={`hidden lg:flex items-center justify-between p-6 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } border-b`}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Admin Panel
              </h1>
            </div>
          </div>

          {/* Mobile Sidebar Header */}
          <div
            className={`lg:hidden flex items-center justify-between p-4 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } border-b`}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Admin Panel
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 rounded-lg ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 flex-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? isDarkMode
                      ? "bg-indigo-900 text-indigo-300 border-r-2 border-indigo-500"
                      : "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Theme Toggle and Logout */}
          <div
            className={`p-4 space-y-2 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } border-t`}
          >
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="font-medium">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div
            className={`hidden lg:block ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-b px-6 py-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } capitalize`}
                >
                  {activeTab}
                </h2>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Manage your matrimonial platform
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-400"
                    } w-5 h-5`}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`pl-10 pr-4 py-2 border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  className={`p-2 rounded-lg ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } relative`}
                >
                  <Bell
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsCards.map((card, index) => (
                    <div
                      key={index}
                      className={`${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } rounded-xl p-6 border hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            } font-medium`}
                          >
                            {card.title}
                          </p>
                          <p
                            className={`text-2xl font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            } mt-1`}
                          >
                            {card.value}
                          </p>
                        </div>
                        <div className={`${card.color} p-3 rounded-lg`}>
                          <card.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <span className="text-sm font-medium text-green-600">
                          {card.change}
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } ml-2`}
                        >
                          vs last month
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recently Registered Users and Search - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recently Registered Users */}
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } rounded-xl border`}
                  >
                    <div
                      className={`p-6 ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } border-b`}
                    >
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Recently Registered Users
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentUsers.map((user) => (
                          <div
                            key={user._id}
                            className={`flex items-center space-x-4 p-4 ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-50"
                            } rounded-lg`}
                          >
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {user.firstName} {user.lastName}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {user.email}
                              </p>
                            </div>
                            <span
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Search Users */}
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } rounded-xl border`}
                  >
                    <div
                      className={`p-6 ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } border-b`}
                    >
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Search Users
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="relative">
                          <Search
                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                              isDarkMode ? "text-gray-400" : "text-gray-400"
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 border ${
                              isDarkMode
                                ? "border-gray-600 bg-gray-700 text-white"
                                : "border-gray-300 bg-white"
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                          />
                        </div>
                      </div>
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {searchLoading ? (
                          <div className="text-center py-4 text-gray-400 dark:text-gray-300">
                            Searching...
                          </div>
                        ) : searchedUsers.length > 0 ? (
                          searchedUsers.map((user) => (
                            <div
                              key={user._id}
                              className={`flex items-center space-x-4 p-4 ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-50"
                              } rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600`}
                              onClick={() => navigate(`/admin/users/${user._id}`)}
                            >
                              <div className="bg-indigo-100 p-2 rounded-full">
                                <User className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm font-medium ${
                                    isDarkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {user.firstName} {user.lastName}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {user.email}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="p-1 text-blue-600 hover:text-blue-800">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : searchTerm && !searchLoading ? (
                          <div className="text-center py-4">
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              No users found matching "{searchTerm}"
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Start typing to search for users.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                {/* User Management Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      User Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage all registered users
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <tr key={item} className="hover:bg-gray-50">
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    John Doe
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    john@example.com
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500">
                              Dec 15, 2023
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button className="p-1 text-blue-600 hover:text-blue-800">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-red-600 hover:text-red-800">
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Render Feedback component */}
            {activeTab === "feedback" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <AdminFeedbackPage />
              </div>
            )}

            {/* Render Inactive Users component */}
            {activeTab === "inactive-users" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <InactiveUser />
              </div>
            )}

            {/* Other tabs content */}
            {!["overview", "users", "feedback", "inactive-users"].includes(
              activeTab
            ) && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Settings className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600">
                  This section is under development
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
