import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
} from '@mui/material';
import ReactPlayer from 'react-player';
import {
  ThumbUp,
  ThumbDown,
  Share,
  PlaylistAdd,
} from '@mui/icons-material';
import { getVideoDetails, getRelatedVideos, getChannelDetails } from '../services/api';
import VideoActions from '../components/VideoActions';
import RelatedVideos from '../components/RelatedVideos';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';

function VideoPlayer() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get the video details
        const videoData = await getVideoDetails(videoId);
        
        // Then use the channelId from videoData to get channel details
        const channelId = videoData?.items[0]?.snippet?.channelId;
        const [channelData, relatedData] = await Promise.all([
          getChannelDetails(channelId),
          getRelatedVideos(videoId)
        ]);

        setVideo(videoData.items[0]);
        setChannel(channelData.items[0]);
        setRelatedVideos(relatedData.items);
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Failed to load video content');
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [videoId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!video) {
    return null;
  }

  const { snippet, statistics } = video;

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        {/* Video Player */}
        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            controls
            playing
          />
        </Box>

        {/* Video Info */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {snippet.title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            {/* Channel Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                src={channel?.snippet?.thumbnails?.default?.url}
                sx={{ width: 40, height: 40, mr: 1 }}
              />
              <Box>
                <Typography variant="subtitle1">
                  {snippet.channelTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCount(channel?.statistics?.subscriberCount)} subscribers
                </Typography>
              </Box>
            </Box>

            {/* Video Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<ThumbUp />}
                sx={{ borderRadius: 5 }}
              >
                {formatCount(statistics.likeCount)}
              </Button>
              <Button
                variant="contained"
                startIcon={<ThumbDown />}
                sx={{ borderRadius: 5 }}
              >
                Dislike
              </Button>
              <Button
                variant="contained"
                startIcon={<Share />}
                sx={{ borderRadius: 5 }}
              >
                Share
              </Button>
              <VideoActions video={video} />
            </Box>
          </Box>

          {/* Video Description */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {snippet.description}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Comments Section */}
          <CommentSection videoId={videoId} />
        </Box>
      </Grid>

      {/* Related Videos */}
      <Grid item xs={12} md={4}>
        <RelatedVideos
          videos={relatedVideos}
          loading={loading}
          error={error}
        />
      </Grid>
    </Grid>
  );
}

export default VideoPlayer;
