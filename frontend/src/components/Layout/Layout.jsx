import React, { useState } from 'react';
import Header from '../User/User_Dashboard/Header';
import Sidebar from '../User/User_Dashboard/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden pt-16"> {/* Changed from mt-16 to pt-16 */}
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full w-64 bg-white border-r border-gray-200">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar and Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <>
              <div 
                className="fixed inset-0 z-40  bg-opacity-50 backdrop-blur-xs lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed z-50 top-16 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-xl lg:hidden">
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </div>
            </>
          )}
          
          {/* Main Content */}
          <main className={`flex-1 overflow-y-auto p-4 lg:p-6 bg-white ${sidebarOpen ? 'lg:ml-0' : ''}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;