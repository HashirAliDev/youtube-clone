import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import VideoCard from './VideoCard';

function RelatedVideos({ videos, loading, error }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!videos?.length) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography color="text.secondary" align="center">
          No related videos found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {videos.map((video) => (
        <Box key={video.id} sx={{ maxWidth: '100%' }}>
          <VideoCard video={video} />
        </Box>
      ))}
    </Box>
  );
}

export default RelatedVideos;
