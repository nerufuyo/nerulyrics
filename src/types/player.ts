export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  shuffleMode: boolean;
}

export interface UIState {
  isIdle: boolean;
  showUI: boolean;
  isFullscreenLyrics: boolean;
}
