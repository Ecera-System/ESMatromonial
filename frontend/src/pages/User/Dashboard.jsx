import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MainContent from '../../components/User/User_Dashboard/MainContent';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="w-full h-full">
      {/* Welcome Message */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">👋</span>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Welcome back, {user ? user.firstName : 'User'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to find your perfect match today?
            </p>
          </div>
        </div>
      </div>
      
      <MainContent />
    </div>
  );
};

export default Dashboard;