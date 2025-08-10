#!/bin/bash

# NerU Lyrics Auto Commit Script
# This script automatically generates meaningful commit messages and commits changes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEFAULT_BRANCH="main"
MAX_FILES_TO_ANALYZE=20
COMMIT_PREFIX="auto:"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository"
        exit 1
    fi
}

# Function to check if there are any changes to commit
has_changes() {
    git diff-index --quiet HEAD -- 2>/dev/null
    return $?
}

# Function to analyze file changes and generate commit message
generate_commit_message() {
    local staged_files=$(git diff --cached --name-only)
    local unstaged_files=$(git diff --name-only)
    local all_files="$staged_files $unstaged_files"
    
    if [ -z "$all_files" ]; then
        echo "No changes detected"
        return 1
    fi
    
    # Analyze file types and changes
    local has_components=false
    local has_hooks=false
    local has_services=false
    local has_types=false
    local has_utils=false
    local has_styles=false
    local has_config=false
    local has_tests=false
    local has_docs=false
    
    local component_files=""
    local hook_files=""
    local service_files=""
    local feature_files=""
    
    for file in $all_files; do
        case "$file" in
            src/components/*)
                has_components=true
                component_files="$component_files $(basename "$file" .tsx)"
                ;;
            src/hooks/*)
                has_hooks=true
                hook_files="$hook_files $(basename "$file" .ts)"
                ;;
            src/services/*)
                has_services=true
                service_files="$service_files $(basename "$file" .ts)"
                ;;
            src/types/*)
                has_types=true
                ;;
            src/utils/*)
                has_utils=true
                ;;
            *.css|*.scss|*.less)
                has_styles=true
                ;;
            *.json|*.js|*.ts|*.config.*|.*rc|.*ignore)
                has_config=true
                ;;
            *.test.*|*.spec.*|__tests__/*)
                has_tests=true
                ;;
            *.md|*.txt|docs/*)
                has_docs=true
                ;;
        esac
    done
    
    # Generate commit message based on changes
    local commit_msg=""
    local commit_type=""
    
    # Determine commit type
    if [ "$has_components" = true ] && [ "$has_hooks" = true ]; then
        commit_type="feat"
        commit_msg="Add new feature with components and hooks"
    elif [ "$has_components" = true ]; then
        commit_type="feat"
        commit_msg="Update UI components"
        if [ -n "$component_files" ]; then
            commit_msg="$commit_msg:$component_files"
        fi
    elif [ "$has_hooks" = true ]; then
        commit_type="feat"
        commit_msg="Update custom hooks"
        if [ -n "$hook_files" ]; then
            commit_msg="$commit_msg:$hook_files"
        fi
    elif [ "$has_services" = true ]; then
        commit_type="feat"
        commit_msg="Update API services"
        if [ -n "$service_files" ]; then
            commit_msg="$commit_msg:$service_files"
        fi
    elif [ "$has_types" = true ]; then
        commit_type="refactor"
        commit_msg="Update TypeScript types and interfaces"
    elif [ "$has_styles" = true ]; then
        commit_type="style"
        commit_msg="Update styles and UI appearance"
    elif [ "$has_config" = true ]; then
        commit_type="chore"
        commit_msg="Update configuration files"
    elif [ "$has_tests" = true ]; then
        commit_type="test"
        commit_msg="Add or update tests"
    elif [ "$has_docs" = true ]; then
        commit_type="docs"
        commit_msg="Update documentation"
    else
        commit_type="chore"
        commit_msg="Update project files"
    fi
    
    # Add specific details based on file analysis
    local details=""
    
    # Check for specific patterns in diffs
    if git diff --cached --quiet 2>/dev/null; then
        git add .
    fi
    
    local diff_content=$(git diff --cached)
    
    if echo "$diff_content" | grep -q "useState\|useEffect\|useCallback"; then
        details="$details React hooks,"
    fi
    
    if echo "$diff_content" | grep -q "interface\|type.*="; then
        details="$details TypeScript types,"
    fi
    
    if echo "$diff_content" | grep -q "className\|css\|style"; then
        details="$details styling,"
    fi
    
    if echo "$diff_content" | grep -q "API\|fetch\|axios"; then
        details="$details API integration,"
    fi
    
    if echo "$diff_content" | grep -q "test\|spec\|describe\|it("; then
        details="$details tests,"
    fi
    
    # Clean up details
    details=$(echo "$details" | sed 's/,$//')
    
    if [ -n "$details" ]; then
        commit_msg="$commit_msg - $details"
    fi
    
    # Format final commit message
    echo "${COMMIT_PREFIX} ${commit_type}: ${commit_msg}"
}

# Function to auto-stage files intelligently
auto_stage_files() {
    print_status "Auto-staging files..."
    
    # Stage all modified and new files, but be selective about deletions
    git add -A
    
    # Check if there are any large files that shouldn't be committed
    local large_files=$(git diff --cached --name-only | xargs ls -la 2>/dev/null | awk '$5 > 1048576 {print $9}' | grep -v node_modules || true)
    
    if [ -n "$large_files" ]; then
        print_warning "Large files detected, excluding from commit:"
        echo "$large_files"
        for file in $large_files; do
            git reset HEAD "$file" 2>/dev/null || true
        done
    fi
    
    # Exclude common files that shouldn't be auto-committed
    local exclude_patterns=(
        "*.log"
        "*.tmp"
        "*.temp"
        ".env.local"
        ".env.development.local"
        ".env.production.local"
        "dist/*"
        "build/*"
        "node_modules/*"
        ".DS_Store"
        "Thumbs.db"
    )
    
    for pattern in "${exclude_patterns[@]}"; do
        git reset HEAD "$pattern" 2>/dev/null || true
    done
}

# Function to perform pre-commit checks
pre_commit_checks() {
    print_status "Running pre-commit checks..."
    
    # Check if TypeScript compiles
    if [ -f "tsconfig.json" ]; then
        print_status "Checking TypeScript compilation..."
        if ! npm run build --silent > /dev/null 2>&1; then
            print_warning "TypeScript compilation has issues, but continuing..."
        else
            print_success "TypeScript compilation successful"
        fi
    fi
    
    # Check if there are any obvious syntax errors
    local ts_files=$(git diff --cached --name-only | grep -E '\.(ts|tsx)$' || true)
    if [ -n "$ts_files" ]; then
        print_status "Checking for syntax errors in TypeScript files..."
        # Basic syntax check - this is a simple check
        for file in $ts_files; do
            if [ -f "$file" ]; then
                if grep -q "console\.log\|debugger" "$file"; then
                    print_warning "Debug statements found in $file"
                fi
            fi
        done
    fi
}

# Function to push to remote after commit
auto_push() {
    local current_branch=$(git branch --show-current)
    
    if [ -z "$current_branch" ]; then
        print_warning "Unable to determine current branch, skipping push"
        return
    fi
    
    print_status "Pushing to origin/$current_branch..."
    
    if git push origin "$current_branch" 2>/dev/null; then
        print_success "Successfully pushed to origin/$current_branch"
    else
        print_warning "Failed to push to remote. You may need to push manually."
        print_status "Run: git push origin $current_branch"
    fi
}

# Main function
main() {
    print_status "Starting auto-commit process for NerU Lyrics..."
    
    # Check prerequisites
    check_git_repo
    
    # Check if there are changes
    if has_changes; then
        print_status "No changes detected to commit"
        exit 0
    fi
    
    # Auto-stage files
    auto_stage_files
    
    # Check if we have anything staged after auto-staging
    if git diff --cached --quiet; then
        print_status "No changes to commit after staging"
        exit 0
    fi
    
    # Run pre-commit checks
    pre_commit_checks
    
    # Generate commit message
    print_status "Generating commit message..."
    local commit_message=$(generate_commit_message)
    
    if [ $? -ne 0 ] || [ -z "$commit_message" ]; then
        print_error "Failed to generate commit message"
        exit 1
    fi
    
    print_status "Generated commit message: $commit_message"
    
    # Ask for confirmation if running interactively
    if [ -t 0 ]; then
        echo
        print_status "Files to be committed:"
        git diff --cached --name-status
        echo
        read -p "Proceed with commit? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Commit cancelled by user"
            exit 0
        fi
    fi
    
    # Perform the commit
    print_status "Committing changes..."
    if git commit -m "$commit_message"; then
        print_success "Successfully committed changes"
        
        # Auto-push if requested
        if [ "$1" = "--push" ] || [ "$1" = "-p" ]; then
            auto_push
        else
            print_status "To push changes, run: git push origin $(git branch --show-current)"
        fi
    else
        print_error "Failed to commit changes"
        exit 1
    fi
}

# Help function
show_help() {
    echo "NerU Lyrics Auto Commit Script"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -p, --push     Automatically push after committing"
    echo "  -h, --help     Show this help message"
    echo
    echo "Examples:"
    echo "  $0             Commit changes with auto-generated message"
    echo "  $0 --push      Commit and push changes"
    echo
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -p|--push)
        main --push
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
