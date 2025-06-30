import React, { useState } from 'react';

function RequestsSection() {
  const [activeTab, setActiveTab] = useState('Received');
  const tabs = ['Received', 'Sent', 'Accepted'];

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg w-full h-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="text-2xl">💌</span>
        Requests
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold py-3 px-4 mr-6 border-b-3 transition-all duration-300 ${
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
      <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-lg text-gray-500 font-medium">No {activeTab.toLowerCase()} requests</p>
          <p className="text-sm text-gray-400 mt-2">When you have requests, they'll appear here</p>
        </div>
      </div>
    </section>
  );
}

export default RequestsSection;
