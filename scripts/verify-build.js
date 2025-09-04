// Build verification script
const fs = require('fs-extra');
const path = require('path');

// Ensure required directories exist
const requiredDirs = [
  'public',
  'netlify/functions',
  'src/generated'
];

console.log('🔍 Verifying build environment...');

// Create directories if they don't exist
requiredDirs.forEach(dir => {
  const fullPath = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.ensureDirSync(fullPath);
  } else {
    console.log(`✅ Directory exists: ${dir}`);
  }
});

console.log('✅ Build environment verified!');