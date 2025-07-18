import React, { useState } from "react";
import AdminLayout from '../AdminLayout';
import { UserMinus, Mail, Filter, Search, Download, Calendar, User, RefreshCw } from 'lucide-react';
import narendraImg from "../../../assets/InactiveUser/user-1.png";
import tanmayImg from "../../../assets/InactiveUser/user-2.png";
import amitImg from "../../../assets/InactiveUser/user-3.png";
import sakshiImg from "../../../assets/InactiveUser/user-4.png";

const users = [
  {
    id: 1,
    username: "Narendra Khamkar",
    email: "narendra@gmail.com",
    lastActive: "9-4-2025",
    status: "Inactive",
    photo: narendraImg,
  },
  {
    id: 2,
    username: "Tanmay Nagawade",
    email: "tanmay@gmail.com",
    lastActive: "18-6-2025",
    status: "Inactive",
    photo: tanmayImg,
  },
  {
    id: 3,
    username: "Amit M",
    email: "amit@gmail.com",
    lastActive: "22-6-2025",
    status: "Inactive",
    photo: amitImg,
  },
  {
    id: 4,
    username: "Sakshi K",
    email: "sakshi@gmail.com",
    lastActive: "5-7-2025",
    status: "Inactive",
    photo: sakshiImg,
  },
];

function InactiveUserContent() {
  const [selectedDays, setSelectedDays] = useState("1");
  const [actions, setActions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const today = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(today.getDate() - Number(selectedDays));

  const filteredAndSortedUsers = [...users]
    .filter((user) => {
      const [day, month, year] = user.lastActive.split("-").map(Number);
      const lastActiveDate = new Date(year, month - 1, day);
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return lastActiveDate < cutoffDate && matchesSearch;
    })
    .sort((a, b) => {
      const [aDay, aMonth, aYear] = a.lastActive.split("-").map(Number);
      const [bDay, bMonth, bYear] = b.lastActive.split("-").map(Number);
      const dateA = new Date(aYear, aMonth - 1, aDay);
      const dateB = new Date(bYear, bMonth - 1, bDay);
      return dateA - dateB;
    });

  const handleActionChange = (userId, value) => {
    setActions((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSendEmail = (user) => {
    alert(`📧 Reminder email sent to ${user.email} to encourage account reactivation.`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Username', 'Email', 'Last Active', 'Status', 'Action'],
      ...filteredAndSortedUsers.map(user => [
        user.username,
        user.email,
        user.lastActive,
        user.status,
        actions[user.id] || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inactive-users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getInactiveStats = () => {
    const stats = {
      week: users.filter(user => {
        const [day, month, year] = user.lastActive.split("-").map(Number);
        const lastActiveDate = new Date(year, month - 1, day);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return lastActiveDate < weekAgo;
      }).length,
      month: users.filter(user => {
        const [day, month, year] = user.lastActive.split("-").map(Number);
        const lastActiveDate = new Date(year, month - 1, day);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return lastActiveDate < monthAgo;
      }).length,
      total: users.length
    };
    return stats;
  };

  const stats = getInactiveStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inactive User Management</h2>
          <p className="text-gray-600">Monitor and manage users who haven't been active recently</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-yellow-600 font-medium">7+ Days</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.week}</h3>
          <p className="text-sm text-gray-600 mt-1">Inactive for 7+ days</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-orange-100 rounded-lg">
              <UserMinus className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-orange-600 font-medium">30+ Days</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.month}</h3>
          <p className="text-sm text-gray-600 mt-1">Inactive for 30+ days</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-100 rounded-lg">
              <User className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm text-red-600 font-medium">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.total}</h3>
          <p className="text-sm text-gray-600 mt-1">Total inactive users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">
              Inactive for more than:
            </label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedDays}
              onChange={(e) => setSelectedDays(e.target.value)}
            >
              <option value="1">Select period</option>
              <option value="7">7 days</option>
              <option value="15">15 days</option>
              <option value="30">30 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notify</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.photo}
                        alt={user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {user.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={actions[user.id] || ""}
                      onChange={(e) => handleActionChange(user.id, e.target.value)}
                    >
                      <option value="">Select action</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="cleanup">Cleanup</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSendEmail(user)}
                      className="flex items-center space-x-1 px-3 py-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Send Reminder Email"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedUsers.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <UserMinus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inactive users found</h3>
          <p className="text-gray-600">
            {selectedDays === "1" 
              ? "Please select a time period to view inactive users."
              : "No users match your current filters."
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default function InactiveUser() {
  return (
    <AdminLayout title="Inactive User Management">
      <InactiveUserContent />
    </AdminLayout>
  );
}
