import { useState, useEffect } from 'react';
import ChatSidebar from '../../components/User/Chat/ChatSidebar';
import ChatWindow from '../../components/User/Chat/ChatWindow';
import InPageNotificationContainer from '../../components/User/Chat/InPageNotification';
import { useSocket } from '../../contexts/SocketContext';
import { useNotifications } from '../../contexts/NotificationContext';
import axios from 'axios';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const { inPageNotifications, removeInPageNotification } = useNotifications();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-message', handleNewMessage);
      socket.on('chat-updated', handleChatUpdated);

      return () => {
        socket.off('new-message');
        socket.off('chat-updated');
      };
    }
  }, [socket, chats]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Chat Page: Fetching chats with token:', !!token);
      
      const response = await axios.get('http://localhost:5000/api/chats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
      if (error.response?.status === 401) {
        console.error('Auth error in Chat page');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    // Only update if the message is from another user to avoid duplicates
    if (message.sender._id !== socket.userId) {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === message.chat 
            ? { ...chat, lastMessage: message, updatedAt: new Date() }
            : chat
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-5rem)]">
        <div className="flex h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Sidebar */}
          <div className="w-80 lg:w-96 border-r border-gray-200 bg-gray-50">
            <ChatSidebar 
              chats={chats}
              selectedChat={selectedChat}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
            />
          </div>
          
          {/* Main chat area */}
          <div className="flex-1 bg-white">
            <ChatWindow 
              selectedChat={selectedChat}
              onMessageSent={handleMessageSent}
            />
          </div>
        </div>
      </div>

      {/* In-page notifications */}
      <InPageNotificationContainer 
        notifications={inPageNotifications}
        removeNotification={removeInPageNotification}
      />
    </div>
  );
};

export default Chat;
