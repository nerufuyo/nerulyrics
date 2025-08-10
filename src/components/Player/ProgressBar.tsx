import React from 'react';
import type { PlayerState } from '../../types/player';
import { formatTime } from '../../utils/timeFormat';

interface ProgressBarProps {
  playerState: PlayerState;
  onSeek: (time: number) => void;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  playerState,
  onSeek,
  className = '',
}) => {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickedTime = (clickX / width) * playerState.duration;
    onSeek(clickedTime);
  };

  const progressPercentage = playerState.duration > 0 
    ? (playerState.currentTime / playerState.duration) * 100 
    : 0;

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <span className="text-white/60 text-sm font-mono min-w-[3rem]">
        {formatTime(playerState.currentTime)}
      </span>
      
      <div
        className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer group"
        onClick={handleProgressClick}
      >
        <div className="relative h-full">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-200 group-hover:from-purple-300 group-hover:to-pink-300"
            style={{ width: `${progressPercentage}%` }}
          />
          <div
            className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{ left: `calc(${progressPercentage}% - 0.5rem)` }}
          />
        </div>
      </div>
      
      <span className="text-white/60 text-sm font-mono min-w-[3rem]">
        {formatTime(playerState.duration)}
      </span>
    </div>
  );
};
