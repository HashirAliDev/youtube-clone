import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Box,
  CardActions,
} from '@mui/material';
import { formatDistance } from 'date-fns';
import VideoActions from './VideoActions';

function VideoCard({ video }) {
  const navigate = useNavigate();
  
  const {
    id,
    snippet: {
      title,
      channelTitle,
      thumbnails,
      publishedAt,
      description,
    },
    statistics = {},
  } = video;

  const handleClick = () => {
    navigate(`/watch/${id}`);
  };

  const formatViewCount = (count) => {
    if (!count) return '0 views';
    if (count < 1000) return `${count} views`;
    if (count < 1000000) return `${Math.floor(count/1000)}K views`;
    return `${Math.floor(count/1000000)}M views`;
  };

  return (
    <Card 
      sx={{ 
        maxWidth: '100%',
        backgroundColor: 'background.paper',
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="160"
          image={thumbnails.medium.url}
          alt={title}
          sx={{
            objectFit: 'cover',
          }}
        />
        <CardContent sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar
              src={thumbnails?.default?.url}
              sx={{ width: 36, height: 36, mr: 1.5 }}
            />
            <Box>
              <Typography
                gutterBottom
                variant="subtitle1"
                component="div"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2em',
                  height: '2.4em',
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                {channelTitle}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  '& > :not(:last-child)': {
                    mr: 1,
                  },
                }}
              >
                <Typography variant="body2">
                  {formatViewCount(statistics.viewCount)}
                </Typography>
                <Typography variant="body2">•</Typography>
                <Typography variant="body2">
                  {formatDistance(new Date(publishedAt), new Date(), { addSuffix: true })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
        <VideoActions video={video} />
      </CardActions>
    </Card>
  );
}

export default VideoCard;
