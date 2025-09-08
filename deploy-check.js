#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Run this before deploying to catch common issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment verification...\n');

// Check 1: Verify package.json exists
console.log('1️⃣ Checking package.json...');
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found');
  process.exit(1);
}
console.log('✅ package.json found');

// Check 2: Verify essential files exist
console.log('\n2️⃣ Checking essential files...');
const requiredFiles = [
  'next.config.ts',
  'tsconfig.json',
  'app/layout.tsx',
  'app/page.tsx',
  'components/app.tsx',
  'components/welcome.tsx'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Required file missing: ${file}`);
    process.exit(1);
  }
}
console.log('✅ All essential files present');

// Check 3: Install dependencies
console.log('\n3️⃣ Installing dependencies...');
try {
  execSync('npm ci', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Check 4: Run build
console.log('\n4️⃣ Running build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Check 5: Run lint
console.log('\n5️⃣ Running lint...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Lint passed');
} catch (error) {
  console.error('❌ Lint failed');
  process.exit(1);
}

// Check 6: TypeScript check
console.log('\n6️⃣ Running TypeScript check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed');
} catch (error) {
  console.error('❌ TypeScript check failed');
  process.exit(1);
}

console.log('\n🎉 All checks passed! Ready for deployment.\n');
console.log('💡 Deployment tips:');
console.log('- Set environment variables: LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL');
console.log('- Use vercel.json configuration for Vercel deployments');
console.log('- Refer to DEPLOYMENT_TROUBLESHOOTING.md if you encounter issues');
console.log('- Test your deployed app with the checklist in TESTING.md');
