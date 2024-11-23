import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL_PROD
  : process.env.REACT_APP_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/me');

// Video API calls
export const getTrendingVideos = () => api.get('/videos/trending');
export const searchVideos = (query) => api.get(`/videos/search?query=${encodeURIComponent(query)}`);
export const getVideoDetails = (videoId) => api.get(`/videos/video/${videoId}`);
export const getRelatedVideos = (videoId) => api.get(`/videos/related/${videoId}`);

// User video interactions
export const getSavedVideos = () => api.get('/videos/saved');
export const saveVideo = (videoId) => api.post('/videos/save', { videoId });
export const removeVideo = (videoId) => api.delete(`/videos/saved/${videoId}`);

// Error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

export default api;