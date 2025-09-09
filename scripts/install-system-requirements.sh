#!/bin/bash

echo "🚀 Installing Waha Platform System Requirements..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Update Homebrew
brew update

# Install Node.js and package managers
echo "📦 Installing Node.js..."
brew install node@20
npm install -g yarn pnpm

# Install Git
echo "📦 Installing Git..."
brew install git

# Install databases
echo "🗄️ Installing databases..."
brew tap mongodb/brew
brew install mongodb-community redis

# Install Docker
echo "🐳 Installing Docker..."
brew install --cask docker

# Install Python
echo "🐍 Installing Python..."
brew install python@3.11
pip3 install virtualenv pipenv

# Install development tools
echo "🛠️ Installing development tools..."
brew install --cask visual-studio-code
brew install --cask postman
brew install tree htop wget curl

# Install AWS CLI
echo "☁️ Installing AWS CLI..."
brew install awscli

# Install global npm packages
echo "📦 Installing global npm packages..."
npm install -g @angular/cli @ionic/cli vercel firebase-tools

# Install Flutter (manual step required)
echo "📱 Flutter installation:"
echo "1. Download Flutter SDK from: https://docs.flutter.dev/get-started/install/macos"
echo "2. Extract and add to PATH"
echo "3. Run 'flutter doctor' to verify"

# Install Android Studio (manual step required)
echo "🤖 Android Studio installation:"
echo "1. Download from: https://developer.android.com/studio"
echo "2. Install Android SDK and emulator"

# Install Xcode (manual step required)
echo "🍎 iOS Development:"
echo "1. Install Xcode from Mac App Store"
echo "2. Install Xcode Command Line Tools: xcode-select --install"

echo "✅ System requirements installation completed!"
echo ""
echo "📋 Manual steps remaining:"
echo "1. Download and install Flutter SDK"
echo "2. Download and install Android Studio"
echo "3. Install Xcode from Mac App Store"
echo "4. Configure AWS credentials: aws configure"
echo "5. Setup Git credentials: git config --global user.name/user.email"
echo ""
echo "🚀 After completing manual steps, run: ./scripts/setup-development.sh"