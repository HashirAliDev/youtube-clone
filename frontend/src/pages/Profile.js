import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSavedVideos, createPlaylist } from '../services/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [savedVideos, setSavedVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPlaylistDialog, setOpenPlaylistDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        const videos = await getSavedVideos();
        setSavedVideos(videos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user content:', error);
        setLoading(false);
      }
    };

    fetchUserContent();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreatePlaylist = async () => {
    try {
      const newPlaylist = await createPlaylist(newPlaylistName);
      setPlaylists([...playlists, newPlaylist]);
      setOpenPlaylistDialog(false);
      setNewPlaylistName('');
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={user?.avatar}
              alt={user?.username}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {user?.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Content Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Saved Videos" />
                <Tab label="Playlists" />
              </Tabs>
            </Box>

            {/* Saved Videos Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                {savedVideos.map((video) => (
                  <Grid item xs={12} sm={6} md={4} key={video.id}>
                    <VideoCard video={video} />
                  </Grid>
                ))}
                {savedVideos.length === 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body1" textAlign="center">
                      No saved videos yet
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            {/* Playlists Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setOpenPlaylistDialog(true)}
                >
                  Create New Playlist
                </Button>
              </Box>
              <Grid container spacing={2}>
                {playlists.map((playlist) => (
                  <Grid item xs={12} sm={6} md={4} key={playlist._id}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {playlist.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {playlist.videos.length} videos
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
                {playlists.length === 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body1" textAlign="center">
                      No playlists created yet
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Create Playlist Dialog */}
      <Dialog
        open={openPlaylistDialog}
        onClose={() => setOpenPlaylistDialog(false)}
      >
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            type="text"
            fullWidth
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPlaylistDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePlaylist} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile;
