import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import Overview from "./Overview";
import UserManagement from "./UserManagement";
import Reports from "./Reports";
import Analytics from "./Analytics";
import EmailCampaigns from "./EmailCampaigns";
import Settings from "./Settings";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Routes>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/campaigns" element={<EmailCampaigns />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}
