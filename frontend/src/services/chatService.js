import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create a separate axios instance for chat service
const chatAPI = axios.create({
  baseURL: API_URL
});

// Set up axios interceptor to include auth token
chatAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('ChatService: Adding auth token to request');
  } else {
    console.warn('ChatService: No token found in localStorage');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
chatAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('ChatService: Auth error, clearing tokens');
      // Token might be expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const chatService = {
  // Get all chats for current user
  getChats: async () => {
    const response = await chatAPI.get('/chats');
    return response.data;
  },

  // Get messages for a specific chat
  getMessages: async (chatId) => {
    const response = await chatAPI.get(`/messages/${chatId}`);
    return response.data;
  },

  // Send a message
  sendMessage: async (chatId, content, messageType = 'text', file = null) => {
    const response = await chatAPI.post('/messages', {
      chatId,
      content,
      messageType,
      file
    });
    return response.data;
  },

  // Create or get existing chat
  createChat: async (participantId) => {
    const response = await chatAPI.post('/chats', {
      participantId
    });
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await chatAPI.get(`/chats/users/search?query=${query}`);
    return response.data;
  }
};

export default chatService;

// Chat service
// TODO: Implement chat service