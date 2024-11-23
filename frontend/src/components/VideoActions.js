import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  PlaylistAdd as PlaylistAddIcon,
  BookmarkAdd as BookmarkAddIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { saveVideo, addVideoToPlaylist } from '../services/api';

function VideoActions({ video }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [message, setMessage] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveVideo = async () => {
    if (!isAuthenticated) {
      // Handle unauthenticated user
      return;
    }

    try {
      await saveVideo(video.id);
      setMessage('Video saved successfully');
    } catch (error) {
      console.error('Error saving video:', error);
      setMessage('Failed to save video');
    }
    handleClose();
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await addVideoToPlaylist(playlistId, video.id);
      setMessage('Added to playlist successfully');
    } catch (error) {
      console.error('Error adding to playlist:', error);
      setMessage('Failed to add to playlist');
    }
    setPlaylistDialogOpen(false);
    handleClose();
  };

  const openPlaylistDialog = () => {
    setPlaylistDialogOpen(true);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSaveVideo}>
          <BookmarkAddIcon sx={{ mr: 1 }} />
          Save Video
        </MenuItem>
        <MenuItem onClick={openPlaylistDialog}>
          <PlaylistAddIcon sx={{ mr: 1 }} />
          Add to Playlist
        </MenuItem>
      </Menu>

      {/* Playlist Selection Dialog */}
      <Dialog
        open={playlistDialogOpen}
        onClose={() => setPlaylistDialogOpen(false)}
      >
        <DialogTitle>Add to Playlist</DialogTitle>
        <DialogContent>
          {playlists.length > 0 ? (
            <List>
              {playlists.map((playlist) => (
                <ListItem
                  button
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                >
                  <ListItemText primary={playlist.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No playlists available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlaylistDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Message Snackbar can be added here */}
    </>
  );
}

export default VideoActions;
