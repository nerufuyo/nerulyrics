export interface LyricLine {
  startTime: number;
  text: string;
  id: string;
}

export interface LyricsData {
  lyrics: string;
  syncedLyrics?: LyricLine[];
  artist: string;
  title: string;
}

export interface LyricsService {
  fetchLyrics(artist: string, title: string): Promise<LyricsData | null>;
}
