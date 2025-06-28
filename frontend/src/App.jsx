import { useState } from 'react'
import Login from './components/User/UserLogin'
import verificationSuite from './components/User/verification_suite'
import Chat from './pages/User/Chat'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
 

 

  return (
    <Router>
    <Routes>
      {/* Public Routes (No Sidebar) */}
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/verify" element={<verificationSuite />} />
      
      </Routes>
      </Router>
  )
}

export default App;

