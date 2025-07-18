import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InactiveUser() {
  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState({});
  const [days, setDays] = useState("10");

  useEffect(() => {
    axios
      .get("/api/users/inactive", { params: { days } })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [days]);

  const handleSelectChange = (id, value) => {
    setActions((prev) => ({ ...prev, [id]: value }));
    if (value === "follow-up") {
      toast.info(`Follow-up recorded.`); //.info use for showing info messages
    }
    if (value === "cleanup") {
      toast.info(`Cleanup selected. Click 🗑️ to delete ${users.find(u => u._id === id)?.firstName}'s Data.`);
    }
  };

  const sendFollowUpEmail = (id) => {
    axios
      .post(`/api/users/send-email/${id}`)
      .then(() => {
        toast.success("🖂 Follow-up email sent successfully!");
      })
      .catch((err) => {
        console.error("Error sending follow-up:", err);
        toast.error("Failed to send email.");
      });
  };

  const markForCleanup = (id) => {
    axios
      .post(`/api/users/action/${id}`, { action: "cleanup" })
      .then(() => {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== id)); // remove user from UI
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user.");
      });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-blue-50 min-h-screen rounded-3xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Inactive User Management
      </h1>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6 items-center">
        <label className="font-medium text-gray-700">
          Show users inactive for more than:
        </label>
        <select
          onChange={(e) => setDays(e.target.value)}
          value={days}
          className="px-4 py-2 border rounded-md text-sm bg-white shadow-sm"
        >
          <option value="10">10 days</option>
          <option value="15">15 days</option>
          <option value="30">30 days</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-green-50 shadow">
        <table className="w-full text-sm min-w-[900px] text-center">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Last Active</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
              <th className="p-4">Notify</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((u) => {
                const inactive =
                  new Date(u.lastActive) <
                  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

                return (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-4 text-gray-700">{u.email}</td>
                    <td className="p-4 font-semibold text-gray-800">
                      {new Date(u.lastActive).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          inactive
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {inactive ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        className="px-3 py-1 border rounded-md text-sm"
                        value={actions[u._id] || ""}
                        onChange={(e) =>
                          handleSelectChange(u._id, e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="cleanup">Cleanup</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {actions[u._id] === "follow-up" && (
                        <button
                          onClick={() => sendFollowUpEmail(u._id)}
                          title="Send Follow-up Email"
                          className="text-blue-600 hover:text-blue-800 text-xl"
                        >
                          🖂
                        </button>
                      )}
                      {actions[u._id] === "cleanup" && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this user?"
                              )
                            ) {
                              markForCleanup(u._id);
                            }
                          }}
                          title="Delete User"
                          className="text-red-500 hover:text-red-700 text-xl"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
}
