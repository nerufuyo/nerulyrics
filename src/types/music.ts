export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  thumbnail: string;
  streamUrl: string;
  videoId?: string;
}

export interface SearchService {
  search(query: string): Promise<SearchResult[]>;
  getStreamUrl(id: string): Promise<string>;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentSong: SearchResult | null;
}

export interface PlayerControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  previous: () => void;
}
