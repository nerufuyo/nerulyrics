import { useState, useCallback } from 'react';
import type { SearchResult } from '../types/music';
import { youtubeService } from '../services/youtubeAPI';
import { debounce } from '../utils/searchUtils';

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await youtubeService.search(query);
      setResults(searchResults);
    } catch (err) {
      setError('Failed to search for music. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce(performSearch, 500),
    [performSearch]
  );

  const search = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
};
