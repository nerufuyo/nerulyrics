import { useState } from 'react';
import { SearchBar } from './components/Search/SearchBar';
import { SearchResults } from './components/Search/SearchResults';
import { PlayerControls } from './components/Player/PlayerControls';
import { ProgressBar } from './components/Player/ProgressBar';
import { LyricsDisplay } from './components/Lyrics/LyricsDisplay';
import { FullscreenLyrics } from './components/Lyrics/FullscreenLyrics';
import { AutoHideControls } from './components/UI/AutoHideControls';
import { NowPlaying } from './components/UI/NowPlaying';
import { useSearch } from './hooks/useSearch';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useLyrics } from './hooks/useLyrics';
import type { SearchResult } from './types/music';

function App() {
  const [isFullscreenLyrics, setIsFullscreenLyrics] = useState(false);
  const { results, isLoading, search } = useSearch();
  const {
    playerState,
    currentSong,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    loadSong,
  } = useAudioPlayer();
  const { lyricsData } = useLyrics(currentSong);

  const handleSelectSong = (song: SearchResult) => {
    loadSong(song);
  };

  const toggleFullscreenLyrics = () => {
    setIsFullscreenLyrics(!isFullscreenLyrics);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">NerU Lyrics</h1>
            <p className="text-white/70 text-lg">
              Search, stream, and sing along to your favorite music
            </p>
          </div>
          <SearchBar onSearch={search} isLoading={isLoading} />
        </div>

        {/* Search Results */}
        <SearchResults
          results={results}
          onSelectSong={handleSelectSong}
          isLoading={isLoading}
        />

        {/* Player Section */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-t border-white/20">
            <AutoHideControls isPlaying={playerState.isPlaying}>
              <div className="container mx-auto px-4 py-4">
                {/* Progress Bar */}
                <ProgressBar
                  playerState={playerState}
                  onSeek={seek}
                  className="mb-4"
                />

                {/* Player Controls and Now Playing */}
                <div className="flex items-center justify-between">
                  <NowPlaying
                    currentSong={currentSong}
                    onToggleFullscreenLyrics={toggleFullscreenLyrics}
                    className="flex-1 max-w-sm"
                  />

                  <PlayerControls
                    playerState={playerState}
                    onTogglePlayPause={togglePlayPause}
                    onVolumeChange={setVolume}
                    onToggleMute={toggleMute}
                    className="flex-1"
                  />

                  <div className="flex-1 max-w-sm" />
                </div>
              </div>
            </AutoHideControls>
          </div>
        )}

        {/* Lyrics Section */}
        {currentSong && lyricsData && !isFullscreenLyrics && (
          <div className="mt-8 mb-32">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Lyrics</h2>
                  <button
                    onClick={toggleFullscreenLyrics}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    View Fullscreen
                  </button>
                </div>
                {lyricsData.syncedLyrics ? (
                  <LyricsDisplay
                    lyrics={lyricsData.syncedLyrics}
                    currentTime={playerState.currentTime}
                  />
                ) : (
                  <div className="text-white/70 whitespace-pre-line">
                    {lyricsData.lyrics}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lyrics */}
      {currentSong && lyricsData?.syncedLyrics && (
        <FullscreenLyrics
          lyrics={lyricsData.syncedLyrics}
          currentTime={playerState.currentTime}
          songTitle={currentSong.title}
          artist={currentSong.artist}
          isVisible={isFullscreenLyrics}
          onClose={() => setIsFullscreenLyrics(false)}
        />
      )}
    </div>
  );
}

export default App;
