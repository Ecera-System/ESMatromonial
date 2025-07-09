import React, { useEffect, useState } from "react";
import axios from "axios";

function RecentVisitors() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/visitors")
      .then((res) => {
        const sorted = res.data
          .sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt))
          .slice(0, 4);//for latest 4 visitors
        setVisitors(sorted);
        console.log("Fetched visitors:", sorted);
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <section className="p-4 bg-white rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Visitors</h2>

      <div className="flex gap-4 overflow-x-auto">
        {visitors.map((visitor) => {
          const user = visitor.userId;
          const avatar = user?.avatar;
          const name = user?.name;

          return (
            <div
              key={visitor._id}
              className="flex flex-col items-center bg-gray-50 rounded-xl p-3 w-[80px] h-[100px] justify-between shadow-sm border"
            >
              <img
                src={avatar || "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"}
                alt={name || "User"}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <span className="text-[13px] font-medium text-gray-700 text-center truncate w-full">
                {name || "Unknown"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RecentVisitors;
