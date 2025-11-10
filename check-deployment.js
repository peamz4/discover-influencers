#!/usr/bin/env node

/**
 * Pre-Deployment Checklist Script
 * Validates that the project is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Deployment Pre-Flight Check\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: pnpm-workspace.yaml exists
console.log('1️⃣  Checking pnpm workspace configuration...');
if (fs.existsSync('pnpm-workspace.yaml')) {
  console.log('   ✅ pnpm-workspace.yaml found');
} else {
  console.log('   ❌ pnpm-workspace.yaml not found');
  hasErrors = true;
}

// Check 2: Vercel config files exist
console.log('\n2️⃣  Checking Vercel configuration files...');
const vercelConfigs = [
  'apps/api/vercel.json',
  'apps/web/vercel.json'
];

vercelConfigs.forEach(config => {
  if (fs.existsSync(config)) {
    console.log(`   ✅ ${config} found`);
  } else {
    console.log(`   ❌ ${config} not found`);
    hasErrors = true;
  }
});

// Check 3: Package.json files
console.log('\n3️⃣  Checking package.json files...');
const packageJsons = [
  'package.json',
  'apps/api/package.json',
  'apps/web/package.json'
];

packageJsons.forEach(pkg => {
  if (fs.existsSync(pkg)) {
    console.log(`   ✅ ${pkg} found`);
    
    // Check for vercel-build script in API
    if (pkg === 'apps/api/package.json') {
      const content = JSON.parse(fs.readFileSync(pkg, 'utf8'));
      if (content.scripts && content.scripts['vercel-build']) {
        console.log('   ✅ vercel-build script found in API package.json');
      } else {
        console.log('   ⚠️  vercel-build script missing in API package.json');
        hasWarnings = true;
      }
    }
  } else {
    console.log(`   ❌ ${pkg} not found`);
    hasErrors = true;
  }
});

// Check 4: Environment example files
console.log('\n4️⃣  Checking environment variable examples...');
const envExamples = [
  'apps/api/.env.example',
  'apps/web/.env.example'
];

envExamples.forEach(env => {
  if (fs.existsSync(env)) {
    console.log(`   ✅ ${env} found`);
  } else {
    console.log(`   ⚠️  ${env} not found - create one for reference`);
    hasWarnings = true;
  }
});

// Check 5: Next.js config
console.log('\n5️⃣  Checking Next.js configuration...');
if (fs.existsSync('apps/web/next.config.ts') || fs.existsSync('apps/web/next.config.js')) {
  console.log('   ✅ Next.js config found');
  
  const configPath = fs.existsSync('apps/web/next.config.ts') 
    ? 'apps/web/next.config.ts' 
    : 'apps/web/next.config.js';
  
  const content = fs.readFileSync(configPath, 'utf8');
  if (content.includes('output') || content.includes('standalone')) {
    console.log('   ✅ Standalone output configured');
  } else {
    console.log('   ⚠️  Consider adding "output: \'standalone\'" for optimal Vercel deployment');
    hasWarnings = true;
  }
} else {
  console.log('   ❌ Next.js config not found');
  hasErrors = true;
}

// Check 6: Prisma schema
console.log('\n6️⃣  Checking Prisma setup...');
if (fs.existsSync('apps/api/prisma/schema.prisma')) {
  console.log('   ✅ Prisma schema found');
} else {
  console.log('   ❌ Prisma schema not found');
  hasErrors = true;
}

// Check 7: TypeScript configs
console.log('\n7️⃣  Checking TypeScript configuration...');
const tsConfigs = [
  'apps/api/tsconfig.json',
  'apps/web/tsconfig.json'
];

tsConfigs.forEach(ts => {
  if (fs.existsSync(ts)) {
    console.log(`   ✅ ${ts} found`);
  } else {
    console.log(`   ❌ ${ts} not found`);
    hasErrors = true;
  }
});

// Check 8: API server setup
console.log('\n8️⃣  Checking API server configuration...');
if (fs.existsSync('apps/api/src/server.ts')) {
  console.log('   ✅ API server file found');
  
  const content = fs.readFileSync('apps/api/src/server.ts', 'utf8');
  if (content.includes('VERCEL') || content.includes('export default')) {
    console.log('   ✅ Server configured for serverless deployment');
  } else {
    console.log('   ⚠️  Server may not be configured for serverless - check for VERCEL env check');
    hasWarnings = true;
  }
} else {
  console.log('   ❌ API server file not found');
  hasErrors = true;
}

// Check 9: Git repository
console.log('\n9️⃣  Checking Git repository...');
if (fs.existsSync('.git')) {
  console.log('   ✅ Git repository initialized');
  
  // Check if there are uncommitted changes
  try {
    const { execSync } = require('child_process');
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('   ⚠️  Uncommitted changes found - commit before deploying');
      hasWarnings = true;
    } else {
      console.log('   ✅ No uncommitted changes');
    }
  } catch (e) {
    console.log('   ⚠️  Could not check git status');
  }
} else {
  console.log('   ❌ Git repository not initialized');
  hasErrors = true;
}

// Check 10: Node modules
console.log('\n🔟 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ Dependencies installed');
} else {
  console.log('   ⚠️  Dependencies not installed - run "pnpm install"');
  hasWarnings = true;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Pre-Flight Check Summary\n');

if (!hasErrors && !hasWarnings) {
  console.log('✅ All checks passed! Ready for deployment.\n');
  console.log('Next steps:');
  console.log('1. Push code to GitHub');
  console.log('2. Follow DEPLOYMENT_QUICKSTART.md');
  console.log('3. Deploy to Vercel\n');
  process.exit(0);
} else if (hasErrors) {
  console.log('❌ Critical issues found. Please fix before deploying.\n');
  process.exit(1);
} else {
  console.log('⚠️  Warnings found. Review before deploying.\n');
  console.log('You can proceed, but consider addressing warnings first.\n');
  process.exit(0);
}
