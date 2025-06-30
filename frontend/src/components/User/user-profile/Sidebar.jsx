import React from 'react';
import userProfile from '../../../assets/userprofile/profile.png';

function Sidebar() {
  const menuItems = [
    { icon: '✏️', text: 'Edit Profile', active: false },
    { icon: '💖', text: 'My Matches', active: false },
    { icon: '⭐', text: 'Shortlisted', active: false },
    { icon: '📋', text: 'Received Requests', active: false },
    { icon: '📤', text: 'Sent Requests', active: false },
    { icon: '💬', text: 'Messages', active: false },
    { icon: '⚙️', text: 'Settings', active: false }
  ];

  return (
    <aside className="w-full md:w-[300px] bg-white border-r border-gray-200 py-8 px-6 shadow-sm min-h-full">
      {/* Profile Section */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <img
            src={userProfile}
            alt="User"
            className="w-full h-full object-cover rounded-full border-4 border-blue-100"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Jacob Williams</h2>
        <p className="text-sm text-blue-600 mb-6 font-semibold bg-blue-50 px-3 py-1 rounded-full inline-block">Free Member</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { number: '123', label: 'Profile Views' },
            { number: '8', label: 'Matches' },
            { number: '45', label: 'Interests' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl">
              <span className="text-lg font-bold text-gray-800">{stat.number}</span>
              <span className="text-xs text-gray-600 text-center leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-sm font-medium group ${
              item.active
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <span className="text-lg w-6 text-center group-hover:scale-110 transition-transform">{item.icon}</span>
            <span>{item.text}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
