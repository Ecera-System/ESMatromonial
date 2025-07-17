import React from "react";

export default function UserManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      <input
        type="text"
        placeholder="Search by username or email"
        className="border p-2 rounded mb-4 w-full md:w-1/2"
      />

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Gender</th>
            <th className="p-3 text-left">Premium</th>
            <th className="p-3 text-left">Last Active</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Replace with map of users */}
          <tr>
            <td className="p-3">pooja</td>
            <td className="p-3">pooja@gmail.com</td>
            <td className="p-3">Female</td>
            <td className="p-3">Yes</td>
            <td className="p-3">2025-07-01</td>
            <td className="p-3 space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">Disable</button>
              <button className="bg-green-500 text-white px-3 py-1 rounded">Email</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
