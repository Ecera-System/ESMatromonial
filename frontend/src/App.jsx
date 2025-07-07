import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import Login from './components/User/UserLogin';
import Chat from './pages/User/Chat';
import MatrimonyFeed from "./components/User/User-Feed/Feed";
import Signup from './components/User/Signup';
import Plans from "./components/User/User-Plan/Plans";
import VerificationSuite from './components/User/verification_suite';
import AdminSignIn from "./components/Admin/AdminSignIn";
import AdminSignUp from "./components/Admin/AdminSignUp";
import Landing from "./components/User/Landing-Page/Landing";
import CreateProfile from './components/User/User_Profile/CreateProfile';
import ViewProfile from './components/User/User_Profile/ViewProfile';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/User/Dashboard';
import ScrollToTop from './components/ScrollToTop';
import RequestsSection from './components/User/User_Dashboard/RequestsSection';

function App() {
  const [profileData, setProfileData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleProfileCreated = (data) => {
    setProfileData(data);
  };
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/verify" element={<VerificationSuite />} />
        <Route path="/signup" element={<Signup />} />
        {/* Layout for all dashboard pages */}
        <Route element={<Layout />}>
         <Route path="/dashboard/requests" element={<RequestsSection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feed" element={<MatrimonyFeed />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/profile/create" element={<CreateProfile onProfileCreated={handleProfileCreated} initialData={profileData} />} />
          <Route path="/profile/view" element={<ViewProfile profileData={profileData} onBackToCreate={() => window.history.back()} isDarkMode={isDarkMode} />} />
          {/* Add more dashboard pages here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}
export default App;






