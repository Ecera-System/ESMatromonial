import React from 'react';
import userProfile from '../../../assets/userprofile/user.png';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 shadow-sm">
      <div className="flex items-center justify-between max-w-full mx-auto h-16 px-4">

        {/* Left Side */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 text-xl font-bold">
            <span className="text-2xl">❤️</span>
            <span className="text-gray-800">MatriApp</span>
          </div>

          {/* Search Bar (hidden on small screens) */}
          <div className="flex max-md:hidden items-center bg-gray-50 rounded-full px-5 py-3 gap-3 min-w-[300px] border border-gray-200 focus-within:border-blue-300 focus-within:bg-white transition-all">
            <span className="text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search Profiles..."
              className="border-none bg-transparent outline-none text-sm flex-1 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-8">
          <a href="#" className="text-gray-700 font-semibold text-base hover:text-blue-600 transition-colors">
            Matches
          </a>
          <a href="#" className="text-gray-700 font-semibold text-base hover:text-blue-600 transition-colors">
            Messages
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="bg-transparent border-none text-xl cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            🔔
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <img src={userProfile} alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
