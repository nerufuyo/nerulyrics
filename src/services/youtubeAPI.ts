import axios from 'axios';
import type { SearchResult, SearchService } from '../types/music';

// Note: In a real app, store this in environment variables
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Replace with actual API key

class YouTubeSearchService implements SearchService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey: string = YOUTUBE_API_KEY) {
    this.apiKey = apiKey;
  }

  async search(query: string): Promise<SearchResult[]> {
    try {
      // For demo purposes, return mock data if no API key
      if (!this.apiKey || this.apiKey === 'YOUR_YOUTUBE_API_KEY') {
        return this.getMockResults(query);
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoCategoryId: '10', // Music category
          maxResults: 20,
          key: this.apiKey,
        },
      });

      return response.data.items.map((item: any): SearchResult => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        duration: 0, // Will be fetched separately if needed
        thumbnail: item.snippet.thumbnails.medium.url,
        streamUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        videoId: item.id.videoId,
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      return this.getMockResults(query);
    }
  }

  async getStreamUrl(id: string): Promise<string> {
    // In a real implementation, you'd need a service to extract actual stream URLs
    // For now, return YouTube URL
    return `https://www.youtube.com/watch?v=${id}`;
  }

  private getMockResults(query: string): SearchResult[] {
    // Mock data for demo purposes
    return [
      {
        id: '1',
        title: `${query} - Song 1`,
        artist: 'Demo Artist',
        duration: 210,
        thumbnail: 'https://via.placeholder.com/320x180/667eea/ffffff?text=Music',
        streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId: 'dQw4w9WgXcQ',
      },
      {
        id: '2',
        title: `${query} - Song 2`,
        artist: 'Another Artist',
        duration: 185,
        thumbnail: 'https://via.placeholder.com/320x180/764ba2/ffffff?text=Music',
        streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId: 'dQw4w9WgXcQ',
      },
      {
        id: '3',
        title: `${query} - Remix`,
        artist: 'Remix Artist',
        duration: 240,
        thumbnail: 'https://via.placeholder.com/320x180/f093fb/ffffff?text=Music',
        streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId: 'dQw4w9WgXcQ',
      },
    ];
  }
}

export const youtubeService = new YouTubeSearchService();
