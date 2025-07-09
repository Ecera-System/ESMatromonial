import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      console.log('Page visibility changed:', !document.hidden ? 'visible' : 'hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.log('🔌 Connecting to socket for user:', user.name);
      
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to server');
        setSocket(newSocket);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
      });

      // Handle user online/offline status
      newSocket.on('user-online', ({ userId, userName }) => {
        console.log(`👋 ${userName} came online`);
        setOnlineUsers(prev => new Set([...prev, userId]));
      });

      newSocket.on('user-offline', ({ userId, userName }) => {
        console.log(`👋 ${userName} went offline`);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      return () => {
        console.log('🔌 Cleaning up socket connection');
        newSocket.close();
        setSocket(null);
      };
    }
  }, [user]);

  const value = {
    socket,
    onlineUsers,
    isVisible
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
