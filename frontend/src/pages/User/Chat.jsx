import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

const Chat = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: 'Hello! Nice to meet you 😊', time: '10:30 AM', reactions: ['❤️', '👍'] },
    { id: 2, sender: 'me', text: 'Hi there! Pleasure to meet you too!', time: '10:32 AM' },
    { id: 3, sender: 'other', text: 'How has your day been?', time: '10:35 AM' },
    { id: 4, sender: 'other', text: 'I hope you\'re having a wonderful time! ✨', time: '10:36 AM' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 4) {
      const timer = setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [messages.length])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'me',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const handleLogout = () => {
    navigate('/');
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/20">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">Sarah is typing...</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton className="bg-white/20 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/30" />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-br from-indigo-300/30 to-blue-300/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-gradient-to-br from-rose-300/30 to-pink-300/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Chat Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <img 
                src="/assets/photo.jpg" 
                alt="User" 
                className="relative w-14 h-14 rounded-full border-3 border-white shadow-lg transform transition-transform group-hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full shadow-md animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Amit More
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600 font-medium">Active now</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/20">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
            </button>
            <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/20">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
        {messages.map((message, index) => (
          <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} group`}>
            <div className={`max-w-xs lg:max-w-md transform transition-all duration-300 hover:scale-[1.02] ${
              message.sender === 'me' 
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-purple-200' 
                : 'bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg shadow-gray-200 border border-white/20'
            } rounded-3xl px-5 py-4 relative`}>
              {/* Message tail */}
              <div className={`absolute ${
                message.sender === 'me' 
                  ? '-right-1 bottom-4 w-4 h-4 bg-gradient-to-br from-purple-500 to-rose-500 transform rotate-45' 
                  : '-left-1 bottom-4 w-4 h-4 bg-white/90 border-l border-b border-white/20 transform rotate-45'
              }`}></div>
              
              <p className="text-sm leading-relaxed font-medium">{message.text}</p>
              
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${
                  message.sender === 'me' ? 'text-purple-100' : 'text-gray-500'
                } font-medium`}>
                  {message.time}
                </span>
                
                {message.reactions && (
                  <div className="flex space-x-1 ml-2">
                    {message.reactions.map((reaction, idx) => (
                      <span key={idx} className="text-xs bg-white/20 rounded-full px-2 py-1">
                        {reaction}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {message.sender === 'me' && (
                <div className="absolute -bottom-1 -right-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="relative z-10 p-4 bg-white/10 backdrop-blur-xl border-t border-white/20">
        <form onSubmit={handleSendMessage} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-3 border border-white/20">
          <div className="flex items-center space-x-3">
            <button 
              type="button" 
              className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none px-4 py-3 text-gray-700 placeholder-gray-400 font-medium"
            />
            
            <div className="flex items-center space-x-2">
              <button 
                type="button" 
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
              </button>
              
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg ${
                  newMessage.trim() 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>
        </form>
        
        {/* Quick Actions */}
        <div className="flex justify-center mt-3 space-x-2">
          <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-sm text-gray-600 rounded-full hover:bg-white/30 transition-all duration-200 border border-white/20">
            👋 Wave
          </button>
          <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-sm text-gray-600 rounded-full hover:bg-white/30 transition-all duration-200 border border-white/20">
            ❤️ Heart
          </button>
          <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-sm text-gray-600 rounded-full hover:bg-white/30 transition-all duration-200 border border-white/20">
            👍 Like
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat