import React from 'react';
import { X } from 'lucide-react';
import type { LyricLine } from '../../types/lyrics';
import { LyricsDisplay } from './LyricsDisplay';

interface FullscreenLyricsProps {
  lyrics: LyricLine[];
  currentTime: number;
  songTitle?: string;
  artist?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const FullscreenLyrics: React.FC<FullscreenLyricsProps> = ({
  lyrics,
  currentTime,
  songTitle,
  artist,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div>
          {songTitle && (
            <h1 className="text-2xl font-bold text-white">{songTitle}</h1>
          )}
          {artist && (
            <p className="text-lg text-white/70">{artist}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
        >
          <X className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Lyrics content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <div className="w-full max-w-4xl">
          <LyricsDisplay
            lyrics={lyrics}
            currentTime={currentTime}
            className="max-h-none"
          />
        </div>
      </div>
    </div>
  );
};
