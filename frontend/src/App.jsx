import { AuthProvider } from './contexts/Chat/AuthContext';
import { SocketProvider } from './contexts/Chat/SocketContext';
import { NotificationProvider } from './contexts/Chat/NotificationContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Landing from './components/User/Landing-Page/Landing';
import UserLayout from './components/User/UserLayout';
import DashboardLayout from './components/User/User_Dashboard/DashboardLayout';
import MainContent from './components/User/User_Dashboard/MainContent';
import CreateProfile from './components/User/User_Profile/CreateProfile';
import ViewProfile from './components/User/User_Profile/ViewProfile';
import Feed from './components/User/User-Feed/Feed';
import Plans from './components/User/User-Plan/Plans';
import UserVerificationDashboard from './components/User/verification_suite';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'
import UserProfilePage from './pages/UserProfilePage';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import SubmitFeedbackPage from './pages/SubmitFeedbackPage';



function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="mobile-viewport">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
           <Route path="/admin/feedback/submit" element={<ProtectedRoute><SubmitFeedbackPage /></ProtectedRoute>} />



            
            {/* User Layout Routes - All protected routes with Header and Sidebar */}
            <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<MainContent />} />
              </Route>
              <Route path="profile/create" element={<CreateProfile />} />
              <Route path="profile/view" element={<ViewProfile />} />
              <Route path="profile/edit" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
              <Route path="verification" element={<UserVerificationDashboard />} />
              <Route path="feed" element={<Feed />} />
              <Route path="plans" element={<Plans />} />
              <Route path="chat" element={<ProtectedRoute><ChatWithProviders /></ProtectedRoute>} />
              <Route path="/chat/:userId" element={<ProtectedRoute><ChatWithProviders /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<UserProfilePage />} />
            </Route>
          </Routes>
        </div>
        
        {/* Mobile-optimized toast notifications */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              maxWidth: 'calc(100vw - 32px)',
              margin: '16px',
            },
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  )
}

function ChatWithProviders() {
  return (
    <SocketProvider>
      <NotificationProvider>
        <Chat />
      </NotificationProvider>
    </SocketProvider>
  );
}

export default App

