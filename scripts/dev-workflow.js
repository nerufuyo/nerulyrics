#!/usr/bin/env node

/**
 * Development Workflow Helper for NerU Lyrics
 * Combines common development tasks with auto-commit
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`🔧 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    return false;
  }
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch {
    return 'main';
  }
}

function showHelp() {
  console.log(`
${colors.bold}🎵 NerU Lyrics Development Workflow Helper${colors.reset}

Usage: node scripts/dev-workflow.js [command]

Commands:
  ${colors.green}start${colors.reset}      - Start development server
  ${colors.green}commit${colors.reset}     - Smart commit current changes
  ${colors.green}push${colors.reset}       - Commit and push changes
  ${colors.green}deploy${colors.reset}     - Build and deploy (commit + push + build)
  ${colors.green}clean${colors.reset}      - Clean and reset development environment
  ${colors.green}setup${colors.reset}      - Initial project setup
  ${colors.green}status${colors.reset}     - Show project status
  ${colors.green}help${colors.reset}       - Show this help

Examples:
  node scripts/dev-workflow.js commit
  node scripts/dev-workflow.js push
  node scripts/dev-workflow.js deploy
`);
}

function showStatus() {
  log('📊 NerU Lyrics Project Status', 'bold');
  console.log();
  
  // Git status
  const branch = getCurrentBranch();
  log(`🌿 Current branch: ${branch}`, 'blue');
  
  const hasChanges = checkGitStatus();
  if (hasChanges) {
    log('📝 Uncommitted changes detected', 'yellow');
    try {
      execSync('git status --short', { stdio: 'inherit' });
    } catch {}
  } else {
    log('✅ No uncommitted changes', 'green');
  }
  
  console.log();
  
  // Recent commits
  log('📋 Recent commits:', 'blue');
  try {
    execSync('git log --oneline -5', { stdio: 'inherit' });
  } catch {}
  
  console.log();
  
  // Package info
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    log(`📦 Project: ${pkg.name} v${pkg.version}`, 'blue');
  }
}

async function main() {
  const command = process.argv[2] || 'help';
  
  log(`🎵 NerU Lyrics Development Workflow`, 'bold');
  console.log();
  
  switch (command) {
    case 'start':
      log('🚀 Starting development server...', 'blue');
      runCommand('npm run dev', 'Start development server');
      break;
      
    case 'commit':
      if (!checkGitStatus()) {
        log('✅ No changes to commit', 'green');
        break;
      }
      
      log('💾 Committing changes with smart message...', 'blue');
      runCommand('npm run commit', 'Smart commit');
      break;
      
    case 'push':
      if (!checkGitStatus()) {
        log('✅ No changes to commit', 'green');
        break;
      }
      
      log('🚀 Committing and pushing changes...', 'blue');
      runCommand('npm run commit-push', 'Commit and push');
      break;
      
    case 'deploy':
      log('🚀 Starting deployment workflow...', 'blue');
      
      // Check if there are changes to commit
      if (checkGitStatus()) {
        if (!runCommand('npm run commit', 'Commit changes')) break;
        if (!runCommand('git push', 'Push to remote')) break;
      }
      
      // Build the project
      if (!runCommand('npm run build', 'Build project')) break;
      
      log('✅ Deployment workflow completed!', 'green');
      break;
      
    case 'clean':
      log('🧹 Cleaning development environment...', 'blue');
      
      // Remove build artifacts
      runCommand('rm -rf dist build .next out', 'Remove build directories');
      runCommand('rm -rf node_modules/.cache', 'Clear module cache');
      
      log('✅ Environment cleaned!', 'green');
      break;
      
    case 'setup':
      log('🔧 Setting up NerU Lyrics development environment...', 'blue');
      
      // Install dependencies
      if (!runCommand('npm install', 'Install dependencies')) break;
      
      // Set up git hooks
      if (!runCommand('npm run setup-hooks', 'Install git hooks')) break;
      
      // Initial build check
      if (!runCommand('npm run build', 'Test build')) break;
      
      log('✅ Setup completed! You can now run:', 'green');
      log('   npm run dev     - Start development server', 'blue');
      log('   npm run commit  - Make smart commits', 'blue');
      break;
      
    case 'status':
      showStatus();
      break;
      
    case 'help':
    default:
      showHelp();
      break;
  }
}

if (import.meta.url === `file://${__filename}`) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { main };
