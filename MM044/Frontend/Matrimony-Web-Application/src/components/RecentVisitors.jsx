import React, { useEffect, useState } from "react";
import axios from "axios";

function RecentVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch individual user by ID
  const fetchUser = async (userId) => {
    console.log(`Fetching user data for ID: ${userId}`);
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/users/${userId}`);
      console.log(`User data fetched for ${userId}:`, res.data);
      return res.data;
    } catch (err) {
      console.error(`Failed to fetch user ${userId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    console.log("useEffect running to fetch recent visitors...");

    const fetchVisitors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/visitors");
        console.log("Raw visitors fetched:", res.data);

        const rawVisitors = res.data
          .sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt))
          .slice(0, 4);

        console.log("Top 4 sorted visitors:", rawVisitors);

        const enriched = await Promise.all(
          rawVisitors.map(async (visit) => {
            const user = await fetchUser(visit.visitorUserId);
            return {
              ...visit,
              user,
            };
          })
        );

        console.log("Enriched visitors with user data:", enriched);
        setVisitors(enriched);
      } catch (err) {
        console.error("Error fetching visitors:", err);
        setError("Failed to load visitors.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl w-full transition-all duration-300 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <span className="text-2xl">👀</span>
        Recent Visitors</h2>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-14 overflow-x-auto">
        {visitors.map((visitor) => {
          const user = visitor.user;
          const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
          const photos =
            user?.photos ||
            "https://cdn-icons-png.flaticon.com/512/2922/2922510.png";

          return (
            <div
              key={visitor._id}
              className="flex flex-col items-cols bg-blue-50 rounded-xl p-5 w-[100px] h-[120px] justify-between shadow-sm border"
            >
              <img
                src={photos}
                alt={name}
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
