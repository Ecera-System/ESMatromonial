import React from "react";

export default function Analytics() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Analytics & Feedback</h1>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">User Signups Over Time</h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500">[Graph Placeholder]</div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">User Feedback</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Comment</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">pooja</td>
              <td className="p-3">⭐⭐⭐⭐</td>
              <td className="p-3">"Great experience!"</td>
              <td className="p-3">2025-06-28</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
