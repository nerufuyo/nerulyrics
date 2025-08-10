import { useState, useRef, useEffect, useCallback } from 'react';
import type { SearchResult } from '../types/music';
import type { PlayerState } from '../types/player';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    repeatMode: 'none',
    shuffleMode: false,
  });
  const [currentSong, setCurrentSong] = useState<SearchResult | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleDurationChange = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    };

    const handleLoadStart = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: 0,
        duration: 0,
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.pause();
    };
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error('Play failed:', error);
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setPlayerState(prev => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    const newMuted = !playerState.isMuted;
    audioRef.current.volume = newMuted ? 0 : playerState.volume;
    setPlayerState(prev => ({ ...prev, isMuted: newMuted }));
  }, [playerState.isMuted, playerState.volume]);

  const loadSong = useCallback((song: SearchResult) => {
    if (!audioRef.current) return;

    // For demo purposes, we'll use a placeholder audio file
    // In a real app, you'd need to get the actual audio stream URL
    audioRef.current.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
    setCurrentSong(song);
    setPlayerState(prev => ({
      ...prev,
      currentTime: 0,
      duration: 0,
    }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, play, pause]);

  return {
    playerState,
    currentSong,
    play,
    pause,
    stop,
    seek,
    setVolume,
    toggleMute,
    loadSong,
    togglePlayPause,
  };
};
