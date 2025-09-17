#!/bin/bash

# Waha Platform - Start Here Script
echo "🌟 Welcome to Waha Platform!"
echo "📍 Location: /Users/ae/Desktop/waha-platform"
echo ""

# Check current directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Please run this script from the waha-platform root directory"
    echo "💡 Try: cd /Users/ae/Desktop/waha-platform && ./scripts/start-here.sh"
    exit 1
fi

echo "✅ Correct directory detected"
echo ""

# Quick setup options
echo "🚀 Choose your setup option:"
echo "1. Full Development Setup (recommended)"
echo "2. Quick Docker Start"
echo "3. Manual Setup Guide"
echo "4. View Documentation"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🔧 Running full development setup..."
        ./scripts/setup-development.sh
        ;;
    2)
        echo "🐳 Starting with Docker..."
        docker-compose -f infrastructure/docker-compose.dev.yml up -d
        echo "✅ Services started!"
        echo "🌐 Web App: http://localhost:3000"
        echo "🔧 API: http://localhost:5000"
        ;;
    3)
        echo "📖 Opening setup guide..."
        cat IMMEDIATE_SETUP.md
        ;;
    4)
        echo "📚 Available documentation:"
        echo "- README.md - Project overview"
        echo "- STAGE_1_UPDATE.md - Current status"
        echo "- PRODUCTION_REQUIREMENTS.md - Full requirements"
        echo "- IMMEDIATE_SETUP.md - Quick start guide"
        echo "- docs/API.md - API documentation"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        ;;
esac