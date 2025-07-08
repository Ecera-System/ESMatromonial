import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateProfile from './components/CreateProfile.jsx';
import ViewProfile from './components/ViewProfile.jsx';

function App() {
  const [profileData, setProfileData] = useState(null);

  const handleProfileCreated = (data) => {
    setProfileData(data);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route 
            path="/" 
            element={
              <CreateProfile 
                onProfileCreated={handleProfileCreated}
              />
            } 
          />
          <Route 
            path="/profile/view" 
            element={
              <ViewProfile 
                profileData={profileData}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;