import React, { useEffect, useRef } from 'react';
import type { LyricLine } from '../../types/lyrics';
import { useSyncedLyrics } from '../../hooks/useLyrics';

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  className?: string;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  lyrics,
  currentTime,
  className = '',
}) => {
  const { currentLine, currentLineIndex } = useSyncedLyrics(lyrics, currentTime);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current line
  useEffect(() => {
    if (currentLineIndex >= 0 && scrollContainerRef.current) {
      const currentElement = scrollContainerRef.current.children[currentLineIndex] as HTMLElement;
      if (currentElement) {
        currentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentLineIndex]);

  if (!lyrics.length) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <p className="text-white/60 text-lg">No lyrics available</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className={`max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 ${className}`}
    >
      <div className="space-y-4 p-4">
        {lyrics.map((line, index) => {
          const isActive = currentLine?.id === line.id;
          const isPast = currentLineIndex > index;
          const isFuture = currentLineIndex < index;

          return (
            <div
              key={line.id}
              className={`text-lg leading-relaxed transition-all duration-300 ${
                isActive
                  ? 'text-white font-semibold transform scale-105 text-center'
                  : isPast
                  ? 'text-white/40'
                  : isFuture
                  ? 'text-white/60'
                  : 'text-white/60'
              }`}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
