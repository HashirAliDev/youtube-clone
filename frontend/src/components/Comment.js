import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import { useSelector } from 'react-redux';

function Comment({ comment, onEdit, onDelete, onLike, onDislike }) {
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const isAuthor = user && comment.userId === user._id;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    onDelete(comment._id);
    handleMenuClose();
  };

  const handleSaveEdit = () => {
    onEdit(comment._id, editedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(comment.text);
    setIsEditing(false);
  };

  return (
    <Box sx={{ display: 'flex', mb: 2, width: '100%' }}>
      <Avatar
        src={comment.userAvatar}
        alt={comment.username}
        sx={{ width: 40, height: 40, mr: 2 }}
      >
        {comment.username?.[0]?.toUpperCase()}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            {comment.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistance(new Date(comment.createdAt), new Date(), {
              addSuffix: true,
            })}
          </Typography>
          {isAuthor && (
            <>
              <IconButton
                size="small"
                sx={{ ml: 'auto' }}
                onClick={handleMenuClick}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {isEditing ? (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              size="small"
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveEdit}
                disabled={!editedText.trim()}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
              {comment.text}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => onLike(comment._id)}
                color={comment.liked ? 'primary' : 'default'}
              >
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption">
                {comment.likes || 0}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onDislike(comment._id)}
                color={comment.disliked ? 'primary' : 'default'}
              >
                <ThumbDownIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption">
                {comment.dislikes || 0}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Comment;
