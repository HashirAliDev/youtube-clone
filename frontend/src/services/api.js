import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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
export const getUserProfile = () => api.get('/auth/profile');
export const updateUserProfile = (data) => api.put('/auth/profile', data);

// Video API calls
export const getTrendingVideos = () => api.get('/videos/trending');
export const searchVideos = (query) => api.get(`/videos/search?query=${encodeURIComponent(query)}`);
export const getVideoDetails = (videoId) => api.get(`/videos/video/${videoId}`);
export const getRelatedVideos = (videoId) => api.get(`/videos/related/${videoId}`);
export const getChannelDetails = (channelId) => api.get(`/videos/channel/${channelId}`);
export const uploadVideo = (formData) => api.post('/videos/upload', formData);
export const updateVideo = (videoId, data) => api.put(`/videos/${videoId}`, data);
export const deleteVideo = (videoId) => api.delete(`/videos/${videoId}`);

// User video interactions
export const getSavedVideos = () => api.get('/videos/saved');
export const saveVideo = (videoId) => api.post('/videos/save', { videoId });
export const removeVideo = (videoId) => api.delete(`/videos/saved/${videoId}`);
export const likeVideo = (videoId) => api.post(`/videos/${videoId}/like`);
export const dislikeVideo = (videoId) => api.post(`/videos/${videoId}/dislike`);
export const getLikedVideos = () => api.get('/videos/liked');

// Playlist API calls
export const getPlaylists = () => api.get('/playlists');
export const createPlaylist = (data) => api.post('/playlists', data);
export const getPlaylistById = (playlistId) => api.get(`/playlists/${playlistId}`);
export const updatePlaylist = (playlistId, data) => api.put(`/playlists/${playlistId}`, data);
export const deletePlaylist = (playlistId) => api.delete(`/playlists/${playlistId}`);
export const addVideoToPlaylist = (playlistId, videoId) => api.post(`/playlists/${playlistId}/videos`, { videoId });
export const removeVideoFromPlaylist = (playlistId, videoId) => api.delete(`/playlists/${playlistId}/videos/${videoId}`);
export const getUserPlaylists = () => api.get('/playlists/user');

// Comment API calls
export const getComments = (videoId) => api.get(`/comments/${videoId}`);
export const addComment = (videoId, data) => api.post(`/comments/${videoId}`, data);
export const updateComment = (commentId, data) => api.put(`/comments/${commentId}`, data);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);
export const likeComment = (commentId) => api.post(`/comments/${commentId}/like`);
export const dislikeComment = (commentId) => api.post(`/comments/${commentId}/dislike`);
export const getCommentReplies = (commentId) => api.get(`/comments/${commentId}/replies`);
export const addCommentReply = (commentId, data) => api.post(`/comments/${commentId}/replies`, data);

// Subscription API calls
export const getSubscriptions = () => api.get('/subscriptions');
export const subscribe = (channelId) => api.post(`/subscriptions/${channelId}`);
export const unsubscribe = (channelId) => api.delete(`/subscriptions/${channelId}`);
export const getSubscribers = () => api.get('/subscriptions/subscribers');

// Error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

export default api;