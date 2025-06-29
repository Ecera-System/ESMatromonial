import React from 'react';
import RecentVisitors from './RecentVisitors';
import DailyRecommendations from './DailyRecommendations';
import RequestsSection from './RequestsSection';
import ProfileCompletion from './ProfileCompletion';

function MainContent() {
  return (
    <main className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <RecentVisitors />
      <DailyRecommendations />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <RequestsSection />
        <ProfileCompletion />
      </div>
    </main>
  );
}

export default MainContent;
