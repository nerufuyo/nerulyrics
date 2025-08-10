import { useState, useEffect, useMemo } from 'react';
import type { LyricsData, LyricLine } from '../types/lyrics';
import type { SearchResult } from '../types/music';
import { lyricsService } from '../services/lyricsAPI';

export const useLyrics = (currentSong: SearchResult | null) => {
  const [lyricsData, setLyricsData] = useState<LyricsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentSong) {
      setLyricsData(null);
      return;
    }

    const fetchLyrics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const lyrics = await lyricsService.fetchLyrics(
          currentSong.artist,
          currentSong.title
        );
        setLyricsData(lyrics);
      } catch (err) {
        setError('Failed to fetch lyrics');
        setLyricsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLyrics();
  }, [currentSong]);

  return {
    lyricsData,
    isLoading,
    error,
  };
};

export const useSyncedLyrics = (
  lyrics: LyricLine[],
  currentTime: number
) => {
  const currentLine = useMemo(() => {
    if (!lyrics.length) return null;

    return lyrics.find((line, index) => {
      const nextLine = lyrics[index + 1];
      return (
        currentTime >= line.startTime &&
        (!nextLine || currentTime < nextLine.startTime)
      );
    });
  }, [lyrics, currentTime]);

  const currentLineIndex = useMemo(() => {
    if (!currentLine) return -1;
    return lyrics.findIndex(line => line.id === currentLine.id);
  }, [lyrics, currentLine]);

  return {
    currentLine,
    currentLineIndex,
  };
};
