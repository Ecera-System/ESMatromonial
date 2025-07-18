import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/Chat/AuthContext";
import { SocketProvider } from "./contexts/Chat/SocketContext";
import { NotificationProvider } from "./contexts/Chat/NotificationContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Landing from "./components/User/Landing-Page/Landing";
import UserLayout from "./components/User/UserLayout";
import DashboardLayout from "./components/User/User_Dashboard/DashboardLayout";
import MainContent from "./components/User/User_Dashboard/MainContent";
import SettingsPage from "./pages/SettingsPage";
import Feed from "./components/User/User-Feed/Feed";
import Plans from "./components/User/User-Plan/Plans";
import UserVerificationDashboard from "./components/User/verification_suite";
import Profile from "./components/User/Profile";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationsPage from "./pages/NotificationsPage";
import "./App.css";
import UserProfilePage from "./pages/UserProfilePage";
import AdminSignUp from './components/Admin/Auth/AdminSignUp';
import AdminSignIn from './components/Admin/Auth/AdminSignIn';
import AdminDashboard from './components/Admin/Dashboard/AdminDashboard';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import InactiveUser from './components/Admin/InactiveUser/InactiveUser';
import CouponDashboard from './components/Admin/CouponManagement/CouponDashboard';
import CreateCoupon from './components/Admin/CouponManagement/CreateCoupon';
import CouponManager from './components/Admin/CouponManagement/CouponManager';
import UsersPage from './components/Admin/UserManagemnet/UsersPage';
import ReportsPage from './components/Admin/Reports/ReportsPage';
import AdminSettingsPage from './components/Admin/Settings/AdminSettingsPage';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
                
                {/* Admin Routes - Separate from user layout with AdminProtectedRoute */}
            <Route path="/admin/signup" element={<AdminSignUp />} />
            <Route path="/admin/signin" element={<AdminSignIn />} />
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <AdminProtectedRoute>
                <UsersPage users={[]} onUpdateUserStatus={() => {}} />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <AdminProtectedRoute>
                <ReportsPage reports={[]} onUpdateStatus={() => {}} />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminProtectedRoute>
                <AdminSettingsPage />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/feedback" element={
              <AdminProtectedRoute>
                <AdminFeedbackPage />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/inactive-users" element={
              <AdminProtectedRoute>
                <InactiveUser />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/coupons" element={
              <AdminProtectedRoute>
                <CouponDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/coupons/create" element={
              <AdminProtectedRoute>
                <CreateCoupon />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/coupons/edit/:id" element={
              <AdminProtectedRoute>
                <CouponManager />
              </AdminProtectedRoute>
            } />
            
              {/* User Layout Routes - All protected routes with Header and Sidebar */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardLayout />}>
                  {" "}
                  <Route index element={<MainContent />} />
                </Route>
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route
                  path="verification"
                  element={<UserVerificationDashboard />}
                />
                <Route path="feed" element={<Feed />} />
                <Route path="plans" element={<Plans />} />
                <Route path="setting" element={<SettingsPage />} />

                <Route
                  path="chat"
                  element={
                    <ProtectedRoute>
                      <ChatWithProviders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/:userId"
                  element={
                    <ProtectedRoute>
                      <ChatWithProviders />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile/:userId" element={<UserProfilePage />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </Router>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
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

export default App;
