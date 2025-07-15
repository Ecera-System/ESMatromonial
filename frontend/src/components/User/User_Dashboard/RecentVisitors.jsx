import React, { useEffect, useState } from "react";
import { getVisitors } from "../../../services/visitorService";
import { useAuth } from "../../../contexts/Chat/AuthContext";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentVisitors() {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getVisitors(user._id)
      .then((data) => {
        console.log("Visitors data received by frontend:", data);
        setVisitors(data);
      })
      .catch(() => setVisitors([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg dark:shadow-xl hover:shadow-xl w-full transition-all duration-300 border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-3">
        <span className="text-xl sm:text-2xl">👀</span>
        Recent Visitors
        {!(user && (user.subscription?.isActive || user.trial?.isActive)) && (
          <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            PRO
          </span>
        )}
      </h2>
      {user && (user.subscription?.isActive || user.trial?.isActive) ? (
        loading ? (
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
                onClick={() => navigate(`/profile/${v.visitorUserId?._id}`)}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-600 flex items-center justify-center"
                title={
                  v.visitorUserId?.firstName + " " + v.visitorUserId?.lastName
                }
              >
                {v.visitorUserId?.photos ? (
                  <img
                    src={v.visitorUserId.photos[0]}
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
        )
      ) : (
        <>
          <div className="relative min-h-[180px]">
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
                    onClick={() => navigate(`/profile/${v.visitorUserId?._id}`)}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center p-1"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full">
                      {v.visitorUserId?.photos ? (
                        <img
                          src={v.visitorUserId.photos[0]}
                          alt={v.visitorUserId.firstName}
                          className="w-full h-full object-cover blur-md"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-purple-700 dark:text-purple-300 blur-md">
                          {v.visitorUserId?.firstName?.[0]}
                          {v.visitorUserId?.lastName?.[0]}
                        </span>
                      )}
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 text-center text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-1 px-0.5">
                      <span className="blur-sm">
                        {v.visitorUserId?.firstName}{" "}
                        {v.visitorUserId?.lastName?.[0]}.
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4 rounded-2xl mt-4">
            <Star className="w-12 h-12 mx-auto text-yellow-400 mb-4 fill-current" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              Unlock Profile Visitors
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              Upgrade to a premium plan to see who has viewed your profile.
            </p>
            <button
              onClick={() => navigate("/plans")}
              className="px-6 py-3 rounded-full font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
            >
              View Plans
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default RecentVisitors;
