# Auto-Commit Usage Examples

## Quick Commands

```bash
# Set up the auto-commit system (run once)
npm run setup-hooks

# Quick commit with auto-generated message
npm run quick-commit

# Commit and push automatically
npm run commit-push

# Generate commit message without committing
npm run smart-message
```

## Example Generated Messages

Based on your NerU Lyrics project structure, here are examples of auto-generated commit messages:

### Component Updates
```
feat(ui): update LyricsDisplay and FullscreenLyrics components with React hooks
```

### Player Features
```
feat(player): add volume control with React hooks and TypeScript interfaces
```

### Search Functionality
```
feat(search): update SearchBar component with API integration
```

### Styling Changes
```
style(ui): update component styling with Tailwind CSS classes
```

### Service Updates
```
feat(api): update lyricsAPI and youtubeAPI services with async functionality
```

### Type Definitions
```
refactor(types): update TypeScript types and interfaces
```

## Manual Usage

If you prefer manual control:

```bash
# Make your changes
git add .

# Generate a smart commit message
node scripts/smart-commit.js

# Review the message and commit manually
git commit -m "feat(player): add audio controls with volume slider"

# Or use the bash script for more detailed analysis
./scripts/auto-commit.sh
```

## Interactive Mode

For a guided commit experience:

```bash
node scripts/cz-adapter.js
```

This will prompt you through:
1. Commit type selection
2. Scope selection
3. Description input
4. Optional body and footer
