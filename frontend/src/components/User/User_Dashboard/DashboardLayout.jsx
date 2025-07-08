import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Common Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar: static on desktop, drawer on mobile */}
        <div className="hidden lg:block h-full">
          <Sidebar />
        </div>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="w-[280px] max-w-[80vw] h-full bg-white border-r border-gray-200 shadow-lg">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
            <div
              className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-white w-full lg:w-auto transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 