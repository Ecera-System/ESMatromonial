import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RequestsSection() {
  const [activeTab, setActiveTab] = useState('Received');
  const [requests, setRequests] = useState({ received: [], sent: [], accepted: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = ['Received', 'Sent', 'Accepted'];
   
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Token exists:', !!token);
      
      if (!token) {
        setError('Please login to view requests');
        setLoading(false);
        return;
      }

      console.log('Making request to:', 'http://localhost:5000/api/requests/my-requests');
      
      const response = await axios.get('http://localhost:5000/api/requests/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Requests response:', response.data);
      setRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to load requests:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 401) {
        // Token might be invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Session expired. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/requests/respond/${requestId}`,
        { action: 'accept' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh requests after accepting
      fetchRequests();
    } catch (err) {
      console.error('Failed to accept request:', err);
      setError(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/requests/respond/${requestId}`,
        { action: 'reject' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh requests after rejecting
      fetchRequests();
    } catch (err) {
      console.error('Failed to reject request:', err);
      setError(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const getCurrentList = () => {
    if (!requests || typeof requests !== 'object') return [];

    if (activeTab === 'Received') return Array.isArray(requests.received) ? requests.received : [];
    if (activeTab === 'Sent') return Array.isArray(requests.sent) ? requests.sent : [];
    if (activeTab === 'Accepted') return Array.isArray(requests.accepted) ? requests.accepted : [];

    return [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentList = getCurrentList();

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg w-full h-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="text-2xl">💌</span>
        Connection Requests
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold py-3 px-4 mr-6 border-b-2 transition-all duration-300 ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
            {requests[tab.toLowerCase()] && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                {requests[tab.toLowerCase()].length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading requests...</span>
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-lg font-medium">No {activeTab.toLowerCase()} requests</p>
            <p className="text-sm text-gray-400 mt-2">
              {activeTab === 'Received' && 'When others send you requests, they\'ll appear here'}
              {activeTab === 'Sent' && 'Requests you send will appear here'}
              {activeTab === 'Accepted' && 'Accepted connections will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentList.map((request) => {
              const isReceived = activeTab === 'Received';
              const user = isReceived ? request.sender : request.receiver;
              const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
              
              return (
                <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.avatar || '/default-avatar.png'}
                      alt={userName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-800 font-semibold">{userName}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{user?.email}</p>
                      <p className="text-gray-400 text-xs">
                        {request.status === 'pending' ? 'Sent' : 'Responded'} on {formatDate(request.sentAt)}
                      </p>
                      {request.message && (
                        <p className="text-gray-600 text-sm mt-1 italic">"{request.message}"</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isReceived && request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {activeTab === 'Accepted' && (
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                        Message
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default RequestsSection;
