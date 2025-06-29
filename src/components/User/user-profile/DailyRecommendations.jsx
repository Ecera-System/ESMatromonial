import React from 'react';
import userProfile from '../../../assets/userprofile/emma.png';

function DailyRecommendations() {
  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg w-full border border-gray-100">
      <div className="flex items-center justify-between gap-8 py-6 w-full lg:flex-row md:flex-col md:items-start md:gap-6">

        {/* Profile Info */}
        <div className="flex items-center gap-6 flex-1">

          {/* Avatar */}
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
            <img src={userProfile} alt="User" className="w-full h-full object-cover" />
          </div>

          {/* Profile Details */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-gray-800 m-0">Emma Johnson</h3>
            <p className="text-lg text-gray-600 m-0 font-medium">25 • Teacher</p>
            <p className="text-base text-gray-500 m-0">Santa Angeles, California</p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-full mt-4 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-indigo-700">
              Connect
            </button>
          </div>
        </div>

        {/* Match Info */}
        <div className="flex flex-col items-center justify-center min-w-[140px] gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-full">Perfect Match</span>
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105">
            ⏭️ Skip
          </button>
        </div>

      </div>
    </section>
  );
}

export default DailyRecommendations;
