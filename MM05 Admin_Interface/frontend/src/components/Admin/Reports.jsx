import React from "react";

export default function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Reports & Notifications</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Reported User</th>
            <th className="p-3 text-left">Reporter</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Timestamp</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">Rama krishnan</td>
            <td className="p-3">Saloni tara</td>
            <td className="p-3">Abusive Message</td>
            <td className="p-3">2025-07-09 10:16</td>
            <td className="p-3 space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">View Profile</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">Disable</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
