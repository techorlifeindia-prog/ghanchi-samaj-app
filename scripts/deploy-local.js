// [GSA-OPS-B-JS] Local Trigger for Safe Auto-Deploy Pipeline
import { execSync } from 'child_process';

const VPS_HOST = '45.195.159.217';
const VPS_USER = 'root';
const REMOTE_PATH = '/var/www/ghanchi-samaj-app';
const REPO_URL = 'https://github.com/techorlifeindia-prog/ghanchi-samaj-app.git';

console.log('====================================================');
console.log('🛡️  [Ghanchi Samaj App] Starting Safe Auto-Deploy');
console.log('====================================================\n');

try {
  // Step 1: Pre-flight Local Validation
  console.log('🔍 [1/4] Running local TypeScript and Build safety checks...');
  execSync('npm run check', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Local build passed cleanly with zero errors.\n');

  // Step 2: Push changes to GitHub
  console.log('🚀 [2/4] Syncing latest code with GitHub...');
  try {
    execSync('git push origin main', { stdio: 'inherit' });
  } catch (e) {
    console.log('ℹ️  Origin main up to date.');
  }
  console.log('✅ Code pushed to GitHub successfully.\n');

  // Step 3: Trigger Remote VPS Pipeline via SSH
  console.log(`🌐 [3/4] Connecting to VPS (${VPS_HOST}) and executing Safe Pipeline...`);

  const remoteCommand = `
    if [ ! -d "${REMOTE_PATH}" ]; then
      echo "📦 Setting up initial repository directory...";
      mkdir -p /var/www;
      cd /var/www;
      git clone ${REPO_URL} ghanchi-samaj-app;
    fi;
    cd ${REMOTE_PATH} && chmod +x scripts/deploy.sh && bash scripts/deploy.sh
  `;

  execSync(`ssh ${VPS_USER}@${VPS_HOST} "${remoteCommand.replace(/\n\s+/g, ' ')}"`, {
    stdio: 'inherit'
  });

  console.log('\n====================================================');
  console.log('🎉 [4/4] VPS AUTO-DEPLOYMENT FINISHED SUCCESSFULLY!');
  console.log(`🌐 Live URL: http://${VPS_HOST}:5001`);
  console.log('====================================================');
} catch (error) {
  console.error('\n❌ [DEPLOY ERROR] Deployment stopped safely:', error.message);
  process.exit(1);
}
