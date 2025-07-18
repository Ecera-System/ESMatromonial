import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for admin token (when you implement admin auth later)
api.interceptors.request.use(
  (config) => {
    // TODO: Add admin token when admin auth is implemented
    // const adminToken = localStorage.getItem('adminToken');
    // if (adminToken) {
    //   config.headers.Authorization = `Bearer ${adminToken}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Coupon API calls - Updated to match server.js routes
export const couponAPI = {
  // Get all coupons with filters
  getCoupons: (params = {}) => api.get('/api/v1/admin/coupons', { params }),
  
  // Get single coupon
  getCoupon: (id) => api.get(`/api/v1/admin/coupons/${id}`),
  
  // Create new coupon
  createCoupon: (data) => api.post('/api/v1/admin/coupons', data),
  
  // Update coupon
  updateCoupon: (id, data) => api.put(`/api/v1/admin/coupons/${id}`, data),
  
  // Delete coupon
  deleteCoupon: (id) => api.delete(`/api/v1/admin/coupons/${id}`),
  
  // Validate coupon (User route)
  validateCoupon: (data) => api.post('/api/v1/admin/coupons/validate', data),
  
  // Apply coupon (User route)
  applyCoupon: (data) => api.post('/api/v1/admin/coupons/apply', data),
  
  // Redeem coupon (User route)
  redeemCoupon: (data) => api.post('/api/v1/admin/coupons/redeem', data),
};

// Analytics API calls - Updated to match server.js routes
export const analyticsAPI = {
  // Get overview statistics
  getOverview: () => api.get('/api/v1/admin/analytics/overview'),
  
  // Get revenue trends
  getRevenueTrends: (months = 6) => api.get('/api/v1/admin/analytics/revenue-trends', { params: { months } }),
  
  // Get top performing coupons
  getTopPerformers: (limit = 5) => api.get('/api/v1/admin/analytics/top-performers', { params: { limit } }),
  
  // Get user segments
  getUserSegments: () => api.get('/api/v1/admin/analytics/user-segments'),
  
  // Get plan distribution
  getPlanDistribution: () => api.get('/api/v1/admin/analytics/plan-distribution'),
  
  // Get conversion funnel
  getConversionFunnel: () => api.get('/api/v1/admin/analytics/conversion-funnel'),
};

export default api;
