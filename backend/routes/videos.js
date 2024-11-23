const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

// Get trending videos
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        maxResults: 20,
        key: process.env.YOUTUBE_API_KEY
      }
    });
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching trending videos:', error.response?.data || error.message);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.status(500).json({ 
      message: 'Failed to fetch trending videos',
      error: error.response?.data || error.message 
    });
  }
});

// Search videos
router.get('/search', async (req, res) => {
  try {
    const { query = '' } = req.query;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        maxResults: 20,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY
      }
    });
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.json(response.data);
  } catch (error) {
    console.error('Error searching videos:', error.response?.data || error.message);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.status(500).json({ 
      message: 'Failed to search videos',
      error: error.response?.data || error.message 
    });
  }
});

// Get video details
router.get('/video/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching video details for:', id);

    if (!id) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (!response.data) {
      console.error('No data received from YouTube API');
      return res.status(500).json({ message: 'No response from YouTube API' });
    }

    if (!response.data.items || response.data.items.length === 0) {
      console.log('Video not found:', id);
      return res.status(404).json({ message: 'Video not found' });
    }

    console.log('Successfully fetched video details');
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching video:', {
      videoId: id,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Check if it's a YouTube API error
    if (error.response?.data?.error) {
      return res.status(error.response.status).json({
        message: error.response.data.error.message,
        code: error.response.data.error.code
      });
    }

    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.status(500).json({ 
      message: 'Failed to fetch video details',
      error: error.response?.data || error.message 
    });
  }
});

// Get channel details
router.get('/channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    console.log('Fetching channel details for:', channelId);

    if (!channelId) {
      return res.status(400).json({ message: 'Channel ID is required' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet,statistics',
        id: channelId,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (!response.data) {
      console.error('No data received from YouTube API');
      return res.status(500).json({ message: 'No response from YouTube API' });
    }

    if (!response.data.items || response.data.items.length === 0) {
      console.log('Channel not found:', channelId);
      return res.status(404).json({ message: 'Channel not found' });
    }

    console.log('Successfully fetched channel details');
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching channel details:', error.response?.data || error.message);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.status(500).json({ 
      message: 'Failed to fetch channel details',
      error: error.response?.data || error.message 
    });
  }
});

// Get related videos
router.get('/related/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    console.log('Fetching related videos for:', videoId);
    
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        relatedToVideoId: videoId,
        type: 'video',
        maxResults: 15,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (!response.data) {
      console.error('No data received from YouTube API');
      return res.status(500).json({ message: 'No response from YouTube API' });
    }

    if (!response.data.items) {
      console.log('No related videos found for:', videoId);
      return res.status(404).json({ message: 'No related videos found' });
    }

    console.log(`Found ${response.data.items.length} related videos`);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching related videos:', error.response?.data || error.message);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.status(500).json({ 
      message: 'Failed to fetch related videos',
      error: error.response?.data || error.message 
    });
  }
});

// Save video to user's saved videos
router.post('/save', auth, async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user.id);

    // Check if video is already saved
    const videoExists = user.savedVideos.find(video => video.videoId === videoId);
    if (videoExists) {
      return res.status(400).json({ message: 'Video already saved' });
    }

    // Get video details from YouTube API
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY
      }
    });
    const videoDetails = response.data.items[0];

    user.savedVideos.push({
      videoId,
      title: videoDetails.snippet.title,
      thumbnail: videoDetails.snippet.thumbnails.default.url,
      channelTitle: videoDetails.snippet.channelTitle,
      savedAt: Date.now()
    });

    await user.save();
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.json(user.savedVideos);
  } catch (error) {
    console.error('Error saving video:', error);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.status(500).json({ message: 'Failed to save video' });
  }
});

// Get user's saved videos
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.json(user.savedVideos);
  } catch (error) {
    console.error('Error fetching saved videos:', error);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.status(500).json({ message: 'Failed to fetch saved videos' });
  }
});

// Remove video from saved videos
router.delete('/saved/:videoId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedVideos = user.savedVideos.filter(
      video => video.videoId !== req.params.videoId
    );
    await user.save();
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.json(user.savedVideos);
  } catch (error) {
    console.error('Error removing saved video:', error);
    res.header('Access-Control-Allow-Origin', 'https://youtube-clone-frontend-3fx5.onrender.com');
    res.status(500).json({ message: 'Failed to remove video' });
  }
});

module.exports = router;
