import React, { useState } from 'react';
import { Search, Filter, Users, UserCheck, UserX, Ban, RotateCcw, Download } from 'lucide-react';
import { User } from '../App';
import ConfirmationModal from './ConfirmationModal';

interface UsersPageProps {
  users: User[];
  onUpdateUserStatus: (userId: string, status: User['status']) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ users, onUpdateUserStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'ban' | 'activate'>('suspend');

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

  const getStatusColor = (status: User['status']) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAction = (user: User, type: 'suspend' | 'ban' | 'activate') => {
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
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Users</h2>
            <p className="text-gray-600 text-sm mt-1">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors self-start sm:self-auto"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <UserX className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-xl font-semibold text-gray-900">{stats.suspended}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Ban className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-600">Banned</p>
                <p className="text-xl font-semibold text-gray-900">{stats.banned}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | User['status'])}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        {/* Users List - Mobile Cards */}
        <div className="block sm:hidden space-y-3">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Joined:</span>
                  <br />
                  {formatDate(user.joinedAt)}
                </div>
                <div>
                  <span className="font-medium">Last Active:</span>
                  <br />
                  {formatDate(user.lastActive)}
                </div>
                <div>
                  <span className="font-medium">Reports:</span> {user.reportsCount}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {user.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleAction(user, 'suspend')}
                      className="px-3 py-1.5 text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => handleAction(user, 'ban')}
                      className="px-3 py-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Ban
                    </button>
                  </>
                )}
                {(user.status === 'suspended' || user.status === 'banned') && (
                  <button
                    onClick={() => handleAction(user, 'activate')}
                    className="px-3 py-1.5 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Users List - Desktop Table */}
        <div className="hidden sm:block bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Last Active</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Reports</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(user.joinedAt)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.reportsCount}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {user.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleAction(user, 'suspend')}
                              className="text-yellow-600 hover:text-yellow-700 text-xs"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => handleAction(user, 'ban')}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Ban
                            </button>
                          </>
                        )}
                        {(user.status === 'suspended' || user.status === 'banned') && (
                          <button
                            onClick={() => handleAction(user, 'activate')}
                            className="text-green-600 hover:text-green-700 text-xs"
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
          <div className="bg-white p-6 sm:p-8 rounded-lg border text-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-sm text-gray-600">No users match your current filters.</p>
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
    </>
  );
};

export default UsersPage;