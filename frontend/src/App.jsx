import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/User/UserLogin";
import Chat from "./pages/User/Chat";
import UserVerificationDashboard from "./UserVerificationDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/verify" element={<UserVerificationDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
