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
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching trending videos:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch trending videos' });
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
    res.json(response.data);
  } catch (error) {
    console.error('Error searching videos:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to search videos' });
  }
});

// Get video details
router.get('/video/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching video:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch video details' });
  }
});

// Get channel details
router.get('/channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet,statistics',
        id: channelId,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching channel:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch channel details' });
  }
});

// Get related videos
router.get('/related/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        relatedToVideoId: videoId,
        type: 'video',
        maxResults: 15,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    if (!response.data.items) {
      return res.status(404).json({ message: 'No related videos found' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching related videos:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch related videos' });
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
    res.json(user.savedVideos);
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ message: 'Failed to save video' });
  }
});

// Get user's saved videos
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.savedVideos);
  } catch (error) {
    console.error('Error fetching saved videos:', error);
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
    res.json(user.savedVideos);
  } catch (error) {
    console.error('Error removing saved video:', error);
    res.status(500).json({ message: 'Failed to remove video' });
  }
});

module.exports = router;
