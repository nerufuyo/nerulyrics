import React from 'react';
import { Music, Maximize2 } from 'lucide-react';
import type { SearchResult } from '../../types/music';

interface NowPlayingProps {
  currentSong: SearchResult | null;
  onToggleFullscreenLyrics?: () => void;
  className?: string;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({
  currentSong,
  onToggleFullscreenLyrics,
  className = '',
}) => {
  if (!currentSong) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
          <Music className="h-8 w-8 text-white/40" />
        </div>
        <div>
          <p className="text-white/60">No song playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <img
        src={currentSong.thumbnail}
        alt={currentSong.title}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate">{currentSong.title}</h3>
        <p className="text-white/70 truncate">{currentSong.artist}</p>
      </div>
      {onToggleFullscreenLyrics && (
        <button
          onClick={onToggleFullscreenLyrics}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
          title="View fullscreen lyrics"
        >
          <Maximize2 className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
};
