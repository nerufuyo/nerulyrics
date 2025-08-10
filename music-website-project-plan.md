# Online Music Streaming Player with Lyrics - Personal Project Plan

## 🎯 Project Overview

A TypeScript-based music streaming web app that searches online music databases, streams audio, and displays synchronized lyrics with an immersive auto-hide UI experience.

## 📋 Core Features

### Phase 1: Search & Stream (Week 1)
- **Music Search Engine**
  - Search by song title, artist, album
  - Real-time search suggestions
  - Display search results with metadata
- **Audio Streaming**
  - Stream audio from online sources
  - Basic play/pause/stop controls
  - Volume and seek controls

### Phase 2: Lyrics Integration (Week 2)
- **Online Lyrics Fetching**
  - Fetch lyrics from lyrics APIs
  - Display synchronized lyrics if available
  - Fallback to static lyrics display
- **Auto-Hide UI System**
  - Mouse idle detection (3-5 seconds)
  - Smooth fade out of controls
  - Mouse movement brings UI back
  - Fullscreen lyrics view

### Phase 3: Enhanced Player (Week 3)
- **Advanced Controls**
  - Queue management
  - Repeat/shuffle modes
  - Progress tracking
- **Visual Enhancements**
  - Album artwork display
  - Smooth animations
  - Modern UI design

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS animations
- **State Management**: React Context API
- **HTTP Client**: Axios for API calls

### APIs & Services
- **Music Search**: 
  - Spotify Web API (for metadata)
  - YouTube Data API (for streaming)
  - Last.fm API (alternative metadata)
- **Lyrics**: 
  - Lyrics.ovh API (free)
  - Musixmatch API (with key)
  - Genius API (alternative)
- **Audio Streaming**:
  - YouTube iframe API
  - SoundCloud API (if available)
  - Free music APIs

## 📁 Project Structure

```
music-streaming-player/
├── src/
│   ├── components/
│   │   ├── Search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── SearchSuggestions.tsx
│   │   ├── Player/
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── PlayerControls.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── VolumeControl.tsx
│   │   ├── Lyrics/
│   │   │   ├── LyricsDisplay.tsx
│   │   │   ├── SyncedLyrics.tsx
│   │   │   └── FullscreenLyrics.tsx
│   │   └── UI/
│   │       ├── AutoHideControls.tsx
│   │       └── NowPlaying.tsx
│   ├── hooks/
│   │   ├── useSearch.ts
│   │   ├── useAudioPlayer.ts
│   │   ├── useLyrics.ts
│   │   └── useMouseIdle.ts
│   ├── services/
│   │   ├── musicSearchAPI.ts
│   │   ├── lyricsAPI.ts
│   │   ├── streamingAPI.ts
│   │   └── youtubeAPI.ts
│   ├── types/
│   │   ├── music.ts
│   │   ├── lyrics.ts
│   │   └── player.ts
│   └── utils/
│       ├── timeFormat.ts
│       └── searchUtils.ts
```

## 🔧 Key Implementation Details

### 1. Music Search Interface
```typescript
interface SearchResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  thumbnail: string;
  streamUrl: string;
}

interface SearchService {
  search(query: string): Promise<SearchResult[]>;
  getStreamUrl(id: string): Promise<string>;
}
```

### 2. Auto-Hide UI Hook
```typescript
const useMouseIdle = (timeout: number = 4000) => {
  const [isIdle, setIsIdle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    let idleTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), timeout);
    };
    
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach(event => 
      document.addEventListener(event, resetTimer)
    );
    
    resetTimer(); // Start timer
    
    return () => {
      events.forEach(event => 
        document.removeEventListener(event, resetTimer)
      );
      clearTimeout(idleTimer);
    };
  }, [isPlaying, timeout]);
  
  return { isIdle, showUI: !isIdle || !isPlaying };
};
```

### 3. Lyrics Synchronization
```typescript
interface LyricLine {
  startTime: number;
  text: string;
  id: string;
}

const useSyncedLyrics = (lyrics: LyricLine[], currentTime: number) => {
  const currentLine = useMemo(() => {
    return lyrics.find((line, index) => {
      const nextLine = lyrics[index + 1];
      return currentTime >= line.startTime && 
             (!nextLine || currentTime < nextLine.startTime);
    });
  }, [lyrics, currentTime]);
  
  return currentLine;
};
```

## 🎨 UI/UX Design

### Main Layout
```
┌─────────────────────────────────────┐
│ Search Bar                          │
├─────────────────────────────────────┤
│                                     │
│         Album Art | Lyrics          │
│                   |                 │
│                   | ♪ Current line  │
│                   |   highlighted   │
│                                     │
├─────────────────────────────────────┤
│ ⏮️ ⏯️ ⏭️    ━━━━━━━━━━━━━    🔊      │
│ Controls      Progress       Volume │
└─────────────────────────────────────┘
```

### Auto-Hide Behavior
- **When playing + mouse idle (4s)**: Controls fade out
- **Lyrics only mode**: Full screen lyrics with minimal UI
- **Mouse movement**: Controls fade back in smoothly
- **Keyboard shortcuts**: Always work (spacebar, arrows)

## 🌐 API Integration Strategy

### Music Search Flow
1. **User searches** → Query multiple APIs
2. **Aggregate results** → Combine and deduplicate
3. **User selects song** → Fetch stream URL
4. **Start playback** → Load lyrics simultaneously

### API Services to Use
```typescript
// Free APIs for development
const APIs = {
  search: {
    primary: 'YouTube Data API',
    fallback: 'Last.fm API'
  },
  lyrics: {
    primary: 'lyrics.ovh',
    fallback: 'Genius API'
  },
  streaming: {
    primary: 'YouTube iframe',
    fallback: 'SoundCloud widget'
  }
};
```

## 🚀 Development Timeline

### Week 1: Core Functionality
- [ ] **Day 1-2**: Project setup + search implementation
- [ ] **Day 3-4**: Basic audio streaming (YouTube API)
- [ ] **Day 5-6**: Player controls and progress tracking
- [ ] **Day 7**: Search results UI

### Week 2: Lyrics & Auto-Hide UI
- [ ] **Day 1-2**: Lyrics API integration
- [ ] **Day 3-4**: Mouse idle detection system
- [ ] **Day 5-6**: Auto-hide controls implementation
- [ ] **Day 7**: Fullscreen lyrics mode

### Week 3: Polish & Enhancement
- [ ] **Day 1-2**: Smooth animations and transitions
- [ ] **Day 3-4**: Error handling and loading states
- [ ] **Day 5-6**: Responsive design
- [ ] **Day 7**: Final testing and optimization

## 🔍 Technical Challenges & Solutions

### Challenge 1: CORS Issues with Audio Streaming
**Solution**: Use YouTube iframe API or proxy server for audio streams

### Challenge 2: Lyrics Synchronization
**Solution**: Parse LRC format or use timestamp-based matching with current playback time

### Challenge 3: Smooth UI Transitions
**Solution**: CSS transitions with opacity and transform properties

### Challenge 4: Search Performance
**Solution**: Debounce search input and cache results

## 🎵 API Usage Examples

### YouTube Data API Search
```typescript
const searchYouTube = async (query: string) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
  );
  return response.json();
};
```

### Lyrics API Integration
```typescript
const fetchLyrics = async (artist: string, title: string) => {
  const response = await fetch(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
  );
  return response.json();
};
```

## 🎯 Key Features Summary

✅ **Search online music databases**
✅ **Stream audio directly in browser**
✅ **Fetch and display lyrics automatically**  
✅ **Auto-hide UI when mouse is idle**
✅ **Smooth transitions and animations**
✅ **Fullscreen lyrics experience**
✅ **No local file management needed**

## 🚢 Deployment

Since this is a frontend-only app:
- **Vercel/Netlify**: Free hosting for static sites
- **Environment variables**: Store API keys securely
- **Custom domain**: Optional for professional look

---

This approach gives you the online streaming experience you want with the auto-hide UI behavior, while keeping the project manageable for personal development!