import React, { useState } from 'react';
import RecentVisitors from './RecentVisitors';
import DailyRecommendations from './DailyRecommendations';
import RequestsSection from './RequestsSection';
import ProfileCompletion from './ProfileCompletion';

function MainContent() {
  return (
   <main className="flex flex-col gap-4 sm:gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-0 sm:px-0">
     <RecentVisitors />
     <DailyRecommendations />
     <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
       <RequestsSection />
       <ProfileCompletion />
     </div>
   </main>
  );
}

function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 lg:hidden z-40"
          onClick={handleOverlayClick}
        />
      )}
      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 w-full transition-all duration-300 min-w-0">
        <MainContent />
      </div>
    </div>
  );
}

export default UserDashboard;

