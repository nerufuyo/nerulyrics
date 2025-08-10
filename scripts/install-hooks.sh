#!/bin/bash

# Git hooks installer for NerU Lyrics
# This script sets up git hooks for automatic commit message generation

HOOKS_DIR=".git/hooks"
SCRIPTS_DIR="scripts"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔧 Setting up Git Hooks for NerU Lyrics${NC}\n"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

# NerU Lyrics Pre-commit Hook
# Runs checks before allowing commit

echo "🔍 Running pre-commit checks..."

# Check for TypeScript compilation errors
if [ -f "tsconfig.json" ] && command -v npm >/dev/null 2>&1; then
    echo "📦 Checking TypeScript compilation..."
    if ! npm run build --silent > /dev/null 2>&1; then
        echo "⚠️  TypeScript compilation has warnings, but allowing commit..."
    fi
fi

# Check for console.log statements in staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$')
if [ -n "$staged_files" ]; then
    echo "🔍 Checking for debug statements..."
    for file in $staged_files; do
        if [ -f "$file" ] && grep -n "console\.(log\|warn\|error\|debug)" "$file" >/dev/null; then
            echo "⚠️  Debug statements found in $file (continuing anyway)"
        fi
    done
fi

# Check for large files
large_files=$(git diff --cached --name-only | xargs ls -la 2>/dev/null | awk '$5 > 5242880 {print $9}' || true)
if [ -n "$large_files" ]; then
    echo "⚠️  Large files detected (>5MB):"
    echo "$large_files"
    echo "Consider using Git LFS for these files"
fi

echo "✅ Pre-commit checks completed"
exit 0
EOF

# Prepare commit message hook
cat > "$HOOKS_DIR/prepare-commit-msg" << 'EOF'
#!/bin/bash

# NerU Lyrics Prepare Commit Message Hook
# Automatically generates commit messages if none provided

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

# Only run for regular commits (not merges, rebases, etc.)
if [ "$COMMIT_SOURCE" = "" ] || [ "$COMMIT_SOURCE" = "template" ]; then
    # Check if commit message is empty or just whitespace
    if [ ! -s "$COMMIT_MSG_FILE" ] || ! grep -q '[^[:space:]]' "$COMMIT_MSG_FILE"; then
        echo "🤖 Generating smart commit message..."
        
        # Try to use the Node.js smart commit generator
        if [ -f "scripts/smart-commit.js" ] && command -v node >/dev/null 2>&1; then
            GENERATED_MSG=$(node scripts/smart-commit.js 2>/dev/null | grep -A1 "Generated commit message:" | tail -1 | sed 's/^[[:space:]]*//')
            
            if [ -n "$GENERATED_MSG" ] && [ "$GENERATED_MSG" != "Generated commit message:" ]; then
                echo "$GENERATED_MSG" > "$COMMIT_MSG_FILE"
                echo "✅ Auto-generated commit message: $GENERATED_MSG"
            else
                # Fallback to simple message
                echo "auto: update project files" > "$COMMIT_MSG_FILE"
                echo "📝 Using fallback commit message"
            fi
        else
            # Simple fallback
            echo "auto: update project files" > "$COMMIT_MSG_FILE"
            echo "📝 Using simple commit message"
        fi
    fi
fi
EOF

# Post-commit hook
cat > "$HOOKS_DIR/post-commit" << 'EOF'
#!/bin/bash

# NerU Lyrics Post-commit Hook
# Runs after successful commit

COMMIT_MSG=$(git log -1 --pretty=%B)
COMMIT_HASH=$(git rev-parse --short HEAD)

echo "✅ Committed: $COMMIT_HASH"
echo "📝 Message: $COMMIT_MSG"

# Optional: Auto-push on certain commit types
if echo "$COMMIT_MSG" | grep -q "^feat\|^fix\|^docs"; then
    echo "🚀 This looks like an important change. Consider pushing:"
    echo "   git push origin $(git branch --show-current)"
fi
EOF

# Make hooks executable
chmod +x "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/prepare-commit-msg"
chmod +x "$HOOKS_DIR/post-commit"

echo -e "${GREEN}✅ Git hooks installed successfully!${NC}\n"

echo "📋 Installed hooks:"
echo "   • pre-commit: Runs TypeScript checks and warns about debug statements"
echo "   • prepare-commit-msg: Auto-generates commit messages"
echo "   • post-commit: Shows commit info and suggests pushing"

echo -e "\n💡 Tips:"
echo "   • Commit with empty message to trigger auto-generation"
echo "   • Use 'git commit --no-verify' to skip hooks if needed"
echo "   • Hooks will run automatically for all future commits"

echo -e "\n🎵 Happy coding with NerU Lyrics!"
