import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function RequestsSection() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'received';
  const [activeTab, setActiveTab] = useState(
    tabParam.charAt(0).toUpperCase() + tabParam.slice(1).toLowerCase()
  );

  const tabs = ['Received', 'Sent', 'Accepted'];

  // Update tab on URL change
  useEffect(() => {
    const newTab = searchParams.get('tab') || 'received';
    setActiveTab(newTab.charAt(0).toUpperCase() + newTab.slice(1).toLowerCase());
  }, [searchParams]);

  return (
    <section className="bg-white rounded-2xl p-4 lg:p-8 shadow-lg w-full h-full border border-gray-100">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-3">
        <span className="text-xl lg:text-2xl">💌</span>
        Requests
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 lg:mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() =>
              window.history.pushState({}, '', `?tab=${tab.toLowerCase()}`) || setActiveTab(tab)
            }
            className={`text-xs lg:text-sm font-semibold py-2 lg:py-3 px-3 lg:px-4 mr-4 lg:mr-6 border-b-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[150px] lg:min-h-[200px] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="text-center p-4">
          <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">📭</div>
          <p className="text-base lg:text-lg text-gray-500 font-medium">No {activeTab.toLowerCase()} requests</p>
          <p className="text-xs lg:text-sm text-gray-400 mt-1 lg:mt-2">When you have requests, they'll appear here</p>
        </div>
      </div>
    </section>
  );
}

export default RequestsSection;
