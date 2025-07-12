import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full max-w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;