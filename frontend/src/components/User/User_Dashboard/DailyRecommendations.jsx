import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DailyRecommendations() {
  const [recommendation, setRecommendation] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupName, setPopupName] = useState('');
  const [popupAvatar, setPopupAvatar] = useState('');
  const navigate = useNavigate();

  // Fetch daily recommendation on mount
  useEffect(() => {
    fetchRecommendation();
    // eslint-disable-next-line
  }, []);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/daily-recommendation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendation(res.data.recommendation);
      setMatch(res.data.matchPercentage);
    } catch (err) {
      setRecommendation(null);
      setMatch(null);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch recommendation.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!recommendation?._id) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/skip`, {
        skippedUserId: recommendation._id,
        recommendationId: recommendation.recommendationId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRecommendation();
    } catch (err) {
      setError('Failed to skip recommendation.');
    }
  };

  const handleConnect = async () => {
    if (!recommendation?._id) return;
    setShowPopup(true);
    setPopupName(recommendation.firstName + ' ' + (recommendation.lastName || ''));
    setPopupAvatar(recommendation.avatar || '');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/like`, {
        recommendedUserId: recommendation._id,
        recommendationId: recommendation.recommendationId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeout(() => {
        setShowPopup(false);
        // Redirect to chat page with userId and default message as query param
        const defaultMsg = encodeURIComponent('Hi, I just sent you an invitation!');
        navigate(`/chat?userId=${recommendation._id}&prefill=${defaultMsg}`);
      }, 1500);
    } catch (err) {
      setShowPopup(false);
      setError('Failed to connect.');
    }
  };

  // UI rendering
  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-3">
        <span className="text-lg sm:text-xl lg:text-2xl">✨</span>
        <span className="truncate">Daily Recommendations</span>
      </h2>
      
      <div className="relative min-h-[200px] lg:min-h-[250px]">
        {/* Animated Popup - Mobile optimized */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-sm w-full mx-auto shadow-2xl animate-pop-in">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-4 animate-bounce text-center">🎉</div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 mb-3 text-center">Invitation Sent!</h3>
              <p className="text-gray-600 text-center mb-4 text-sm sm:text-base leading-relaxed">
                You've sent an invitation to <span className="font-semibold">{popupName}</span>.
                <br />
                Redirecting to chat...
              </p>
              {popupAvatar && (
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-4 border-blue-200 mx-auto animate-fade-in">
                  <img src={popupAvatar} alt={popupName} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            
            {/* Animations */}
            <style>{`
              .animate-pop-in {
                animation: pop-in 0.5s cubic-bezier(.68,-0.55,.27,1.55);
              }
              @keyframes pop-in {
                0% { transform: scale(0.7); opacity: 0; }
                80% { transform: scale(1.05); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
              }
              .animate-fade-in { animation: fade-in 0.7s; }
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center h-48 lg:h-60">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-sm lg:text-base text-gray-500">Finding your perfect match...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 lg:h-60 text-center p-4">
            <div className="text-3xl sm:text-4xl lg:text-5xl mb-3">😕</div>
            <div className="text-sm lg:text-base text-red-500 mb-4 break-words">{error}</div>
            <button 
              className="py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-sm sm:text-base transition-colors" 
              onClick={fetchRecommendation}
            >
              Try Again
            </button>
          </div>
        ) : recommendation ? (
          <div className="space-y-4 lg:space-y-0">
            {/* Mobile Layout */}
            <div className="block lg:hidden space-y-4">
              {/* Profile section */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg">
                  {recommendation.avatar ? (
                    <img src={recommendation.avatar} alt={recommendation.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
                      {recommendation.firstName?.charAt(0)?.toUpperCase() || ''}
                      {recommendation.lastName?.charAt(0)?.toUpperCase() || ''}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                    {recommendation.firstName} {recommendation.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {recommendation.age} • {recommendation.profession}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {recommendation.city}, {recommendation.country}
                  </p>
                </div>
                
                <div className="text-center flex-shrink-0">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{match}%</div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">
                    Match
                  </span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:scale-105 transition-all rounded-lg text-sm sm:text-base"
                  onClick={handleConnect}
                >
                  Connect
                </button>
                <button
                  className="py-2 sm:py-3 px-4 sm:px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all rounded-lg text-sm sm:text-base"
                  onClick={handleSkip}
                >
                  Skip
                </button>
              </div>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center gap-6 py-4">
              {/* Profile Info */}
              <div className="flex items-center gap-6 flex-1 min-w-0">
                {/* Avatar */}
                <div className="w-24 h-24 xl:w-28 xl:h-28 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg flex-shrink-0 flex items-center justify-center">
                  {recommendation.avatar ? (
                    <img src={recommendation.avatar} alt={recommendation.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-blue-700">
                      {recommendation.firstName?.charAt(0)?.toUpperCase() || ''}
                      {recommendation.lastName?.charAt(0)?.toUpperCase() || ''}
                    </span>
                  )}
                </div>
                
                {/* Profile Details */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <h3 className="text-xl xl:text-2xl font-bold text-gray-800 truncate">
                    {recommendation.firstName} {recommendation.lastName}
                  </h3>
                  <p className="text-lg text-gray-600 font-medium truncate">
                    {recommendation.age} • {recommendation.profession}
                  </p>
                  <p className="text-base text-gray-500 truncate">
                    {recommendation.city}, {recommendation.country}
                  </p>
                  <button 
                    className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold mt-4 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-indigo-700 w-fit rounded-lg"
                    onClick={handleConnect}
                  >
                    Connect
                  </button>
                </div>
              </div>
              
              {/* Match Info & Skip Button */}
              <div className="flex flex-col items-end gap-4 min-w-fit">
                <div className="text-center">
                  <div className="text-3xl xl:text-4xl font-bold text-green-600 mb-2">{match}%</div>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    Perfect Match
                  </span>
                </div>
                <button
                  className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300 hover:shadow-md hover:scale-105 rounded-lg"
                  onClick={handleSkip}
                >
                  <span>⏭️ Skip</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 lg:h-60 text-center p-4">
            <div className="text-3xl sm:text-4xl lg:text-5xl mb-3">💫</div>
            <p className="text-base lg:text-lg text-gray-500">No recommendations available right now</p>
            <p className="text-sm text-gray-400 mt-2">Check back later for new matches!</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default DailyRecommendations;
