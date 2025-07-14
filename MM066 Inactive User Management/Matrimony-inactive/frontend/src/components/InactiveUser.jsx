import React, { useState } from "react";
import narendraImg from "../assets/user-1.png";
import tanmayImg from "../assets/user-2.png";
import amitImg from "../assets/user-3.png";
import sakshiImg from "../assets/user-4.png";

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

export default function InactiveUser() {
  const [selectedDays, setSelectedDays] = useState("1");
  const [actions, setActions] = useState({});

  const today = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(today.getDate() - Number(selectedDays));

  const filteredAndSortedUsers = [...users]
    .filter((user) => {
      const [day, month, year] = user.lastActive.split("-").map(Number);
      const lastActiveDate = new Date(year, month - 1, day);
      return lastActiveDate < cutoffDate; // Users inactive for more than selected days
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

  return (
    <div className="max-w-4xl mt-5 mx-auto bg-sky-50 p-6 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Inactive User Management
      </h1>

      <div className="mb-6 text-center">
        <label className="text-black-700 font-bold mr-2">
          Show users inactive for more than:
        </label>
        <select
          className="px-3 py-2 rounded-md border text-sm hover:bg-gray-100"
          value={selectedDays}
          onChange={(e) => setSelectedDays(e.target.value)}
        >
          <option className="text-gray-700 font-bold" value="1">Select</option>
          <option value="7">7 days</option>
          <option value="15">15 days</option>
          <option value="30">30 days</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-gray-50 shadow">
        <table className="w-full text-sm text-left min-w-[700px]">
          <thead className="bg-sky-100 text-center">
            <tr>
              <th className="p-3 font-bold">Username</th>
              <th className="p-3 font-bold">Email</th>
              <th className="p-3 font-bold">Last Active</th>
              <th className="p-3 font-bold">Status</th>
              <th className="p-3 font-bold">Action</th>
              <th className="p-3 font-bold">Notify</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={user.photo}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-black-700 font-bold">
                    {user.username}
                  </span>
                </td>
                <td className="p-3 text-black-700 ">{user.email}</td>
                <td className="p-3 text-black-700 ">{user.lastActive}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition duration-200 cursor-pointer ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
                        : "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    className="px-2 py-1 border rounded-md text-sm"
                    value={actions[user.id] || ""}
                    onChange={(e) => handleActionChange(user.id, e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="cleanup">Cleanup</option>
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleSendEmail(user)}
                    className="text-orange-600 hover:text-orange-800 text-xl"
                    title="Send Reminder Email"
                  >
                    📧
                  </button>
                </td>
              </tr>
            ))}
            {filteredAndSortedUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No inactive users found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
