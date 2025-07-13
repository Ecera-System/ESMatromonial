import React, { useEffect, useState } from "react";
import { getVisitors } from "../../../services/visitorService";
import { useAuth } from "../../../contexts/Chat/AuthContext";

function RecentVisitors() {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getVisitors(user._id)
      .then((data) => setVisitors(data))
      .catch(() => setVisitors([]))
      .finally(() => setLoading(false));
  }, [user]);
  console.log(visitors);

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg dark:shadow-xl hover:shadow-xl w-full transition-all duration-300 border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-3">
        <span className="text-xl sm:text-2xl">👀</span>
        Recent Visitors
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 dark:text-gray-500">
          Loading...
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center text-gray-400 dark:text-gray-500">
          No recent visitors
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6 justify-items-center">
          {visitors.map((v) => (
            <div
              key={v._id}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-600 flex items-center justify-center"
              title={
                v.visitorUserId?.firstName + " " + v.visitorUserId?.lastName
              }
            >
              {v.visitorUserId?.avatar ? (
                <img
                  src={v.visitorUserId.avatar}
                  alt={v.visitorUserId.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {v.visitorUserId?.firstName?.[0]}
                  {v.visitorUserId?.lastName?.[0]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentVisitors;
