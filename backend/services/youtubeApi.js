const axios = require('axios');

class YouTubeAPI {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseURL = 'https://www.googleapis.com/youtube/v3';
  }

  async getTrendingVideos(regionCode = 'US', maxResults = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/videos`, {
        params: {
          part: 'snippet,contentDetails,statistics',
          chart: 'mostPopular',
          regionCode,
          maxResults,
          key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      throw error;
    }
  }

  async searchVideos(query, maxResults = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          part: 'snippet',
          q: query,
          maxResults,
          type: 'video',
          key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }

  async getVideoDetails(videoId) {
    try {
      const response = await axios.get(`${this.baseURL}/videos`, {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoId,
          key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  async getChannelDetails(channelId) {
    try {
      const response = await axios.get(`${this.baseURL}/channels`, {
        params: {
          part: 'snippet,statistics',
          id: channelId,
          key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching channel details:', error);
      throw error;
    }
  }

  async getRelatedVideos(videoId, maxResults = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          part: 'snippet',
          relatedToVideoId: videoId,
          type: 'video',
          maxResults,
          key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching related videos:', error);
      throw error;
    }
  }

  async getVideoComments(videoId, maxResults = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/commentThreads`, {
        params: {
          part: 'snippet,replies',
          videoId,
          maxResults,
          order: 'relevance',
          key: this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching video comments:', error);
      throw error;
    }
  }
}

module.exports = new YouTubeAPI();
