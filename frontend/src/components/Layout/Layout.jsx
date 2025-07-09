import React, { useState, useEffect } from 'react';
import Header from '../User/User_Dashboard/Header';
import Sidebar from '../User/User_Dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  console.log('Layout: Current user state', { 
    user: user ? `${user.firstName} ${user.lastName}` : null, 
    loading 
  });

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar and Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed z-50 top-16 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-xl lg:hidden">
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </div>
            </>
          )}
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-white">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;