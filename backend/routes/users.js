const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create playlist
router.post('/playlists', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);

    user.playlists.push({ name, videos: [] });
    await user.save();

    res.json(user.playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add video to playlist
router.post('/playlists/:playlistId/videos', auth, async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user.id);
    const playlist = user.playlists.id(req.params.playlistId);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.videos.push({ videoId });
    await user.save();

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove video from playlist
router.delete('/playlists/:playlistId/videos/:videoId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const playlist = user.playlists.id(req.params.playlistId);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.videos = playlist.videos.filter(
      video => video.videoId !== req.params.videoId
    );
    await user.save();

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete playlist
router.delete('/playlists/:playlistId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.playlists = user.playlists.filter(
      playlist => playlist._id.toString() !== req.params.playlistId
    );
    await user.save();

    res.json(user.playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
