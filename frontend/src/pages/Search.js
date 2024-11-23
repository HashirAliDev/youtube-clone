import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Container, Grid } from '@mui/material';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchVideos } from '../services/api';

function Search() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchVideos(searchQuery);
        setVideos(response.items || []);
      } catch (err) {
        setError('Failed to fetch search results. Please try again later.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!videos.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">
          No results found for "{searchQuery}"
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Search results for "{searchQuery}"
      </Typography>
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id.videoId}>
            <VideoCard video={video} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Search;
