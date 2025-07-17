import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { path: "/admin/dashboard", label: "Overview" },
  { path: "/admin/users", label: "User Management" },
  { path: "/admin/reports", label: "Reports" },
  { path: "/admin/analytics", label: "Analytics" },
  { path: "/admin/campaigns", label: "Email Campaigns" },
  { path: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-2 rounded hover:bg-gray-700 ${
              location.pathname === link.path ? "bg-gray-700" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
