import { motion, AnimatePresence } from 'framer-motion';

const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
    } else {
      return 'Several people are typing...';
    }
  };

  return (
    <AnimatePresence>
      {typingUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="px-4 py-2 sm:px-6 sm:py-3 mb-2"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
              <div className="flex space-x-1">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-gray-500 italic font-medium"
            >
              {getTypingText()}
            </motion.p>
          </div>
          
          {/* CSS for typing dots animation - Mobile optimized */}
          <style jsx>{`
            .typing-dot {
              width: 4px;
              height: 4px;
              background-color: #f43f5e;
              border-radius: 50%;
              animation: typing 1.4s infinite ease-in-out;
            }
            
            @media (min-width: 640px) {
              .typing-dot {
                width: 6px;
                height: 6px;
              }
            }
            
            .typing-dot:nth-child(1) {
              animation-delay: -0.32s;
            }
            
            .typing-dot:nth-child(2) {
              animation-delay: -0.16s;
            }
            
            @keyframes typing {
              0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
              }
              40% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypingIndicator;
