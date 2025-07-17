import React, { useEffect, useState } from 'react';
import { getVisitors } from '../../../services/visitorService';
import { useAuth } from '../../../contexts/Chat/AuthContext';

function RecentVisitors() {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getVisitors(user._id)
      .then(data => setVisitors(data))
      .catch(() => setVisitors([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <section className="bg-white rounded-xl mobile-spacing lg:p-6 shadow-lg hover:shadow-xl w-full transition-all duration-300 border border-gray-100">
      <h2 className="text-mobile-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-gray-800 flex items-center gap-3">
        <span className="text-mobile-xl lg:text-2xl">👀</span>
        Recent Visitors
      </h2>
      {loading ? (
        <div className="flex items-center justify-center py-8 lg:py-12">
          <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : visitors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 lg:py-12 text-center">
          <div className="text-4xl lg:text-6xl mb-4">👁️</div>
          <p className="text-gray-400 text-mobile-base lg:text-lg">No recent visitors</p>
          <p className="text-gray-300 text-mobile-sm mt-2">Your profile visitors will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 lg:gap-4">
          {visitors.map(v => (
            <div
              key={v._id}
              className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg border-2 border-transparent hover:border-purple-200 flex items-center justify-center"
              title={v.visitorUserId?.firstName + ' ' + v.visitorUserId?.lastName}
            >
              {v.visitorUserId?.avatar ? (
                <img 
                  src={v.visitorUserId.avatar} 
                  alt={v.visitorUserId.firstName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-mobile-base lg:text-xl font-bold text-purple-700">
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
