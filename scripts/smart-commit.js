#!/usr/bin/env node

/**
 * NerU Lyrics Smart Commit Generator
 * 
 * This Node.js script analyzes code changes and generates intelligent commit messages
 * based on the type of changes, files modified, and patterns detected.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  maxFilesToAnalyze: 50,
  commitTypes: {
    feat: 'A new feature',
    fix: 'A bug fix',
    docs: 'Documentation only changes',
    style: 'Changes that do not affect the meaning of the code',
    refactor: 'A code change that neither fixes a bug nor adds a feature',
    perf: 'A code change that improves performance',
    test: 'Adding missing tests or correcting existing tests',
    chore: 'Changes to the build process or auxiliary tools'
  },
  filePatterns: {
    components: /src\/components\/.*\.(tsx?|jsx?)$/,
    hooks: /src\/hooks\/.*\.ts$/,
    services: /src\/services\/.*\.ts$/,
    types: /src\/types\/.*\.ts$/,
    utils: /src\/utils\/.*\.ts$/,
    styles: /\.(css|scss|less|styl)$/,
    config: /\.(json|js|ts|config\.|rc\.|ignore)$/,
    tests: /\.(test|spec)\.|__tests__/,
    docs: /\.(md|txt)$|docs\//
  }
};

class GitAnalyzer {
  constructor() {
    this.changedFiles = [];
    this.stagedFiles = [];
    this.diffContent = '';
  }

  // Check if we're in a git repository
  isGitRepo() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  // Get list of changed files
  getChangedFiles() {
    try {
      const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' })
        .trim().split('\n').filter(Boolean);
      const unstaged = execSync('git diff --name-only', { encoding: 'utf8' })
        .trim().split('\n').filter(Boolean);
      
      this.stagedFiles = staged;
      this.changedFiles = [...new Set([...staged, ...unstaged])];
      
      return this.changedFiles;
    } catch (error) {
      console.error('Error getting changed files:', error.message);
      return [];
    }
  }

  // Get diff content for analysis
  getDiffContent() {
    try {
      // If nothing is staged, stage everything first
      if (this.stagedFiles.length === 0) {
        execSync('git add .', { stdio: 'ignore' });
      }
      
      this.diffContent = execSync('git diff --cached', { encoding: 'utf8' });
      return this.diffContent;
    } catch (error) {
      console.error('Error getting diff content:', error.message);
      return '';
    }
  }

  // Analyze file types
  analyzeFileTypes() {
    const analysis = {
      components: [],
      hooks: [],
      services: [],
      types: [],
      utils: [],
      styles: [],
      config: [],
      tests: [],
      docs: []
    };

    this.changedFiles.forEach(file => {
      Object.keys(CONFIG.filePatterns).forEach(type => {
        if (CONFIG.filePatterns[type].test(file)) {
          analysis[type].push(file);
        }
      });
    });

    return analysis;
  }

  // Analyze code patterns in diff
  analyzeCodePatterns() {
    const patterns = {
      reactHooks: /use(State|Effect|Callback|Memo|Reducer|Context|Ref)/g,
      typeScript: /(interface|type\s+\w+\s*=|enum\s+\w+)/g,
      apiCalls: /(fetch|axios|api\.|\.get\(|\.post\(|\.put\(|\.delete\()/g,
      eventHandlers: /(onClick|onChange|onSubmit|addEventListener)/g,
      stateManagement: /(useState|setState|dispatch|reducer)/g,
      styling: /(className|style=|css`|styled\.|@apply)/g,
      imports: /^(import|export)/gm,
      functions: /(function\s+\w+|const\s+\w+\s*=\s*\(|=>\s*{)/g,
      async: /(async|await|Promise|then\(|catch\()/g,
      components: /(?:function|const)\s+([A-Z]\w*)|<([A-Z]\w*)/g
    };

    const matches = {};
    Object.keys(patterns).forEach(pattern => {
      const regex = patterns[pattern];
      const found = this.diffContent.match(regex);
      matches[pattern] = found ? found.length : 0;
    });

    return matches;
  }

  // Check for specific music app features
  analyzeMusicFeatures() {
    const musicPatterns = {
      player: /(play|pause|stop|seek|volume|currentTime)/gi,
      lyrics: /(lyrics|lyric|sync|timed)/gi,
      search: /(search|query|filter|results)/gi,
      audio: /(audio|sound|music|track|song)/gi,
      ui: /(button|component|modal|popup|fullscreen)/gi
    };

    const features = {};
    Object.keys(musicPatterns).forEach(feature => {
      const matches = this.diffContent.match(musicPatterns[feature]);
      features[feature] = matches ? matches.length : 0;
    });

    return features;
  }
}

class CommitMessageGenerator {
  constructor(analyzer) {
    this.analyzer = analyzer;
  }

  // Generate commit type based on analysis
  determineCommitType(fileAnalysis, codePatterns, musicFeatures) {
    // Priority-based type determination
    if (fileAnalysis.tests.length > 0) {
      return 'test';
    }

    if (fileAnalysis.docs.length > 0 && fileAnalysis.docs.length === this.analyzer.changedFiles.length) {
      return 'docs';
    }

    if (fileAnalysis.config.length > 0 && codePatterns.functions === 0) {
      return 'chore';
    }

    if (codePatterns.styling > 5 || fileAnalysis.styles.length > 0) {
      return 'style';
    }

    if (musicFeatures.player > 0 || musicFeatures.lyrics > 0 || musicFeatures.search > 0) {
      return 'feat';
    }

    if (fileAnalysis.components.length > 0 || fileAnalysis.hooks.length > 0) {
      return 'feat';
    }

    if (fileAnalysis.types.length > 0 && codePatterns.functions === 0) {
      return 'refactor';
    }

    if (codePatterns.async > 3 || fileAnalysis.services.length > 0) {
      return 'feat';
    }

    return 'chore';
  }

  // Generate descriptive commit message
  generateDescription(fileAnalysis, codePatterns, musicFeatures, commitType) {
    const components = [];

    // Music-specific features
    if (musicFeatures.player > 0) {
      components.push('audio player functionality');
    }
    if (musicFeatures.lyrics > 0) {
      components.push('lyrics display and synchronization');
    }
    if (musicFeatures.search > 0) {
      components.push('music search capabilities');
    }

    // Component updates
    if (fileAnalysis.components.length > 0) {
      const componentNames = fileAnalysis.components
        .map(f => path.basename(f, path.extname(f)))
        .slice(0, 3);
      components.push(`${componentNames.join(', ')} component${componentNames.length > 1 ? 's' : ''}`);
    }

    // Hook updates
    if (fileAnalysis.hooks.length > 0) {
      const hookNames = fileAnalysis.hooks
        .map(f => path.basename(f, '.ts'))
        .slice(0, 2);
      components.push(`${hookNames.join(', ')} hook${hookNames.length > 1 ? 's' : ''}`);
    }

    // Service updates
    if (fileAnalysis.services.length > 0) {
      components.push('API services');
    }

    // Type updates
    if (fileAnalysis.types.length > 0) {
      components.push('TypeScript types');
    }

    // Fallback descriptions
    if (components.length === 0) {
      if (commitType === 'style') {
        components.push('UI styling and appearance');
      } else if (commitType === 'chore') {
        components.push('project configuration');
      } else if (commitType === 'refactor') {
        components.push('code structure');
      } else {
        components.push('application features');
      }
    }

    let description = components.slice(0, 2).join(' and ');

    // Add specific details
    const details = [];
    if (codePatterns.reactHooks > 0) {
      details.push('React hooks');
    }
    if (codePatterns.typeScript > 0) {
      details.push('TypeScript interfaces');
    }
    if (codePatterns.apiCalls > 0) {
      details.push('API integration');
    }
    if (codePatterns.styling > 0) {
      details.push('component styling');
    }

    if (details.length > 0) {
      description += ` with ${details.slice(0, 2).join(' and ')}`;
    }

    return description;
  }

  // Generate the complete commit message
  generate() {
    const fileAnalysis = this.analyzer.analyzeFileTypes();
    const codePatterns = this.analyzer.analyzeCodePatterns();
    const musicFeatures = this.analyzer.analyzeMusicFeatures();

    const commitType = this.determineCommitType(fileAnalysis, codePatterns, musicFeatures);
    const description = this.generateDescription(fileAnalysis, codePatterns, musicFeatures, commitType);

    // Format the commit message
    const scope = this.determineScope(fileAnalysis, musicFeatures);
    const scopeText = scope ? `(${scope})` : '';
    
    return `${commitType}${scopeText}: ${description}`;
  }

  // Determine scope based on changes
  determineScope(fileAnalysis, musicFeatures) {
    if (musicFeatures.player > musicFeatures.lyrics && musicFeatures.player > musicFeatures.search) {
      return 'player';
    }
    if (musicFeatures.lyrics > musicFeatures.search) {
      return 'lyrics';
    }
    if (musicFeatures.search > 0) {
      return 'search';
    }
    if (fileAnalysis.components.length > 0) {
      return 'ui';
    }
    if (fileAnalysis.services.length > 0) {
      return 'api';
    }
    if (fileAnalysis.types.length > 0) {
      return 'types';
    }
    return null;
  }
}

// Main execution
function main() {
  console.log('🎵 NerU Lyrics Smart Commit Generator\n');

  const analyzer = new GitAnalyzer();

  // Check if we're in a git repository
  if (!analyzer.isGitRepo()) {
    console.error('❌ Error: Not in a git repository');
    process.exit(1);
  }

  // Get changed files
  const changedFiles = analyzer.getChangedFiles();
  if (changedFiles.length === 0) {
    console.log('✅ No changes detected');
    process.exit(0);
  }

  console.log(`📁 Found ${changedFiles.length} changed file(s):`);
  changedFiles.slice(0, 10).forEach(file => console.log(`   ${file}`));
  if (changedFiles.length > 10) {
    console.log(`   ... and ${changedFiles.length - 10} more`);
  }
  console.log();

  // Get diff content
  const diffContent = analyzer.getDiffContent();
  if (!diffContent) {
    console.log('✅ No staged changes detected');
    process.exit(0);
  }

  // Generate commit message
  const generator = new CommitMessageGenerator(analyzer);
  const commitMessage = generator.generate();

  console.log('📝 Generated commit message:');
  console.log(`   ${commitMessage}\n`);

  // Check for command line arguments
  const args = process.argv.slice(2);
  const shouldCommit = args.includes('--commit') || args.includes('-c');
  const shouldPush = args.includes('--push') || args.includes('-p');

  if (shouldCommit) {
    try {
      console.log('💾 Committing changes...');
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      console.log('✅ Successfully committed changes\n');

      if (shouldPush) {
        console.log('🚀 Pushing to remote...');
        try {
          execSync('git push', { stdio: 'inherit' });
          console.log('✅ Successfully pushed to remote');
        } catch (error) {
          console.warn('⚠️  Failed to push to remote. You may need to push manually.');
        }
      }
    } catch (error) {
      console.error('❌ Failed to commit changes:', error.message);
      process.exit(1);
    }
  } else {
    console.log('💡 To commit with this message, run:');
    console.log(`   git commit -m "${commitMessage}"`);
    console.log('\n💡 Or run this script with --commit to auto-commit:');
    console.log('   node scripts/smart-commit.js --commit');
  }
}

if (import.meta.url === `file://${__filename}`) {
  main();
}

export { GitAnalyzer, CommitMessageGenerator };
