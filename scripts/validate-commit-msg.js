#!/usr/bin/env node

/**
 * Commit Message Validator for NerU Lyrics
 * Validates commit messages against conventional commit format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conventional commit pattern
const COMMIT_PATTERN = /^(feat|fix|docs|style|refactor|perf|test|chore|auto)(\(.+\))?: .{1,50}/;

// Extended patterns for auto-commits
const AUTO_PATTERNS = [
  /^auto: /,
  /^feat\(.*\): /,
  /^fix\(.*\): /,
  /^docs\(.*\): /,
  /^style\(.*\): /,
  /^refactor\(.*\): /,
  /^test\(.*\): /,
  /^chore\(.*\): /
];

function validateCommitMessage(message) {
  const firstLine = message.split('\n')[0];
  
  // Check if it matches conventional commit format
  if (COMMIT_PATTERN.test(firstLine)) {
    return { valid: true, message: 'Valid conventional commit format' };
  }
  
  // Check if it's an auto-generated commit
  if (AUTO_PATTERNS.some(pattern => pattern.test(firstLine))) {
    return { valid: true, message: 'Valid auto-generated commit format' };
  }
  
  return {
    valid: false,
    message: `Invalid commit message format: "${firstLine}"`
  };
}

function main() {
  const commitMsgFile = process.argv[2];
  
  if (!commitMsgFile) {
    console.error('Usage: node validate-commit-msg.js <commit-msg-file>');
    process.exit(1);
  }
  
  if (!fs.existsSync(commitMsgFile)) {
    console.error(`Commit message file not found: ${commitMsgFile}`);
    process.exit(1);
  }
  
  const commitMessage = fs.readFileSync(commitMsgFile, 'utf8').trim();
  
  if (!commitMessage) {
    console.error('Empty commit message');
    process.exit(1);
  }
  
  const validation = validateCommitMessage(commitMessage);
  
  if (validation.valid) {
    console.log(`✅ ${validation.message}`);
    process.exit(0);
  } else {
    console.error(`❌ ${validation.message}`);
    console.error('\nExpected format: type(scope): description');
    console.error('Types: feat, fix, docs, style, refactor, perf, test, chore, auto');
    console.error('Example: feat(player): add volume control');
    process.exit(1);
  }
}

if (import.meta.url === `file://${__filename}`) {
  main();
}

export { validateCommitMessage };
