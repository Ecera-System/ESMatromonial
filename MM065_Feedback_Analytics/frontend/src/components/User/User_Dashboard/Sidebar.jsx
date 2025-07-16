import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/Chat/AuthContext';
import userProfile from '../../../assets/userprofile/profile.png';
import axios from 'axios';

function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [matches, setMatches] = React.useState(0);
  const [interests, setInterests] = React.useState(0);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user._id) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setMatches(response.data.matches?.length || 8);
        setInterests(response.data.interests?.length || 45);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { icon: '🏠', text: 'Dashboard', to: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: '💳', text: 'Subscription Plans', to: '/plans', active: location.pathname === '/plans' },
    { icon: '📰', text: 'Feed Page', to: '/feed', active: location.pathname === '/feed' },
    { icon: '💬', text: 'Chat Page', to: '/chat', active: location.pathname === '/chat' },
    { icon: '✏️', text: 'Profile Page', to: '/profile/create', active: location.pathname.includes('/profile') },
    { icon: '✅', text: 'Verification', to: '/verification', active: location.pathname === '/verification' },
  ];

  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] bg-white border-r border-gray-200 p-4 sm:p-6 shadow-lg h-full overflow-y-auto scrollbar-hide">
      {/* Mobile Close Button */}
      <div className="lg:hidden flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors touch-manipulation"
          aria-label="Close menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Profile Section - Mobile optimized */}
      <div className="text-center mb-6 lg:mb-8">
        <div className="relative inline-block mb-4">
          <img
            src={profile?.profilePicture || userProfile}
            alt="User"
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-full border-4 border-blue-100"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2 truncate px-2">
          {user ? `${user.firstName} ${user.lastName}` : 'User Name'}
        </h2>
        <p className="text-xs sm:text-sm text-blue-600 mb-4 lg:mb-6 font-semibold bg-blue-50 px-3 py-1 rounded-full inline-block max-w-full truncate">
          {profile?.subscription?.isActive && profile?.subscription?.planName
            ? profile.subscription.planName
            : 'Free Member'}
        </p>

        <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6">
          {loading ? (
            <div className="col-span-3 text-center text-gray-400 text-xs sm:text-sm">Loading stats...</div>
          ) : (
            [
              { number: profile?.profileViews ?? 0, label: 'Profile Views' },
              { number: matches, label: 'Matches' },
              { number: interests, label: 'Interests' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1 p-2 lg:p-3 bg-gray-50 rounded-lg">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">{stat.number}</span>
                <span className="text-xs text-gray-600 text-center leading-tight">{stat.label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Navigation Menu - Mobile optimized */}
      <nav className="flex flex-col gap-2 mb-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 lg:py-4 rounded-xl transition-all text-sm lg:text-base font-medium group touch-manipulation ${
              item.active
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
            onClick={onClose}
          >
            <span className="text-base lg:text-lg w-6 text-center group-hover:scale-110 transition-transform flex-shrink-0">{item.icon}</span>
            <span className="truncate flex-1">{item.text}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button - Mobile optimized */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 lg:py-4 rounded-xl text-sm lg:text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all group touch-manipulation"
        >
          <span className="text-base lg:text-lg w-6 text-center group-hover:scale-110 transition-transform flex-shrink-0">🚪</span>
          <span className="truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

