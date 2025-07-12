import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/Chat/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfileCompletion() {
  const { user } = useAuth();
  const [completion, setCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetchCompletion();
    }
    // eslint-disable-next-line
  }, [user?._id]);

  const fetchCompletion = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/profile-completion/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompletion(res.data.completion);
      setMissingFields(res.data.missingFields);
    } catch (err) {
      setError('Failed to fetch profile completion.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldClick = (field) => {
    navigate(`/profile/edit?focus=${field}`);
  };

  // Example mapping for some common fields
  const fieldLabels = {
    photos: 'Upload More Photos',
    partnerPreferences: 'Add Partner Preferences',
    isVerified: 'Verify Email/Phone',
    aboutMe: 'Add About Me',
    // Add more mappings as needed
  };

  return (
    <section className="bg-white rounded-xl mobile-spacing lg:p-6 shadow-lg w-full h-full border border-gray-100">
      <h2 className="text-mobile-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-3">
        <span className="text-mobile-xl lg:text-2xl flex-shrink-0">🎯</span>
        <span className="truncate">Profile Completion</span>
      </h2>

      {/* Progress Bar */}
      <div className="w-full h-3 lg:h-4 bg-gray-200 rounded-full mb-4 lg:mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 relative"
          style={{ width: `${completion}%` }}
        >
          <div className="absolute right-0 top-0 h-full w-1 lg:w-2 bg-white opacity-30 animate-pulse"></div>
        </div>
      </div>
      <div className="text-center mb-4 lg:mb-6">
        <span className="text-mobile-xl lg:text-2xl font-bold text-gray-800">{completion}%</span>
        <span className="text-gray-500 ml-2 text-mobile-sm lg:text-base">Complete</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <div className="text-2xl lg:text-4xl mb-2">❌</div>
          <div className="text-mobile-sm lg:text-base">{error}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 lg:gap-4 max-h-60 lg:max-h-80 mobile-overflow pr-2">
          {missingFields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-4xl lg:text-6xl mb-4">✅</div>
              <div className="text-green-600 font-semibold text-mobile-base lg:text-lg">Profile is complete!</div>
              <p className="text-gray-500 text-mobile-sm mt-2">All sections have been filled out</p>
            </div>
          ) : (
            missingFields.map((field, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleFieldClick(field)}
                className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-left"
              >
                <span className="text-lg lg:text-xl w-6 lg:w-8 text-center text-orange-500 flex-shrink-0">⚠️</span>
                <span className="text-mobile-sm lg:text-base text-gray-700 font-medium flex-1 min-w-0">
                  {fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-gray-400 text-mobile-sm lg:text-base flex-shrink-0">→</span>
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default ProfileCompletion;
