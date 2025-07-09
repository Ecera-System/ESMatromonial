import { motion } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import FileMessage from './FileMessage';

const MessageList = ({ messages, currentUserId }) => {
  const formatMessageTime = (date) => {
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`;
    } else {
      return format(messageDate, 'MMM dd, HH:mm');
    }
  };

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const previousDate = new Date(previousMessage.createdAt).toDateString();
    
    return currentDate !== previousDate;
  };

  const formatDateSeparator = (date) => {
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
      return 'Today';
    } else if (isYesterday(messageDate)) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMMM dd, yyyy');
    }
  };

  const isEmojiOnly = (text) => {
    // Remove all emojis and check if anything remains
    const withoutEmojis = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    return withoutEmojis.trim().length === 0 && text.trim().length > 0;
  };

  // Filter out temporary messages that have been replaced by real ones
  const filteredMessages = messages.filter((message, index, arr) => {
    if (message.isTemp) {
      // Check if there's a real message with the same content and sender
      const hasRealMessage = arr.some(msg => 
        !msg.isTemp && 
        msg.content === message.content && 
        msg.sender._id === message.sender._id &&
        Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 10000 // Within 10 seconds
      );
      return !hasRealMessage;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {filteredMessages.map((message, index) => {
        const isOwnMessage = message.sender._id === currentUserId;
        const previousMessage = filteredMessages[index - 1];
        const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
        const emojiOnly = message.messageType === 'text' && isEmojiOnly(message.content);
        const isFileMessage = ['image', 'video', 'document', 'file'].includes(message.messageType);

        return (
          <div key={message._id}>
            {/* Date Separator */}
            {showDateSeparator && (
              <div className="flex justify-center my-6">
                <span className="px-4 py-2 bg-white text-gray-600 text-sm rounded-full shadow-sm border border-gray-200 font-medium">
                  {formatDateSeparator(message.createdAt)}
                </span>
              </div>
            )}

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-3 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                {!isOwnMessage && (
                  <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
                    {message.sender.avatar ? (
                      <img 
                        src={message.sender.avatar} 
                        alt={message.sender.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      message.sender.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                )}

                {/* Message Content */}
                <div className={`relative ${
                  isFileMessage || emojiOnly 
                    ? 'bg-transparent p-1' 
                    : `px-6 py-4 rounded-2xl shadow-sm border ${
                        isOwnMessage 
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-200' 
                          : 'bg-white text-gray-900 border-gray-200'
                      }`
                } ${message.isTemp ? 'opacity-70' : ''}`}>
                  
                  {/* Temporary message indicator */}
                  {message.isTemp && (
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                  )}

                  {isFileMessage ? (
                    <FileMessage message={message} isOwnMessage={isOwnMessage} />
                  ) : (
                    <p className={`${emojiOnly ? 'text-4xl' : 'text-sm leading-relaxed'} break-words`}>
                      {message.content}
                    </p>
                  )}
                  
                  {!emojiOnly && !isFileMessage && (
                    <p className={`text-xs mt-2 ${
                      isOwnMessage ? 'text-rose-100' : 'text-gray-500'
                    }`}>
                      {formatMessageTime(message.createdAt)}
                    </p>
                  )}
                </div>
                
                {/* Time for emoji-only and file messages */}
                {(emojiOnly || isFileMessage) && (
                  <div className={`text-xs text-gray-500 ${isOwnMessage ? 'text-right' : 'text-left'} mt-2`}>
                    {formatMessageTime(message.createdAt)}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
