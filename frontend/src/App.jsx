import { useState } from 'react'
import Login from './components/User/UserLogin'
import verification_suite from './components/User/verification_suite'
import Chat from './pages/User/Chat'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
 

 

  return (
    <Router>
    <Routes>
      {/* Public Routes (No Sidebar) */}
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      
      </Routes>
      </Router>
  )
}

export default App;

