import React from 'react';
import userProfile from '../../../assets/userprofile/profile.png';
import { Link } from 'react-router-dom';

function Sidebar({ onClose }) {
  const menuItems = [
    { icon: '✏️', text: 'Edit Profile', to: '/dashboard/profile', active: false },
    { icon: '💖', text: 'My Matches', to: '/dashboard/matches', active: false },
    { icon: '⭐', text: 'Shortlisted', to: '/dashboard/shortlisted', active: false },
    { icon: '📋', text: 'Received Requests', to: '/dashboard/requests', active: false },
    { icon: '📤', text: 'Sent Requests', to: '/dashboard/sent', active: false },
    { icon: '💬', text: 'Messages', to: '/dashboard/messages', active: false },
    { icon: '⚙️', text: 'Settings', to: '/dashboard/settings', active: false },
  ];

  return (
    <aside className="w-[280px] lg:w-[300px]  bg-white border-r border-gray-200 py-6 lg:py-8 px-4 lg:px-6 shadow-lg h-full overflow-y-auto">
      {/* Mobile Close Button */}
      <div className="lg:hidden flex mt-[-25px] justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
          aria-label="Close menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      <div className="text-center mb-8 lg:mb-10">
        <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 relative">
          <img
            src={userProfile}
            alt="User"
            className="w-full h-full object-cover rounded-full border-4 border-blue-100"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-1">Jacob Williams</h2>
        <p className="text-xs lg:text-sm text-blue-600 mb-4 lg:mb-6 font-semibold bg-blue-50 px-2 lg:px-3 py-1 rounded-full inline-block">Free Member</p>

        <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6">
          {[
            { number: '123', label: 'Profile Views' },
            { number: '8', label: 'Matches' },
            { number: '45', label: 'Interests' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-2 lg:p-3 bg-gray-50 rounded-xl">
              <span className="text-sm lg:text-lg font-bold text-gray-800">{stat.number}</span>
              <span className="text-xs text-gray-600 text-center leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1 lg:gap-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 lg:py-4 rounded-xl transition-all text-sm font-medium group ${
              item.active
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
            onClick={onClose}
          >
            <span className="text-base lg:text-lg w-5 lg:w-6 text-center group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="truncate">{item.text}</span>
          </Link>
        ))}
        {/* Plans and other links for mobile only */}
        <div className="flex flex-col gap-1 mt-4 lg:hidden">
          <Link to="/plans" className="flex items-center gap-3 px-3 py-3 rounded-xl text-blue-700 font-semibold hover:bg-blue-50 transition-colors">
            <span className="text-lg">💳</span>
            <span>Plans</span>
          </Link>
          {/* Add more mobile-only links here if needed */}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
