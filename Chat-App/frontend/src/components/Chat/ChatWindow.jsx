import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Heart, Paperclip, Zap, Star } from 'lucide-react';
import { useAuth } from '../../contexts/Chat/AuthContext';
import { useSocket } from '../../contexts/Chat/SocketContext';

import MessageList from '../Chat/MessageList';
import TypingIndicator from '../Chat/TypingIndicator';
import EmojiPicker from '../Chat/EmojiPicker';
import FileUpload from '../Chat/FileUpload';
import axios from 'axios';

const ChatWindow = ({ selectedChat, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('new-message', handleNewMessage);
      socket.on('user-typing', handleUserTyping);
      socket.on('user-stop-typing', handleUserStopTyping);

      return () => {
        socket.off('new-message');
        socket.off('user-typing');
        socket.off('user-stop-typing');
      };
    }
  }, [socket, selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${selectedChat._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    if (message.chat === selectedChat?._id) {
      // Remove temporary message if it exists and add the real message
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => !msg._id.toString().startsWith(Date.now().toString().slice(0, -3)));
        return [...filteredMessages, message];
      });
    }
  };

  const handleUserTyping = ({ userId, userName, chatId }) => {
    // Only show typing for current chat
    if (userId !== user.id && chatId === selectedChat?._id) {
      console.log(`👀 ${userName} is typing in current chat`);
      setTypingUsers(prev => [...prev.filter(u => u.id !== userId), { id: userId, name: userName }]);
    }
  };

  const handleUserStopTyping = ({ userId, chatId }) => {
    // Only remove typing for current chat
    if (chatId === selectedChat?._id) {
      console.log(`✋ User stopped typing in current chat`);
      setTypingUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !socket) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    const messageData = {
      chatId: selectedChat._id,
      content: messageContent,
      messageType: 'text'
    };

    // Create temporary message with unique ID
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      content: messageContent,
      sender: { _id: user.id, name: user.name, avatar: user.avatar },
      createdAt: new Date(),
      messageType: 'text',
      isTemp: true
    };

    // Add temporary message immediately
    setMessages(prev => [...prev, tempMessage]);

    // Send via socket
    socket.emit('send-message', messageData);
    socket.emit('stop-typing', { chatId: selectedChat._id });

    // Notify parent component
    onMessageSent({
      chat: selectedChat._id,
      content: messageContent,
      sender: { _id: user.id, name: user.name, avatar: user.avatar },
      createdAt: new Date(),
      messageType: 'text'
    });
  };

  const handleTyping = (value) => {
    setNewMessage(value);

    if (!socket || !selectedChat) return;

    // Emit typing event with chatId
    if (value.trim()) {
      socket.emit('typing', { chatId: selectedChat._id });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { chatId: selectedChat._id });
    }, 1000);
  };

  const handleEmojiSelect = (emoji) => {
    const input = messageInputRef.current;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newValue = newMessage.slice(0, start) + emoji + newMessage.slice(end);
      setNewMessage(newValue);
      
      // Set cursor position after emoji
      setTimeout(() => {
        input.setSelectionRange(start + emoji.length, start + emoji.length);
        input.focus();
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
  };

  const handleFileSelect = async (fileData) => {
    if (!selectedChat || !socket) return;

    const messageData = {
      chatId: selectedChat._id,
      content: fileData.content,
      messageType: fileData.messageType,
      file: fileData.file
    };

    // Create temporary message
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      content: fileData.content,
      messageType: fileData.messageType,
      file: fileData.file,
      sender: { _id: user.id, name: user.name, avatar: user.avatar },
      createdAt: new Date(),
      isTemp: true
    };

    setMessages(prev => [...prev, tempMessage]);

    // Send via socket
    socket.emit('send-message', messageData);

    // Notify parent component
    onMessageSent({
      chat: selectedChat._id,
      content: fileData.content,
      messageType: fileData.messageType,
      file: fileData.file,
      sender: { _id: user.id, name: user.name, avatar: user.avatar },
      createdAt: new Date()
    });
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center glass relative">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-700 mb-4 gradient-text">
            Welcome to LoveChat
          </h3>
          <p className="text-lg text-gray-500 mb-6">
            Select a conversation to start chatting
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-500">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Where hearts connect</span>
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  const otherUser = selectedChat.participants.find(p => p._id !== user.id);

  return (
    <div className="h-full flex flex-col glass">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {otherUser?.avatar ? (
                  <img 
                    src={otherUser.avatar} 
                    alt={otherUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  otherUser?.name?.charAt(0).toUpperCase()
                )}
              </div>
              {otherUser?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{otherUser?.name}</h3>
              <div className="flex items-center space-x-2">
                {otherUser?.isOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-600 font-medium">Online</p>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <p className="text-sm text-gray-500">Offline</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {[Phone, Video, MoreVertical].map((Icon, index) => (
              <button
                key={index}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <MessageList messages={messages} currentUserId={user.id} />
            <TypingIndicator typingUsers={typingUsers} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <div className="flex items-end bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200 transition-all">
              <input
                ref={messageInputRef}
                type="text"
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-6 py-4 bg-transparent outline-none rounded-2xl text-gray-800 placeholder-gray-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="flex items-center space-x-2 pr-4 pb-3">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  isOpen={showFileUpload}
                  onToggle={setShowFileUpload}
                />
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  isOpen={showEmojiPicker}
                  onToggle={setShowEmojiPicker}
                  position="top"
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-14 h-14 btn-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
