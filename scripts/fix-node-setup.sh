#!/bin/bash

echo "🔧 Fixing Node.js setup..."

# Load nvm in current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Install package managers without sudo
npm install -g yarn pnpm --unsafe-perm=true --allow-root

echo "✅ Node.js setup completed!"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"