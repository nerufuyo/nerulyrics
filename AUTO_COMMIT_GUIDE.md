# 🎵 NerU Lyrics Auto-Commit System

A comprehensive auto-commit system specifically designed for the NerU Lyrics music application. This system analyzes your code changes and automatically generates meaningful commit messages based on the type of changes, files modified, and patterns detected.

## 🚀 Quick Setup

### 1. Install the Auto-Commit System

```bash
# Set up git hooks and configuration
npm run setup

# Or manually install hooks
npm run setup-hooks
```

### 2. Start Using Auto-Commits

```bash
# Quick commit with auto-generated message
npm run quick-commit

# Commit and push automatically
npm run commit-push

# Use development workflow
npm run workflow commit
```

## 📦 What's Included

### 🛠️ Scripts
- **Smart Commit Generator** - Analyzes code and generates intelligent commit messages
- **Auto-Commit Script** - Bash version with detailed file analysis
- **Git Hooks** - Automated pre-commit checks and message generation
- **Development Workflow** - Complete development lifecycle automation
- **Commit Validation** - Ensures commit messages follow conventions

### 🎯 Features
- **Music App Specific**: Recognizes player, lyrics, search, and audio features
- **TypeScript Aware**: Understands React components, hooks, and TypeScript patterns
- **Conventional Commits**: Follows semantic commit message format
- **Auto-Push**: Optional automatic pushing to remote repository
- **Interactive Mode**: Guided commit message creation
- **Pre-commit Checks**: TypeScript compilation and code quality checks

## 🎮 Available Commands

### Development Workflow
```bash
npm run workflow start    # Start development server
npm run workflow commit   # Smart commit current changes
npm run workflow push     # Commit and push changes
npm run workflow deploy   # Full deployment (commit + push + build)
npm run workflow status   # Show project status
npm run workflow setup    # Initial project setup
```

### Direct Commit Commands
```bash
npm run commit           # Smart commit with auto-generated message
npm run commit-push      # Commit and push automatically
npm run quick-commit     # Stage all files and commit
npm run smart-message    # Generate message without committing
npm run auto-commit      # Use bash script version
```

### Setup Commands
```bash
npm run setup           # Complete project setup
npm run setup-hooks     # Install git hooks only
```

## 🎵 Music App Intelligence

The system is specifically tuned for NerU Lyrics and recognizes:

### Player Features
- Play/pause functionality
- Volume controls
- Seeking and progress
- Audio state management

### Lyrics Features
- Lyrics display components
- Synchronization logic
- Timed lyrics parsing
- Fullscreen lyrics mode

### Search Features
- Music search functionality
- Result filtering
- Query processing
- API integration

### UI Components
- React components
- Custom hooks
- TypeScript interfaces
- Styling updates

## 📝 Example Generated Messages

Based on your actual project structure:

```bash
# Component updates
feat(ui): update LyricsDisplay and FullscreenLyrics components with React hooks

# Player functionality
feat(player): add volume control with audio state management

# Search features
feat(search): update SearchBar component with API integration

# Service updates
feat(api): update lyricsAPI and youtubeAPI services with async functionality

# Styling changes
style(ui): update component styling with Tailwind CSS classes

# Type definitions
refactor(types): update TypeScript types and interfaces

# Configuration
chore(config): update build configuration and dependencies
```

## 🔧 Configuration

### Commit Types
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - Styling/UI changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Tests
- `chore` - Maintenance

### Scopes
- `player` - Audio player functionality
- `lyrics` - Lyrics display and sync
- `search` - Music search features
- `ui` - User interface components
- `api` - API services
- `types` - TypeScript definitions
- `config` - Configuration files

## 🎯 Workflow Examples

### Daily Development
```bash
# Start coding
npm run workflow start

# Make changes to components/hooks/services
# ... coding ...

# Quick commit when ready
npm run quick-commit

# Push when feature is complete
npm run workflow push
```

### Feature Development
```bash
# Work on new feature
# ... make changes ...

# Check what will be committed
npm run smart-message

# Commit with generated message
npm run commit

# Deploy when ready
npm run workflow deploy
```

### Interactive Commit
```bash
# For more control over commit messages
node scripts/cz-adapter.js
```

## 🔍 How It Works

### 1. File Analysis
The system analyzes your changed files and categorizes them:
- React components (`src/components/`)
- Custom hooks (`src/hooks/`)
- API services (`src/services/`)
- TypeScript types (`src/types/`)
- Utility functions (`src/utils/`)
- Styling files (`.css`, `.scss`)

### 2. Code Pattern Detection
It scans your code changes for patterns:
- React hooks usage (`useState`, `useEffect`, etc.)
- TypeScript interfaces and types
- API calls and async operations
- Event handlers and user interactions
- Styling and CSS changes

### 3. Music App Features
Specifically looks for NerU Lyrics features:
- Audio player controls
- Lyrics synchronization
- Search functionality
- Music streaming
- UI components

### 4. Message Generation
Based on the analysis, it generates appropriate:
- Commit type (`feat`, `fix`, `style`, etc.)
- Scope (`player`, `lyrics`, `search`, etc.)
- Description (clear, concise summary)

## 🛡️ Quality Checks

### Pre-commit Hooks
- TypeScript compilation check
- Debug statement detection
- Large file warnings
- Code quality validation

### Commit Message Validation
- Conventional commit format
- Message length limits
- Required fields validation
- Scope verification

## 📚 Advanced Usage

### Custom Patterns
Edit `scripts/smart-commit.js` to add custom file patterns:
```javascript
customPattern: /your\/custom\/pattern\/.*\.ext$/
```

### Custom Scopes
Add new scopes in `scripts/cz-adapter.js`:
```javascript
{ name: 'newscope', description: 'New scope description' }
```

### Workflow Customization
Modify `scripts/dev-workflow.js` to add custom commands:
```javascript
case 'your-command':
  // Your custom workflow
  break;
```

## 🐛 Troubleshooting

### Permission Issues
```bash
chmod +x scripts/*.sh
```

### Hook Problems
```bash
# Reinstall hooks
rm -rf .git/hooks
npm run setup-hooks
```

### Node.js Issues
```bash
# Check Node.js version (requires Node 14+)
node --version

# Clear cache if needed
npm cache clean --force
```

### Git Issues
```bash
# Check git status
git status

# Reset if needed
git reset HEAD
```

## 🎨 Customization

### Message Templates
Modify the message generation logic in `scripts/smart-commit.js`:
```javascript
generateDescription(fileAnalysis, codePatterns, musicFeatures, commitType) {
  // Your custom logic
}
```

### Additional Checks
Add custom pre-commit checks in `scripts/install-hooks.sh`:
```bash
# Your custom checks
echo "Running custom checks..."
```

### Workflow Commands
Add new workflow commands in `scripts/dev-workflow.js`:
```javascript
case 'your-workflow':
  // Your custom workflow
  break;
```

## 🎵 Happy Coding!

The auto-commit system is designed to make your development workflow smoother and more consistent. It learns from your NerU Lyrics project structure and generates meaningful commit messages that reflect the actual changes you're making.

### Quick Reference
```bash
npm run quick-commit     # Most common: stage all + smart commit
npm run commit-push      # Commit and push in one command
npm run workflow deploy  # Full deployment workflow
npm run smart-message    # Preview commit message
npm run setup           # Initial setup
```

For any issues or questions, check the individual script files in the `scripts/` directory for more detailed documentation.
