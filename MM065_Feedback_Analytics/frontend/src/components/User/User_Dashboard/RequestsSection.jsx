import React, { useEffect, useState } from 'react';
import { getUserRequests, respondToRequest } from '../../../services/requestService';
import { useAuth } from '../../../contexts/Chat/AuthContext';
import { Check, X, User, Clock, Send, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RequestsSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Received');
  const [requests, setRequests] = useState({ received: [], sent: [], accepted: [] });
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState({});

  const fetchRequests = () => {
    setLoading(true);
    getUserRequests()
      .then(data => setRequests({
        received: data.received || [],
        sent: data.sent || [],
        accepted: data.accepted || []
      }))
      .catch(() => setRequests({ received: [], sent: [], accepted: [] }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) return;
    fetchRequests();
  }, [user]);

  const handleRespond = async (requestId, action) => {
    setResponding(prev => ({ ...prev, [requestId]: action }));
    try {
      await respondToRequest(requestId, action);
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setResponding(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const tabData = {
    Received: requests.received,
    Sent: requests.sent,
    Accepted: requests.accepted
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            <Check className="w-3 h-3 mr-1" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            <X className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 h-full">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-3">
        <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-pink-500 flex-shrink-0" />
        <span className="truncate">Connection Requests</span>
      </h2>
      
      {/* Tabs - Mobile optimized */}
      <div className="flex border-b border-gray-200 mb-4 lg:mb-6 overflow-x-auto">
        <div className="flex gap-1 lg:gap-4 min-w-full">
          {Object.keys(tabData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs sm:text-sm lg:text-base font-medium py-3 px-3 sm:px-4 lg:px-6 border-b-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 touch-manipulation ${
                activeTab === tab
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab} {tabData[tab].length > 0 && (
                <span className="ml-1 sm:ml-2 inline-flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-purple-100 text-xs text-purple-800">
                  {tabData[tab].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content - Mobile optimized */}
      <div className="min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-8 lg:py-12">
            <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-500 text-sm lg:text-base">Loading requests...</p>
          </div>
        ) : tabData[activeTab].length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 lg:py-12 text-center px-4">
            <Send className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-300 mb-4" />
            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-500 mb-2">No {activeTab.toLowerCase()} requests</h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm">
              {activeTab === 'Received'
                ? "When someone sends you a connection request, it will appear here."
                : activeTab === 'Sent'
                ? "Your sent requests will appear here once you connect with someone."
                : "Your accepted connections will appear here."}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tabData[activeTab].map((req) => {
              const profile = activeTab === 'Sent' ? req.receiver : req.sender;
              return (
                <li key={req._id} className="p-3 sm:p-4 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {profile?.avatar ? (
                          <img
                            className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full object-cover"
                            src={profile.avatar}
                            alt={`${profile.firstName} ${profile.lastName}`}
                          />
                        ) : (
                          <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-purple-600 font-medium text-xs sm:text-sm lg:text-base">
                            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base lg:text-lg truncate">
                          {profile?.firstName} {profile?.lastName}
                        </h4>
                        {req.message && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">"{req.message}"</p>
                        )}
                        <div className="mt-2">
                          {getStatusBadge(req.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {activeTab === 'Received' && req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRespond(req._id, 'accept')}
                            disabled={responding[req._id] === 'accept'}
                            className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center rounded-lg font-medium text-xs sm:text-sm transition-colors touch-manipulation"
                          >
                            {responding[req._id] === 'accept' ? (
                              'Accepting...'
                            ) : (
                              <>
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Accept
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRespond(req._id, 'reject')}
                            disabled={responding[req._id] === 'reject'}
                            className="flex-1 py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 flex items-center justify-center rounded-lg font-medium text-xs sm:text-sm transition-colors touch-manipulation"
                          >
                            {responding[req._id] === 'reject' ? (
                              'Rejecting...'
                            ) : (
                              <>
                                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Reject
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      
                      {(activeTab === 'Accepted' || req.status === 'accepted') && (
                        <button
                          onClick={() => handleViewProfile(profile?._id)}
                          className="py-2 sm:py-3 px-3 sm:px-4 bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center rounded-lg font-medium text-xs sm:text-sm transition-colors touch-manipulation"
                        >
                          <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> View Profile
                        </button>
                      )}
                      
                      {activeTab === 'Sent' && (
                        <span className="text-xs sm:text-sm text-gray-500 text-center">
                          Sent {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default RequestsSection;