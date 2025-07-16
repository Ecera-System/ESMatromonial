import React, { useState } from 'react';
import Header from './User_Dashboard/Header';
import Sidebar from './User_Dashboard/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Common Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative pt-14 lg:pt-16">
        {/* Sidebar: static on desktop, drawer on mobile */}
        <div className="hidden lg:block h-full flex-shrink-0">
          <Sidebar />
        </div>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="w-full max-w-xs sm:max-w-sm h-full bg-white border-r border-gray-200 shadow-lg overflow-y-auto">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
            <div
              className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm min-w-0"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}
        {/* Main Content Area */}
        <div className={`flex-1 overflow-y-auto w-full lg:w-auto transition-all duration-300 custom-scrollbar min-w-0 ${
          isChatPage ? 'p-0 bg-transparent' : 'p-4 sm:p-6 lg:p-8 bg-white'
        }`}>
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;