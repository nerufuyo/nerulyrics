# NerU Lyrics 🎵

A modern music streaming web application with synchronized lyrics and auto-hide UI. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- 🔍 **Smart Music Search** - Search across multiple music databases
- 🎵 **Audio Streaming** - Stream music directly in your browser
- 📝 **Synchronized Lyrics** - Real-time lyrics that highlight as the song plays
- 👻 **Auto-Hide UI** - Controls automatically hide when mouse is idle during playback
- 🖥️ **Fullscreen Lyrics** - Immersive lyrics viewing experience
- 🎨 **Modern Design** - Beautiful gradient backgrounds and smooth animations
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nerufuyo/nerulyrics.git
   cd nerulyrics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env and add your YouTube API key for live search
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **APIs**: YouTube Data API, Lyrics.ovh API

## 🎯 How It Works

### Search & Play
1. Type any song, artist, or album name in the search bar
2. Click on a search result to start playing
3. Enjoy synchronized lyrics that appear in real-time

### Auto-Hide UI
- When music is playing, move your mouse to see controls
- After 4 seconds of inactivity, controls smoothly fade away
- Perfect for distraction-free lyrics reading

### Fullscreen Lyrics
- Click the fullscreen button for an immersive lyrics experience
- Large, centered text with smooth scrolling
- Escape or click X to return to normal view

## 🔧 API Configuration

### YouTube Data API (Optional)
For live music search, you'll need a YouTube Data API key:

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API key)
5. Add the key to your `.env` file as `VITE_YOUTUBE_API_KEY`

**Note**: The app works without API keys using demo data for testing.

## 🎨 UI Features

### Auto-Hide Controls
```typescript
// Mouse idle detection with customizable timeout
const { showUI } = useMouseIdle(4000, isPlaying);
```

### Synchronized Lyrics
```typescript
// Real-time lyrics synchronization
const { currentLine } = useSyncedLyrics(lyrics, currentTime);
```

### Smooth Animations
- Fade transitions for UI elements
- Smooth scrolling lyrics
- Gradient progress bars
- Hover effects on interactive elements

## 📱 Responsive Design

- **Desktop**: Full featured experience with all controls
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Simplified UI with essential controls

## 🎵 Supported Features

- ✅ Music search and streaming
- ✅ Synchronized lyrics display
- ✅ Auto-hide UI system
- ✅ Progress tracking and seeking
- ✅ Volume control
- ✅ Fullscreen lyrics mode
- ✅ Responsive design
- 🔄 Queue management (coming soon)
- 🔄 Playlist support (coming soon)
- 🔄 Offline lyrics cache (coming soon)

## 🧱 Project Structure

```
src/
├── components/          # React components
│   ├── Search/         # Search-related components
│   ├── Player/         # Audio player components
│   ├── Lyrics/         # Lyrics display components
│   └── UI/             # General UI components
├── hooks/              # Custom React hooks
├── services/           # API service classes
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔮 Future Enhancements

- **Queue Management**: Add, remove, and reorder songs
- **Playlist Support**: Create and save custom playlists
- **User Accounts**: Save favorites and listening history
- **Social Features**: Share songs and playlists
- **Offline Mode**: Cache lyrics and basic functionality
- **Keyboard Shortcuts**: Full keyboard navigation
- **Visualizer**: Audio visualization during playback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **APIs**: YouTube Data API, Lyrics.ovh
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

---

Made with ❤️ by [nerufuyo](https://github.com/nerufuyo)
