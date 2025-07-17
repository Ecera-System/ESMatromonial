import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import ReportsPage from './components/ReportsPage';
import UsersPage from './components/UsersPage';
import SettingsPage from './components/SettingsPage';
import NotificationsPage from './components/NotificationsPage';

export interface Report {
  id: string;
  reportedUser: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: 'active' | 'suspended' | 'banned';
  };
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  reason: string;
  description: string;
  status: 'pending' | 'under-review' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'suspended' | 'banned';
  joinedAt: string;
  lastActive: string;
  reportsCount: number;
}

export interface Notification {
  id: string;
  type: 'new_report' | 'user_action' | 'system' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  reportId?: string;
  userId?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'super_admin';
  lastLogin: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'reports' | 'users' | 'settings' | 'notifications'>('reports');
  
  const [adminUser] = useState<AdminUser>({
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@platform.com',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    role: 'admin',
    lastLogin: new Date().toISOString()
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      type: 'new_report',
      title: 'New Report Submitted',
      message: 'Alex Johnson has been reported for harassment by Sarah Chen',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      reportId: '1'
    },
    {
      id: 'notif-2',
      type: 'new_report',
      title: 'New Report Submitted',
      message: 'Jennifer Walsh has been reported for impersonation by Robert Lee',
      timestamp: '2024-01-12T16:20:00Z',
      read: false,
      reportId: '4'
    },
    {
      id: 'notif-3',
      type: 'user_action',
      title: 'User Account Suspended',
      message: 'David Kim\'s account has been suspended due to policy violations',
      timestamp: '2024-01-13T11:30:00Z',
      read: true,
      userId: 'user-5'
    },
    {
      id: 'notif-4',
      type: 'system',
      title: 'Weekly Report Generated',
      message: 'Your weekly moderation report is ready for review',
      timestamp: '2024-01-08T09:00:00Z',
      read: true
    },
    {
      id: 'notif-5',
      type: 'security',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from unusual location',
      timestamp: '2024-01-10T14:45:00Z',
      read: true
    }
  ]);
  
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'active',
      joinedAt: '2024-01-10T10:30:00Z',
      lastActive: '2024-01-15T14:20:00Z',
      reportsCount: 1
    },
    {
      id: 'user-3',
      name: 'Michael Rodriguez',
      email: 'michael.r@email.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'active',
      joinedAt: '2024-01-08T09:15:00Z',
      lastActive: '2024-01-14T16:45:00Z',
      reportsCount: 1
    },
    {
      id: 'user-5',
      name: 'David Kim',
      email: 'david.kim@email.com',
      avatar: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'suspended',
      joinedAt: '2024-01-05T11:20:00Z',
      lastActive: '2024-01-13T08:30:00Z',
      reportsCount: 1
    },
    {
      id: 'user-7',
      name: 'Jennifer Walsh',
      email: 'jen.walsh@email.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      status: 'active',
      joinedAt: '2024-01-03T15:45:00Z',
      lastActive: '2024-01-12T12:10:00Z',
      reportsCount: 1
    }
  ]);

  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      reportedUser: {
        id: 'user-1',
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        status: 'active'
      },
      reportedBy: {
        id: 'user-2',
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com'
      },
      reason: 'Harassment',
      description: 'User has been sending inappropriate messages and making threatening comments on posts.',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      reportedUser: {
        id: 'user-3',
        name: 'Michael Rodriguez',
        email: 'michael.r@email.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        status: 'active'
      },
      reportedBy: {
        id: 'user-4',
        name: 'Emma Wilson',
        email: 'emma.wilson@email.com'
      },
      reason: 'Spam',
      description: 'Account is posting promotional content repeatedly across multiple threads.',
      status: 'under-review',
      priority: 'medium',
      createdAt: '2024-01-14T14:15:00Z',
      reviewedAt: '2024-01-14T16:20:00Z',
      reviewedBy: 'Admin'
    },
    {
      id: '3',
      reportedUser: {
        id: 'user-5',
        name: 'David Kim',
        email: 'david.kim@email.com',
        avatar: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        status: 'suspended'
      },
      reportedBy: {
        id: 'user-6',
        name: 'Lisa Thompson',
        email: 'lisa.t@email.com'
      },
      reason: 'Inappropriate Content',
      description: 'User shared content that violates community guidelines regarding explicit material.',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-01-13T09:45:00Z',
      reviewedAt: '2024-01-13T11:30:00Z',
      reviewedBy: 'Admin'
    },
    {
      id: '4',
      reportedUser: {
        id: 'user-7',
        name: 'Jennifer Walsh',
        email: 'jen.walsh@email.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        status: 'active'
      },
      reportedBy: {
        id: 'user-8',
        name: 'Robert Lee',
        email: 'robert.lee@email.com'
      },
      reason: 'Impersonation',
      description: 'User is impersonating a public figure and misleading other users.',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-12T16:20:00Z'
    }
  ]);

  const updateReportStatus = (reportId: string, status: Report['status']) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? {
              ...report,
              status,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Admin'
            }
          : report
      )
    );

    // Add notification for report status change
    if (status === 'resolved' || status === 'dismissed') {
      const report = reports.find(r => r.id === reportId);
      if (report) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'user_action',
          title: `Report ${status === 'resolved' ? 'Resolved' : 'Dismissed'}`,
          message: `Report against ${report.reportedUser.name} has been ${status}`,
          timestamp: new Date().toISOString(),
          read: false,
          reportId
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }
  };

  const updateUserStatus = (userId: string, status: User['status']) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status } : user
      )
    );

    // Update user status in reports as well
    setReports(prevReports =>
      prevReports.map(report =>
        report.reportedUser.id === userId
          ? { ...report, reportedUser: { ...report.reportedUser, status } }
          : report
      )
    );

    // Add notification for user status change
    const user = users.find(u => u.id === userId);
    if (user) {
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'user_action',
        title: `User Account ${status === 'active' ? 'Activated' : status === 'suspended' ? 'Suspended' : 'Banned'}`,
        message: `${user.name}'s account has been ${status}`,
        timestamp: new Date().toISOString(),
        read: false,
        userId
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const pendingReportsCount = reports.filter(report => report.status === 'pending').length;
  const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'reports':
        return <ReportsPage reports={reports} onUpdateStatus={updateReportStatus} />;
      case 'users':
        return <UsersPage users={users} onUpdateUserStatus={updateUserStatus} />;
      case 'notifications':
        return (
          <NotificationsPage 
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
            onDelete={deleteNotification}
            onNavigateToReport={(reportId) => setCurrentPage('reports')}
            onNavigateToUser={(userId) => setCurrentPage('users')}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return <ReportsPage reports={reports} onUpdateStatus={updateReportStatus} />;
    }
  };

  return (
    <AdminLayout 
      pendingReportsCount={pendingReportsCount}
      unreadNotificationsCount={unreadNotificationsCount}
      adminUser={adminUser}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      notifications={notifications.slice(0, 5)}
      onMarkNotificationAsRead={markNotificationAsRead}
    >
      {renderCurrentPage()}
    </AdminLayout>
  );
}

export default App;