import React, { useState, useRef, useEffect } from 'react';
import { Shield, Users, Settings, Bell, AlertTriangle, Menu, X, ChevronDown, LogOut, User, UserCog } from 'lucide-react';
import { AdminUser, Notification } from '../App';

interface AdminLayoutProps {
  children: React.ReactNode;
  pendingReportsCount: number;
  unreadNotificationsCount: number;
  adminUser: AdminUser;
  currentPage: 'reports' | 'users' | 'settings' | 'notifications';
  onPageChange: (page: 'reports' | 'users' | 'settings' | 'notifications') => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (notificationId: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  pendingReportsCount,
  unreadNotificationsCount,
  adminUser,
  currentPage, 
  onPageChange,
  notifications,
  onMarkNotificationAsRead
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const closeSidebar = () => setSidebarOpen(false);

  const handlePageChange = (page: 'reports' | 'users' | 'settings' | 'notifications') => {
    onPageChange(page);
    closeSidebar();
  };

  const formatNotificationTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_report':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'user_action':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkNotificationAsRead(notification.id);
    }
    
    if (notification.reportId) {
      onPageChange('reports');
    } else if (notification.userId) {
      onPageChange('users');
    }
    
    setNotificationsOpen(false);
  };

  const handleLogout = () => {
    // In a real app, this would clear auth tokens and redirect
    console.log('Logging out...');
    setProfileOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-gray-900" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Admin</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
                    <div className="p-3 border-b flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <button
                        onClick={() => handlePageChange('notifications')}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        View all
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatNotificationTime(notification.timestamp)}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <img
                    src={adminUser.avatar}
                    alt={adminUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                  <ChevronDown className="h-4 w-4 hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <div className="flex items-center space-x-3">
                        <img
                          src={adminUser.avatar}
                          alt={adminUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{adminUser.name}</p>
                          <p className="text-sm text-gray-500 truncate">{adminUser.email}</p>
                          <p className="text-xs text-gray-400 capitalize">{adminUser.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          handlePageChange('settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <UserCog className="h-4 w-4" />
                        <span>Account Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center justify-between p-4 lg:hidden border-b">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-gray-900" />
              <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handlePageChange('reports')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    currentPage === 'reports'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>Reports</span>
                  {pendingReportsCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                      {pendingReportsCount > 99 ? '99+' : pendingReportsCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange('users')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    currentPage === 'users'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span>Users</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange('notifications')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    currentPage === 'notifications'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Bell className="h-4 w-4 flex-shrink-0" />
                  <span>Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                      {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange('settings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    currentPage === 'settings'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;