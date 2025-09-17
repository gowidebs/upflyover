// Emergency dependency installer for Railway
const { execSync } = require('child_process');

console.log('Installing missing dependencies...');

try {
  execSync('npm install swagger-jsdoc@6.2.8 swagger-ui-express@5.0.0 express-rate-limit@7.1.5', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully!');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}