import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import Login from './components/User/UserLogin';
import Chat from './pages/User/Chat';
import Header from './components/User/User_Dashboard/Header';
import Sidebar from './components/User/User_Dashboard/Sidebar';
import MainContent from './components/User/User_Dashboard/MainContent';
import CreateProfile from './components/User/User_Profile/CreateProfile';
import ViewProfile from './components/User/User_Profile/ViewProfile';
import VerificationSuite from './components/User/verification_suite';
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
  const [profileData, setProfileData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleProfileCreated = (data) => {
    setProfileData(data);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route
          path="/profile/create"
          element={
            <CreateProfile
              onProfileCreated={handleProfileCreated}
              initialData={profileData}
            />
          }
        />
        <Route
          path="/profile/view"
          element={
            profileData ? (
              <ViewProfile
                profileData={profileData}
                onBackToCreate={() => window.history.back()}
                isDarkMode={isDarkMode}
              />
            ) : (
              <Navigate to="/profile/create" replace />
            )
          }
        />
        <Route path="/verify" element={<VerificationSuite />} />
      </Routes>
    </Router>
  );
}
export default App;






