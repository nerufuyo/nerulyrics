import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
} from 'lucide-react';
import type { PlayerState } from '../../types/player';

interface PlayerControlsProps {
  playerState: PlayerState;
  onTogglePlayPause: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  className?: string;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  playerState,
  onTogglePlayPause,
  onPrevious,
  onNext,
  onVolumeChange,
  onToggleMute,
  className = '',
}) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    onVolumeChange(volume);
  };

  return (
    <div className={`flex items-center justify-center space-x-6 ${className}`}>
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={!onPrevious}
        className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SkipBack className="h-5 w-5 text-white" />
      </button>

      {/* Play/Pause button */}
      <button
        onClick={onTogglePlayPause}
        className="p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
      >
        {playerState.isPlaying ? (
          <Pause className="h-6 w-6 text-white" />
        ) : (
          <Play className="h-6 w-6 text-white" fill="currentColor" />
        )}
      </button>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!onNext}
        className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SkipForward className="h-5 w-5 text-white" />
      </button>

      {/* Volume control */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
        >
          {playerState.isMuted || playerState.volume === 0 ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </button>
        
        <div className="w-24">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={playerState.isMuted ? 0 : playerState.volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer volume-slider"
          />
        </div>
      </div>

      {/* Additional controls */}
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
          <Shuffle className="h-4 w-4 text-white" />
        </button>
        
        <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
          <Repeat className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
};
