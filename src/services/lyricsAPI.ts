import axios from 'axios';
import type { LyricsData, LyricsService, LyricLine } from '../types/lyrics';

class LyricsAPIService implements LyricsService {
  private baseUrl = 'https://api.lyrics.ovh/v1';

  async fetchLyrics(artist: string, title: string): Promise<LyricsData | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
      );

      if (response.data.lyrics) {
        return {
          lyrics: response.data.lyrics,
          artist,
          title,
          syncedLyrics: this.parseLRCFormat(response.data.lyrics),
        };
      }

      return null;
    } catch (error) {
      console.error('Lyrics fetch error:', error);
      // Return demo lyrics for testing
      return this.getDemoLyrics(artist, title);
    }
  }

  private parseLRCFormat(lyrics: string): LyricLine[] | undefined {
    // Parse LRC format: [mm:ss.xx]lyric text
    const lrcRegex = /\[(\d{2}):(\d{2})\.(\d{2})\](.*)/g;
    const lines: LyricLine[] = [];
    let match;

    while ((match = lrcRegex.exec(lyrics)) !== null) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const centiseconds = parseInt(match[3]);
      const text = match[4].trim();

      if (text) {
        lines.push({
          startTime: minutes * 60 + seconds + centiseconds / 100,
          text,
          id: `${lines.length}`,
        });
      }
    }

    return lines.length > 0 ? lines : undefined;
  }

  private getDemoLyrics(artist: string, title: string): LyricsData {
    return {
      lyrics: `[00:00.00]${title}
[00:05.00]By ${artist}
[00:10.00]
[00:15.00]This is a demo song
[00:20.00]With sample lyrics
[00:25.00]To show how the player works
[00:30.00]
[00:35.00]The beat goes on and on
[00:40.00]Music fills the air
[00:45.00]Dancing through the night
[00:50.00]Without a single care
[00:55.00]
[01:00.00]Demo lyrics continue here
[01:05.00]Showing the sync feature
[01:10.00]Every line appears
[01:15.00]At the perfect beat`,
      artist,
      title,
      syncedLyrics: [
        { startTime: 0, text: `${title}`, id: '0' },
        { startTime: 5, text: `By ${artist}`, id: '1' },
        { startTime: 15, text: 'This is a demo song', id: '2' },
        { startTime: 20, text: 'With sample lyrics', id: '3' },
        { startTime: 25, text: 'To show how the player works', id: '4' },
        { startTime: 35, text: 'The beat goes on and on', id: '5' },
        { startTime: 40, text: 'Music fills the air', id: '6' },
        { startTime: 45, text: 'Dancing through the night', id: '7' },
        { startTime: 50, text: 'Without a single care', id: '8' },
        { startTime: 60, text: 'Demo lyrics continue here', id: '9' },
        { startTime: 65, text: 'Showing the sync feature', id: '10' },
        { startTime: 70, text: 'Every line appears', id: '11' },
        { startTime: 75, text: 'At the perfect beat', id: '12' },
      ],
    };
  }
}

export const lyricsService = new LyricsAPIService();
