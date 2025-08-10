#!/usr/bin/env node

/**
 * Commitizen Adapter for NerU Lyrics
 * Provides interactive commit message creation
 * 
 * Note: This file uses CommonJS for compatibility with Commitizen
 */

// Simple implementation without external dependencies
const readline = require('readline');

const types = [
  { value: 'feat', name: 'feat:     ✨ A new feature', short: 'feat' },
  { value: 'fix', name: 'fix:      🐛 A bug fix', short: 'fix' },
  { value: 'docs', name: 'docs:     📚 Documentation only changes', short: 'docs' },
  { value: 'style', name: 'style:    💎 Changes that do not affect the meaning of the code', short: 'style' },
  { value: 'refactor', name: 'refactor: 📦 A code change that neither fixes a bug nor adds a feature', short: 'refactor' },
  { value: 'perf', name: 'perf:     🚀 A code change that improves performance', short: 'perf' },
  { value: 'test', name: 'test:     🚨 Adding missing tests or correcting existing tests', short: 'test' },
  { value: 'chore', name: 'chore:    🔧 Changes to the build process or auxiliary tools', short: 'chore' }
];

const scopes = [
  { name: 'player', description: 'Audio player functionality' },
  { name: 'lyrics', description: 'Lyrics display and synchronization' },
  { name: 'search', description: 'Music search capabilities' },
  { name: 'ui', description: 'User interface components' },
  { name: 'api', description: 'API services and integration' },
  { name: 'types', description: 'TypeScript type definitions' },
  { name: 'config', description: 'Configuration files' },
  { name: 'build', description: 'Build system and dependencies' }
];

function question(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

function displayChoices(choices, title) {
  console.log(`\n${title}`);
  choices.forEach((choice, index) => {
    console.log(`  ${index + 1}. ${choice.name || choice.value}`);
  });
}

async function selectFromList(rl, choices, title, allowEmpty = false) {
  displayChoices(choices, title);
  
  if (allowEmpty) {
    console.log(`  0. (none)`);
  }
  
  while (true) {
    const answer = await question(rl, '\nSelect (number): ');
    const index = parseInt(answer) - 1;
    
    if (allowEmpty && answer === '0') {
      return null;
    }
    
    if (index >= 0 && index < choices.length) {
      return choices[index];
    }
    
    console.log('Invalid selection. Please try again.');
  }
}

async function createCommitMessage() {
  console.log('\n🎵 NerU Lyrics Commit Assistant\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  try {
    // Select type
    const type = await selectFromList(rl, types, 'Select the type of change:');
    
    // Select scope
    const scopeChoices = [{ name: '(none)', value: '' }, ...scopes.map(s => ({ name: `${s.name} - ${s.description}`, value: s.name }))];
    const scope = await selectFromList(rl, scopeChoices, 'Select the scope of this change:', true);
    
    // Get description
    let description;
    while (true) {
      description = await question(rl, 'Write a short description of the change: ');
      if (description) {
        if (description.length <= 50) {
          break;
        } else {
          console.log('Description should be 50 characters or less. Please try again.');
        }
      } else {
        console.log('Description is required. Please try again.');
      }
    }
    
    // Get optional body
    const body = await question(rl, 'Provide a longer description (optional): ');
    
    // Get optional footer
    const footer = await question(rl, 'List any breaking changes or issues closed (optional): ');
    
    // Build commit message
    const scopeText = scope && scope.value ? `(${scope.value})` : '';
    const head = `${type.value}${scopeText}: ${description}`;
    
    let commitMessage = head;
    
    if (body) {
      commitMessage += `\n\n${body}`;
    }
    
    if (footer) {
      commitMessage += `\n\n${footer}`;
    }
    
    console.log('\n📝 Generated commit message:');
    console.log(commitMessage);
    
    const confirm = await question(rl, '\nCommit with this message? (y/N): ');
    
    rl.close();
    
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      return commitMessage;
    } else {
      console.log('Commit cancelled');
      process.exit(1);
    }
    
  } catch (error) {
    rl.close();
    throw error;
  }
}

// Export for commitizen (simplified version)
module.exports = {
  prompter: function(cz, commit) {
    // Simple fallback for commitizen
    console.log('🎵 NerU Lyrics Auto Commit');
    
    // Get current changes and generate a simple message
    const { execSync } = require('child_process');
    try {
      const files = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
      if (!files) {
        execSync('git add .', { stdio: 'ignore' });
      }
      
      let commitType = 'chore';
      let scope = '';
      let description = 'update project files';
      
      // Simple analysis
      const changedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim().split('\n');
      
      if (changedFiles.some(f => f.includes('components/'))) {
        commitType = 'feat';
        scope = 'ui';
        description = 'update components';
      } else if (changedFiles.some(f => f.includes('hooks/'))) {
        commitType = 'feat';
        scope = 'hooks';
        description = 'update custom hooks';
      } else if (changedFiles.some(f => f.includes('services/'))) {
        commitType = 'feat';
        scope = 'api';
        description = 'update API services';
      }
      
      const message = scope ? `${commitType}(${scope}): ${description}` : `${commitType}: ${description}`;
      commit(message);
      
    } catch (error) {
      commit('chore: update project files');
    }
  }
};

// CLI usage
if (require.main === module) {
  createCommitMessage()
    .then(message => {
      console.log('\n' + message);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
