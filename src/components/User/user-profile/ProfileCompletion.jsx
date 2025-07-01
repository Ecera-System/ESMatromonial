import React from 'react';

function ProfileCompletion() {
  const completionItems = [
    { icon: '📷', text: 'Upload More Photos', completed: false, color: 'text-orange-500' },
    { icon: '💙', text: 'Add Partner Preferences', completed: false, color: 'text-blue-500' },
    { icon: '✅', text: 'Verify Email/Phone', completed: false, color: 'text-green-500' }
  ];

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg w-full h-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="text-2xl">🎯</span>
        Profile Completion
      </h2>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 relative"
          style={{ width: '60%' }}
        >
          <div className="absolute right-0 top-0 h-full w-2 bg-white opacity-30 animate-pulse"></div>
        </div>
      </div>

      <div className="text-center mb-6">
        <span className="text-2xl font-bold text-gray-800">60%</span>
        <span className="text-gray-500 ml-2">Complete</span>
      </div>

      {/* Completion Items */}
      <div className="flex flex-col gap-4">
        {completionItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <span className={`text-2xl w-8 text-center ${item.color}`}>{item.icon}</span>
            <span className="text-base text-gray-700 font-medium flex-1">{item.text}</span>
            <span className="text-gray-400">→</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProfileCompletion;
