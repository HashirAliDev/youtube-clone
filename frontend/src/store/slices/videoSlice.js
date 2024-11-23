import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTrendingVideos,
  searchVideos,
  getVideoDetails,
  getRelatedVideos,
} from '../../services/api';

// Async thunks
export const fetchTrending = createAsyncThunk(
  'videos/fetchTrending',
  async () => {
    try {
      const response = await getTrendingVideos();
      return response.items;
    } catch (error) {
      throw error;
    }
  }
);

export const searchForVideos = createAsyncThunk(
  'videos/search',
  async (query) => {
    try {
      const response = await searchVideos(query);
      return response.items;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchById',
  async (videoId) => {
    try {
      const response = await getVideoDetails(videoId);
      const relatedVideosResponse = await getRelatedVideos(videoId);
      return {
        video: response.items[0],
        relatedVideos: relatedVideosResponse.items,
      };
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  trending: [],
  searchResults: [],
  currentVideo: null,
  relatedVideos: [],
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
      state.relatedVideos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Trending Videos
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search Videos
      .addCase(searchForVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchForVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchForVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Video Details
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload.video;
        state.relatedVideos = action.payload.relatedVideos;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearchResults, clearCurrentVideo } = videoSlice.actions;
export default videoSlice.reducer;
