import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/Chat/AuthContext';
import { addVisitor } from '../../../services/visitorService';
import { sendRequest } from '../../../services/requestService';
import { getAllUsers } from '../../../services/userService';
import { Heart, MessageCircle, Briefcase, GraduationCap, MapPin, Star, Filter } from "lucide-react";
import BackButton from "../../BackButton";
import axios from 'axios';

// Profile Card Component
function ProfileCard({ profile, index, onViewProfile, onSendInvite, inviteStatus, onMessage }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    if (onMessage) onMessage(profile);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] group cursor-pointer w-full"
      onClick={() => onViewProfile(profile)}
    >
      {/* Profile Image - Mobile optimized */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden flex items-center justify-center bg-gray-100">
        {profile.photos && profile.photos.length > 0 ? (
          <img
            src={profile.photos[0]}
            alt={profile.firstName + ' ' + profile.lastName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.firstName + ' ' + profile.lastName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-700 bg-gradient-to-br from-purple-100 to-pink-100">
            {profile.firstName?.[0]}
            {profile.lastName?.[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {profile.verified && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current" />
            <span className="hidden sm:inline">Verified</span>
            <span className="sm:hidden">✓</span>
          </div>
        )}
      </div>

      {/* Profile Content - Mobile optimized */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-6">
        {/* Header - Mobile optimized */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2 leading-tight truncate">{profile.firstName} {profile.lastName}</h3>
          <div className="flex items-center text-gray-600 mb-2 text-xs sm:text-sm md:text-base">
            <span className="font-medium">{profile.age ? `${profile.age} years` : ''}</span>
            {profile.age && <span className="mx-1 sm:mx-2">•</span>}
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
          </div>
        </div>

        {/* Quote - Mobile optimized */}
        {profile.quote && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-2 sm:p-3 md:p-4 rounded-xl mb-3 sm:mb-4 border-l-4 border-pink-400">
            <p className="text-gray-700 italic text-xs sm:text-sm leading-relaxed line-clamp-3">{profile.quote}</p>
          </div>
        )}

        {/* Details - Mobile optimized */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <div className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium text-xs sm:text-sm md:text-base truncate">{profile.occupation || profile.job}</span>
          </div>
          <div className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <GraduationCap className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium text-xs sm:text-sm md:text-base truncate">{profile.education}</span>
          </div>
        </div>

        {/* Interests - Mobile optimized */}
        {Array.isArray(profile.interests) && profile.interests.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm uppercase tracking-wide">Interests</h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {profile.interests.slice(0, 3).map((interest, idx) => (
                <span
                  key={interest}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium hover:from-pink-200 hover:to-purple-200 transition-colors duration-200 truncate"
                >
                  {interest}
                </span>
              ))}
              {profile.interests.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  +{profile.interests.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons - Mobile optimized */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleMessage}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 md:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${
              isMessageSent
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
            }`}
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden xs:inline">Message</span>
            <span className="xs:hidden">Chat</span>
          </button>
          <button
            onClick={e => { e.stopPropagation(); onSendInvite(profile); }}
            disabled={inviteStatus === 'sent' || inviteStatus === 'loading'}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 md:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${
              inviteStatus === 'sent'
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white opacity-70 cursor-not-allowed'
                : inviteStatus === 'loading'
                  ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white opacity-70 cursor-wait'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1'
            }`}
          >
            {inviteStatus === 'sent' ? (
              <span className="text-xs">Sent</span>
            ) : inviteStatus === 'loading' ? (
              <span className="text-xs">...</span>
            ) : (
              <span className="text-xs">Invite</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Feed Component
export default function MatrimonyFeed() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inviteMap, setInviteMap] = useState({}); // { [profileId]: 'idle' | 'loading' | 'sent' }
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setProfiles(response.data.users || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    if (!user) return true; // If not logged in, show all
    return profile._id !== user._id && (activeFilter === "all" || profile.category === activeFilter);
  });

  const filters = [
    { key: "all", label: "All Profiles", count: profiles.length },
    { key: "verified", label: "Verified", count: profiles.filter(p => p.verified).length },
    { key: "nearby", label: "Nearby", count: profiles.filter(p => p.category === "nearby").length },
  ];

  const handleViewProfile = async (profile) => {
    navigate(`/profile/${profile._id}`);
  };

  const handleSendInvite = async (profile) => {
    if (!user || !profile._id || user._id === profile._id) return;
    setInviteMap(prev => ({ ...prev, [profile._id]: 'loading' }));
    try {
      await sendRequest(profile._id);
      setInviteMap(prev => ({ ...prev, [profile._id]: 'sent' }));
    } catch (err) {
      setInviteMap(prev => ({ ...prev, [profile._id]: 'idle' }));
    }
  };

  const handleMessage = (profile) => {
    navigate(`/chat/${profile._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        <div className="mb-3 sm:mb-4 md:mb-6">
          <BackButton />
        </div>
      </div>
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Hero Section - Mobile optimized */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 leading-tight px-2">
            Find Your Perfect Match
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 leading-relaxed px-4">
            Discover meaningful connections with people who share your values, interests, and life goals
          </p>
          
          {/* Filter Buttons - Mobile optimized */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12 px-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base ${
                  activeFilter === filter.key
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 transform -translate-y-1"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <span className="truncate">{filter.label}</span>
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs flex-shrink-0 ${
                  activeFilter === filter.key 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Profiles Grid - Mobile optimized with 3 cards per row */}
        {loading ? (
          <div className="text-center text-gray-400 text-base sm:text-lg py-8">Loading profiles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredProfiles.map((profile, index) => (
              <div
                key={profile._id}
                className="opacity-0 animate-fade-in-up w-full"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <ProfileCard
                  profile={profile}
                  index={index}
                  onViewProfile={handleViewProfile}
                  onSendInvite={handleSendInvite}
                  inviteStatus={inviteMap[profile._id] || 'idle'}
                  onMessage={handleMessage}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Load More Button - Mobile optimized */}
        <div className="text-center mt-6 sm:mt-8 md:mt-12">
          <button className="py-3 px-6 sm:px-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base">
            Load More Profiles
          </button>
        </div>
      </main>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}