import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageCircle, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/Chat/AuthContext';
import UserSearch from './UserSearch';
import NotificationSettings from './NotificationSettings';
import { useNotifications } from '../../contexts/Chat/NotificationContext';
import { format, isToday, isYesterday } from 'date-fns';

const ChatSidebar = ({ chats, selectedChat, onChatSelect, onNewChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const { user, logout } = useAuth();
  const { isEnabled: notificationsEnabled } = useNotifications();

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants.find(p => p._id !== user.id);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatLastMessageTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMM dd');
    }
  };

  const getLastMessagePreview = (message) => {
    if (!message) return 'No messages yet';
    
    // Handle different message types
    switch (message.messageType) {
      case 'image':
        return '📷 Image';
      case 'video':
        return '🎥 Video';
      case 'document':
        return '📄 Document';
      case 'file':
        return '📎 File';
      default: {
        // Handle emoji-only messages
        const isEmojiOnly = (text) => {
          const withoutEmojis = text.replace(/\p{Emoji}/gu, '');
          return withoutEmojis.trim().length === 0 && text.trim().length > 0;
        };

        if (isEmojiOnly(message.content)) {
          return message.content;
        }

        return message.content.length > 50 
          ? message.content.substring(0, 50) + '...'
          : message.content;
      }
    }
  };

  return (
    <div className="h-full glass flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        {/* User Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                <User className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white status-online"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">{user?.name}</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotificationSettings(true)}
              className={`p-2 rounded-lg transition-colors ${
                notificationsEnabled 
                  ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Notification Settings"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowUserSearch(true)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={logout}
              className="p-2 bg-gray-100 hover:bg-red-100 rounded-lg transition-colors text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2 gradient-text">
              {searchTerm ? 'No chats found' : 'Start a conversation'}
            </h3>
            <p className="text-center text-gray-400 mb-6">
              Connect with someone special today
            </p>
            <button
              onClick={() => setShowUserSearch(true)}
              className="px-6 py-3 btn-primary text-white rounded-xl font-semibold"
            >
              Find People
            </button>
          </div>
        ) : (
          <div className="p-3">
            {filteredChats.map((chat) => {
              const otherUser = chat.participants.find(p => p._id !== user.id);
              const isSelected = selectedChat?._id === chat._id;

              return (
                <div
                  key={chat._id}
                  onClick={() => onChatSelect(chat)}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all hover-lift mb-2 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500 shadow-md' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
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

                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate text-lg">
                        {otherUser?.name}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {formatLastMessageTime(chat.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {getLastMessagePreview(chat.lastMessage)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Search Modal */}
      <AnimatePresence>
        {showUserSearch && (
          <UserSearch
            onClose={() => setShowUserSearch(false)}
            onChatCreate={onNewChat}
          />
        )}
      </AnimatePresence>

      {/* Notification Settings Modal */}
      <NotificationSettings 
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
    </div>
  );
};

export default ChatSidebar;
