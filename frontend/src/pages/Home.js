import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Skeleton } from '@mui/material';
import VideoCard from '../components/VideoCard';
import { getTrendingVideos } from '../services/api';

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getTrendingVideos();
        setVideos(data.items);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos');
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(12)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box sx={{ width: '100%' }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={160}
                    animation="wave"
                  />
                  <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>
                </Box>
              </Grid>
            ))
          : videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                <VideoCard video={video} />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
}

export default Home;
