import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { chatService } from '../services/chatService';

// Custom hook for chat functionality
export const useChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();

  // Fetch user's chats
  const fetchChats = async () => {
    setLoading(true);
    try {
      const chatData = await chatService.getChats();
      setChats(chatData);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a chat
  const fetchMessages = async (chatId) => {
    try {
      const messageData = await chatService.getMessages(chatId);
      setMessages(messageData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message
  const sendMessage = async (chatId, content, messageType = 'text', file = null) => {
    try {
      if (socket) {
        // Send via socket for real-time delivery
        socket.emit('send-message', {
          chatId,
          content,
          messageType,
          file
        });
      } else {
        // Fallback to HTTP request
        await chatService.sendMessage(chatId, content, messageType, file);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Create new chat
  const createChat = async (participantId) => {
    try {
      const newChat = await chatService.createChat(participantId);
      setChats(prev => [newChat, ...prev]);
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    try {
      return await chatService.searchUsers(query);
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  return {
    chats,
    selectedChat,
    messages,
    loading,
    setSelectedChat,
    fetchChats,
    fetchMessages,
    sendMessage,
    createChat,
    searchUsers
  };
};