import React from 'react';
import { Play, Clock, User } from 'lucide-react';
import type { SearchResult } from '../../types/music';
import { formatTime } from '../../utils/timeFormat';

interface SearchResultsProps {
  results: SearchResult[];
  onSelectSong: (song: SearchResult) => void;
  isLoading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onSelectSong,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Search Results</h2>
      <div className="space-y-3">
        {results.map((song) => (
          <div
            key={song.id}
            onClick={() => onSelectSong(song)}
            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="relative flex-shrink-0">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" fill="currentColor" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{song.title}</h3>
                <div className="flex items-center space-x-4 mt-1 text-white/60 text-sm">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="truncate">{song.artist}</span>
                  </div>
                  {song.duration > 0 && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(song.duration)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Play className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
