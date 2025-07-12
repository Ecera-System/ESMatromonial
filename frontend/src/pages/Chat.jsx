import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ChatSidebar from '../components/Chat/ChatSidebar';
import ChatWindow from '../components/Chat/ChatWindow';
import InPageNotificationContainer from '../components/Chat/InPageNotification';
import UserSearch from '../components/Chat/UserSearch';
import NotificationSettings from '../components/Chat/NotificationSettings';
import { useSocket } from '../contexts/Chat/SocketContext';
import { useNotifications } from '../contexts/Chat/NotificationContext';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState('');
  const location = useLocation();
  const { userId: routeUserId } = useParams();
  const { socket } = useSocket();
  const { inPageNotifications, removeInPageNotification } = useNotifications();
  const { onlineUsers } = useSocket();

  useEffect(() => {
    fetchChats();
  }, []);

  // Auto-select or create chat if userId is in route param or query string
  useEffect(() => {
    if (!loading && chats.length > 0) {
      // Prefer route param over query param
      const params = new URLSearchParams(location.search);
      const queryUserId = params.get('userId');
      const prefill = params.get('prefill');
      const userId = routeUserId || queryUserId;
      if (userId) {
        // Try to find existing chat
        let chat = chats.find(c =>
          c.participants.some(p => p._id === userId)
        );
        if (chat) {
          setSelectedChat(chat);
        } else {
          createChatWithUser(userId, prefill);
        }
        if (prefill) setPrefillMessage(decodeURIComponent(prefill));
      }
    }
    // eslint-disable-next-line
  }, [loading, chats, location.search, routeUserId]);

  const createChatWithUser = async (userId, prefill) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Creating chat with user:', userId, 'token:', !!token);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/chat`, 
        { participantId: userId }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Chat created successfully:', res.data);
      setChats(prev => {
        // Prevent duplicate chats
        if (prev.some(chat => chat._id === res.data._id)) return prev;
        return [res.data, ...prev];
      });
      setSelectedChat(res.data);
      if (prefill) setPrefillMessage(decodeURIComponent(prefill));
    } catch (err) {
      console.error('Error creating chat:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('chat-updated', handleChatUpdated);

      return () => {
        socket.off('chat-updated');
      };
    }
  }, [socket]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching chats with token:', !!token);
      console.log('API URL:', import.meta.env.VITE_API_URL);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/chat`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Chats fetched successfully:', response.data);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
      console.error('Error details:', error.response?.data);
      if (error.response?.status === 401) {
        console.error('Authentication failed - redirecting to login');
        // Optionally redirect to login
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChatUpdated = ({ chatId, lastMessage }) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat._id === chatId 
          ? { ...chat, lastMessage, updatedAt: new Date() }
          : chat
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    if (socket) {
      socket.emit('join-chat', chat._id);
    }
  };

  const handleNewChat = (newChat) => {
    setChats(prevChats => [newChat, ...prevChats]);
    setSelectedChat(newChat);
  };

  const handleMessageSent = (message) => {
    // Update chat list when user sends a message
    setChats(prevChats => 
      prevChats.map(chat => 
        chat._id === message.chat 
          ? { ...chat, lastMessage: message, updatedAt: new Date() }
          : chat
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  if (loading) {
    return (
      <div className="mobile-viewport flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Desktop Layout - Sidebar + Chat */}
      <div className="hidden lg:flex w-full h-full">
        {/* Sidebar */}
        <div className="w-80 xl:w-96 relative border-r border-white/10 h-full flex-shrink-0">
          <ChatSidebar 
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            onShowUserSearch={setShowUserSearch}
            onShowNotificationSettings={setShowNotificationSettings}
          />
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 relative min-w-0 h-full">
          <ChatWindow 
            selectedChat={selectedChat}
            onMessageSent={handleMessageSent}
            onlineUsers={onlineUsers}
            prefillMessage={prefillMessage}
          />
        </div>
      </div>

      {/* Mobile Layout - Full Screen */}
      <div className="lg:hidden w-full h-full">
        {selectedChat ? (
          // Full screen chat window
          <div className="h-full">
            <ChatWindow 
              selectedChat={selectedChat}
              onMessageSent={handleMessageSent}
              onlineUsers={onlineUsers}
              mobileBackButton={handleBackToChats}
              prefillMessage={prefillMessage}
            />
          </div>
        ) : (
          // Full screen chat list
          <div className="h-full">
            <ChatSidebar 
              chats={chats}
              selectedChat={selectedChat}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onShowUserSearch={setShowUserSearch}
              onShowNotificationSettings={setShowNotificationSettings}
            />
          </div>
        )}
      </div>

      {/* In-page notifications */}
      <div className="fixed top-4 left-4 right-4 z-50 lg:top-6 lg:left-6 lg:right-6 pointer-events-none">
        <InPageNotificationContainer 
          notifications={inPageNotifications}
          removeNotification={removeInPageNotification}
        />
      </div>

      {/* Modals */}
      <UserSearch
        isOpen={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        onChatCreate={handleNewChat}
      />

      <NotificationSettings 
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
    </div>
  );
};

export default Chat;
