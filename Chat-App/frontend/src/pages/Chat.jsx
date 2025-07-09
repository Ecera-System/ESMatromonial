import { useState, useEffect } from 'react';
import ChatSidebar from '../components/Chat/ChatSidebar';
import ChatWindow from '../components/Chat/ChatWindow';
import InPageNotificationContainer from '../components/Chat/InPageNotification';
import { useSocket } from '../contexts/Chat/SocketContext';
import { useNotifications } from '../contexts/Chat/NotificationContext';
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
      const response = await axios.get('http://localhost:5000/api/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
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
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="w-80 lg:w-96 relative z-10 border-r border-white/10">
        <ChatSidebar 
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 relative z-10">
        <ChatWindow 
          selectedChat={selectedChat}
          onMessageSent={handleMessageSent}
        />
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
