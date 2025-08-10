# NerU Lyrics Auto-Commit System

This directory contains scripts and configurations for automatic commit generation in the NerU Lyrics project.

## 🚀 Quick Start

### 1. Set up Git Hooks
```bash
npm run setup-hooks
# or
bash scripts/install-hooks.sh
```

### 2. Make Auto Commits
```bash
# Generate and commit with smart message
npm run commit

# Commit and push automatically
npm run commit-push

# Use bash script version
npm run auto-commit
```

## 📁 Files Overview

### Scripts

- **`auto-commit.sh`** - Bash script for intelligent auto-commits
- **`smart-commit.js`** - Node.js script with advanced analysis
- **`install-hooks.sh`** - Git hooks installer
- **`validate-commit-msg.js`** - Commit message validator
- **`cz-adapter.js`** - Interactive commit message creator

### Configuration

- **`auto-commit-config.json`** - NPM scripts and tool configuration

## 🛠️ Available Commands

### NPM Scripts

```bash
# Smart commit with auto-generated message
npm run commit

# Commit and push to remote
npm run commit-push

# Use bash version (more detailed analysis)
npm run auto-commit

# Auto-commit with push
npm run auto-commit-push

# Quick commit (stage all + commit)
npm run quick-commit

# Generate message only (no commit)
npm run smart-message

# Set up git hooks
npm run setup-hooks
```

### Direct Script Usage

```bash
# Bash auto-commit script
./scripts/auto-commit.sh
./scripts/auto-commit.sh --push

# Node.js smart commit
node scripts/smart-commit.js
node scripts/smart-commit.js --commit
node scripts/smart-commit.js --commit --push

# Interactive commit creator
node scripts/cz-adapter.js
```

## 🎯 Features

### Smart Analysis
- **File Type Detection**: Recognizes components, hooks, services, types, etc.
- **Code Pattern Analysis**: Detects React hooks, TypeScript, API calls, styling
- **Music App Features**: Identifies player, lyrics, search functionality
- **Change Scope**: Determines appropriate commit scope

### Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Styling and UI changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Maintenance tasks

### Scopes
- `player`: Audio player functionality
- `lyrics`: Lyrics display and sync
- `search`: Music search features
- `ui`: User interface components
- `api`: API services
- `types`: TypeScript definitions
- `config`: Configuration files

## 🔧 Git Hooks

### Pre-commit Hook
- Checks TypeScript compilation
- Warns about debug statements
- Detects large files
- Validates file changes

### Prepare Commit Message Hook
- Auto-generates commit messages for empty commits
- Uses smart analysis to create meaningful messages
- Falls back to simple messages if analysis fails

### Post-commit Hook
- Shows commit information
- Suggests pushing important changes
- Provides feedback on commit success

## 💡 Usage Examples

### Basic Auto-Commit
```bash
# Make changes to files
# Stage and commit automatically
npm run quick-commit
```

### Custom Message with Analysis
```bash
# Generate smart message without committing
npm run smart-message

# Review and commit manually
git commit -m "feat(player): add volume control with React hooks"
```

### Interactive Commit
```bash
# Use interactive prompt
node scripts/cz-adapter.js
```

### Bash Script with Push
```bash
# Auto-commit and push
./scripts/auto-commit.sh --push
```

## 🎵 Music App Specific Features

The auto-commit system is specifically designed for the NerU Lyrics music application:

- **Player Features**: Detects play/pause, volume, seeking functionality
- **Lyrics Features**: Recognizes lyrics display, synchronization, timing
- **Search Features**: Identifies search, filtering, results handling
- **Audio Features**: Detects audio processing, track management
- **UI Features**: Recognizes component updates, modals, responsive design

## 🔄 Workflow Integration

### Development Workflow
1. Make changes to code
2. Run `npm run quick-commit` for instant commit
3. Use `npm run commit-push` to commit and push
4. Hooks automatically validate and enhance commits

### Release Workflow
1. Use `npm run auto-commit` for detailed analysis
2. Review generated message
3. Push with `--push` flag if approved

## ⚙️ Configuration

### Customizing Commit Types
Edit `scripts/smart-commit.js` to modify:
- Commit type determination logic
- File pattern recognition
- Message generation rules

### Adjusting Hooks
Modify `scripts/install-hooks.sh` to:
- Add custom pre-commit checks
- Change validation rules
- Add post-commit actions

### NPM Scripts
Update `package.json` to add custom scripts:
```json
{
  "scripts": {
    "my-commit": "node scripts/smart-commit.js --commit --custom-flag"
  }
}
```

## 🐛 Troubleshooting

### Permission Issues
```bash
chmod +x scripts/*.sh
```

### Hook Installation Issues
```bash
# Reinstall hooks
rm -rf .git/hooks
npm run setup-hooks
```

### Node.js Script Issues
```bash
# Check Node.js version
node --version

# Reinstall dependencies if needed
npm install
```

## 🎨 Customization

### Adding New File Patterns
In `smart-commit.js`, add to `CONFIG.filePatterns`:
```javascript
newPattern: /your\/pattern\/.*\.ext$/
```

### Custom Commit Message Format
Modify the `generateDescription` method in `CommitMessageGenerator` class.

### Additional Scopes
Add new scopes in `cz-adapter.js`:
```javascript
{ name: 'newscope', description: 'New scope description' }
```

---

🎵 **Happy coding with automated commits!** 🎵
