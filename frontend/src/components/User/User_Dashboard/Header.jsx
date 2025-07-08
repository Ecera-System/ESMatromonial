import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userProfile from '../../../assets/userprofile/user.png';

function Header({ onMenuClick }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-6 shadow-sm h-16 flex items-center">
      <div className="flex items-center justify-between w-full max-w-full mx-auto h-16">
        {/* Left Side: Menu, Feed icon, search icon/input, logo */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile Menu Button (always leftmost, only on small screens) */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Feed Logo/Icon (always left, after menu) */}
          <Link to="/feed" className="flex items-center gap-2 text-xl font-bold text-blue-700 hover:text-blue-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e0e7ff" />
              <path d="M8 12h8M8 16h5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
              <circle cx="9" cy="8" r="1.5" fill="#6366f1" />
            </svg>
            <span className="hidden sm:block font-bold tracking-tight">Feed</span>
          </Link>

          {/* Mobile Search Icon and Input (next to Feed) */}
          <div className="flex md:hidden items-center justify-center relative">
            {/* Search Icon */}
            {!showMobileSearch && (
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Open search"
                onClick={() => setShowMobileSearch(true)}
              >
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            {/* Mobile Search Input */}
            {showMobileSearch && (
              <div className="absolute left-0 top-0 w-64 max-w-[80vw] bg-white rounded-full shadow-lg flex items-center px-3 py-2 border border-gray-200 animate-fade-in z-50">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search Profiles..."
                  className="border-none bg-transparent outline-none text-sm flex-1 placeholder-gray-400"
                />
                <button
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close search"
                  onClick={() => setShowMobileSearch(false)}
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <style>{`
                  .animate-fade-in { animation: fade-in 0.2s; }
                  @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* Logo (after search icon/input) */}
          <div className="flex items-center gap-2 lg:gap-3 text-lg lg:text-xl font-bold">
            <Link to="/dashboard" className="flex items-center gap-2 flex-row" > 
              <span className="text-xl lg:text-2xl">❤️</span> 
              <span className="text-gray-800 hidden sm:block">MatriApp</span>
            </Link> 
          </div>
        </div>

        {/* Search Bar (hidden on small screens) */}
        <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 lg:px-5 py-2 lg:py-3 gap-3 min-w-[250px] lg:min-w-[300px] border border-gray-200 focus-within:border-blue-300 focus-within:bg-white transition-all">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search Profiles..."
            className="border-none bg-transparent outline-none text-sm flex-1 placeholder-gray-400"
          />
        </div>

        {/* Right Side: Plans (lg+), Message, Notification, Avatar */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Plans (large screens only) */}
          <nav className="hidden lg:flex gap-6 items-center">
            <Link to="/plans" className="text-blue-700 font-semibold text-base hover:text-blue-900 transition-colors">Plans</Link>
            {/* Add more links here if needed */}
          </nav>
          {/* Message Icon */}
          <Link to="/chat" className="relative p-2 rounded-full hover:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 8.5V17a2 2 0 01-2 2H5a2 2 0 01-2-2V8.5M21 8.5A2.5 2.5 0 0018.5 6h-13A2.5 2.5 0 003 8.5m18 0V8a2 2 0 00-2-2H5a2 2 0 00-2 2v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 8.5l-9 6.5-9-6.5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          {/* Notification Icon */}
          <button className="relative p-2 rounded-full hover:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          {/* User Avatar */}
          <div className="w-8 h-8 lg:w-10 lg:h-10 overflow-hidden rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <img src={userProfile} alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
