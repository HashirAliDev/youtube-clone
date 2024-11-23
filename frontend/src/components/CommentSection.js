import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Comment from './Comment';
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
} from '../services/api';

function CommentSection({ videoId }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const response = await getComments(videoId);
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await addComment(videoId, { text: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId, text) => {
    try {
      const response = await updateComment(commentId, { text });
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? response.data : comment
        )
      );
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) return;

    try {
      const response = await likeComment(commentId);
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? response.data : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislikeComment = async (commentId) => {
    if (!isAuthenticated) return;

    try {
      const response = await dislikeComment(commentId);
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? response.data : comment
        )
      );
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

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

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {comments.length} Comments
      </Typography>

      {isAuthenticated ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            sx={{ width: 40, height: 40, mr: 2 }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="text"
                onClick={() => setNewComment('')}
                disabled={!newComment}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Comment
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please sign in to comment
        </Typography>
      )}

      <Divider sx={{ mb: 3 }} />

      <Box>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            onLike={handleLikeComment}
            onDislike={handleDislikeComment}
          />
        ))}
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            No comments yet
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default CommentSection;
