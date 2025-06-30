import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';

import Login from './components/User/UserLogin';
import Chat from './pages/User/Chat';
import Header from './components/User/user-profile/Header';
import Sidebar from './components/User/user-profile/Sidebar';
import MainContent from './components/User/user-profile/MainContent';
import VerificationSuite from './components/User/verification_suite'

function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <MainContent />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />} />
         
        {/* Verification Suite */}
         <Route path="/verify" element={<VerificationSuite />} />
      </Routes>
    </Router>
  );
}

export default App;
