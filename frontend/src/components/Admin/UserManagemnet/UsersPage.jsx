import React, { useState } from 'react';
import { Search, Filter, Users, UserCheck, UserX, Ban, RotateCcw, Download } from 'lucide-react';
import ConfirmationModal from '../Reports/ConfirmationModal';
import AdminLayout from '../AdminLayout';

const UsersPage = ({ users = [], onUpdateUserStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('suspend');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    return {
      active: users.filter(u => u.status === 'active').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      banned: users.filter(u => u.status === 'banned').length
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'suspended':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'banned':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAction = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (!selectedUser) return;
    
    switch (actionType) {
      case 'suspend':
        onUpdateUserStatus(selectedUser.id, 'suspended');
        break;
      case 'ban':
        onUpdateUserStatus(selectedUser.id, 'banned');
        break;
      case 'activate':
        onUpdateUserStatus(selectedUser.id, 'active');
        break;
    }
    setShowModal(false);
    setSelectedUser(null);
  };

  const getActionMessage = () => {
    if (!selectedUser) return '';
    
    switch (actionType) {
      case 'suspend':
        return `Suspend ${selectedUser.name}'s account? They will be temporarily restricted from the platform.`;
      case 'ban':
        return `Ban ${selectedUser.name}'s account? This is a permanent action that cannot be undone.`;
      case 'activate':
        return `Activate ${selectedUser.name}'s account? They will regain full access to the platform.`;
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Status', 'Joined', 'Last Active', 'Reports'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.status,
        formatDate(user.joinedAt),
        formatDate(user.lastActive),
        user.reportsCount.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getStatusStats();

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Users</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">Active Users</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.active}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <UserX className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-yellow-600 font-medium">Suspended</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.suspended}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-red-100 rounded-lg">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-red-600 font-medium">Banned</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.banned}</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.joinedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.reportsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {user.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleAction(user, 'suspend')}
                              className="text-yellow-600 hover:text-yellow-700 text-sm"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => handleAction(user, 'ban')}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Ban
                            </button>
                          </>
                        )}
                        {(user.status === 'suspended' || user.status === 'banned') && (
                          <button
                            onClick={() => handleAction(user, 'activate')}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">No users match your current filters.</p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAction}
        title={`${actionType === 'suspend' ? 'Suspend User' : actionType === 'ban' ? 'Ban User' : 'Activate User'}`}
        message={getActionMessage()}
        confirmText={actionType === 'suspend' ? 'Suspend' : actionType === 'ban' ? 'Ban' : 'Activate'}
        confirmButtonClass={
          actionType === 'ban' ? 'bg-red-600 hover:bg-red-700' :
          actionType === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700' :
          'bg-green-600 hover:bg-green-700'
        }
      />
    </AdminLayout>
  );
};

export default UsersPage;
