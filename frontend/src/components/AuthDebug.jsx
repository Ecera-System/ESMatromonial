import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User: {user ? `${user.firstName} ${user.lastName}` : 'null'}</div>
      <div>Token: {localStorage.getItem('token') ? 'exists' : 'missing'}</div>
    </div>
  );
};

export default AuthDebug;
