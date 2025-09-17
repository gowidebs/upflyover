#!/bin/bash

# Waha Platform Development Setup Script
echo "🚀 Setting up Waha Platform Development Environment..."

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker not found. Please install Docker"
        exit 1
    fi
    
    # Check Flutter (optional)
    if ! command -v flutter &> /dev/null; then
        echo "⚠️  Flutter not found. Mobile app development will be unavailable"
    fi
    
    echo "✅ Prerequisites check completed"
}

# Setup environment files
setup_environment() {
    echo "🔧 Setting up environment files..."
    
    # Backend API environment
    if [ ! -f "backend-api/.env" ]; then
        cp backend-api/.env.example backend-api/.env
        echo "✅ Created backend-api/.env"
    fi
    
    # Web app environment
    if [ ! -f "web-app/.env" ]; then
        cat > web-app/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_SENTRY_DSN=
EOF
        echo "✅ Created web-app/.env"
    fi
    
    # Marketing site environment
    if [ ! -f "marketing-site/.env.local" ]; then
        cat > marketing-site/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WEB_APP_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3001
EOF
        echo "✅ Created marketing-site/.env.local"
    fi
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Root dependencies
    npm install
    
    # Backend API
    if [ -d "backend-api" ]; then
        cd backend-api && npm install && cd ..
        echo "✅ Backend API dependencies installed"
    fi
    
    # Web App
    if [ -d "web-app" ]; then
        cd web-app && npm install && cd ..
        echo "✅ Web App dependencies installed"
    fi
    
    # Marketing Site
    if [ -d "marketing-site" ]; then
        cd marketing-site && npm install && cd ..
        echo "✅ Marketing Site dependencies installed"
    fi
    
    # Admin Panel
    if [ -d "admin-panel" ]; then
        cd admin-panel && npm install && cd ..
        echo "✅ Admin Panel dependencies installed"
    fi
    
    # AI Services (Python)
    if [ -d "ai-services" ]; then
        cd ai-services
        if command -v python3 &> /dev/null; then
            python3 -m venv venv
            source venv/bin/activate
            pip install -r requirements.txt
            echo "✅ AI Services dependencies installed"
        fi
        cd ..
    fi
    
    # Mobile App (Flutter)
    if [ -d "mobile-app" ] && command -v flutter &> /dev/null; then
        cd mobile-app && flutter pub get && cd ..
        echo "✅ Mobile App dependencies installed"
    fi
}

# Setup Git hooks
setup_git_hooks() {
    echo "🔗 Setting up Git hooks..."
    npx husky install
    npx husky add .husky/pre-commit "npx lint-staged"
    echo "✅ Git hooks configured"
}

# Create initial database
setup_database() {
    echo "🗄️  Setting up database..."
    
    # Start MongoDB container
    docker-compose -f infrastructure/docker-compose.dev.yml up -d mongodb redis
    
    # Wait for MongoDB to be ready
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 10
    
    # Run database migrations/seeds if they exist
    if [ -f "backend-api/scripts/seed-database.js" ]; then
        cd backend-api && npm run seed:dev && cd ..
        echo "✅ Database seeded with initial data"
    fi
}

# Generate SSL certificates for local development
setup_ssl() {
    echo "🔒 Setting up SSL certificates for local development..."
    
    mkdir -p infrastructure/ssl
    
    # Generate self-signed certificate
    openssl req -x509 -newkey rsa:4096 -keyout infrastructure/ssl/key.pem -out infrastructure/ssl/cert.pem -days 365 -nodes -subj "/C=AE/ST=Dubai/L=Dubai/O=Waha/CN=localhost"
    
    echo "✅ SSL certificates generated"
}

# Create development scripts
create_dev_scripts() {
    echo "📝 Creating development scripts..."
    
    # Start all services script
    cat > scripts/start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Waha Platform Development Environment..."
docker-compose -f infrastructure/docker-compose.dev.yml up -d
echo "✅ All services started!"
echo "🌐 Web App: http://localhost:3000"
echo "🌐 Marketing Site: http://localhost:3001"
echo "🌐 Admin Panel: http://localhost:3002"
echo "🔧 API: http://localhost:5000"
echo "🤖 AI Services: http://localhost:8000"
EOF
    
    # Stop all services script
    cat > scripts/stop-dev.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping Waha Platform Development Environment..."
docker-compose -f infrastructure/docker-compose.dev.yml down
echo "✅ All services stopped!"
EOF
    
    # Make scripts executable
    chmod +x scripts/start-dev.sh
    chmod +x scripts/stop-dev.sh
    
    echo "✅ Development scripts created"
}

# Main setup function
main() {
    echo "🌟 Welcome to Waha Platform Setup!"
    echo "This script will set up your complete development environment."
    echo ""
    
    check_prerequisites
    setup_environment
    install_dependencies
    setup_git_hooks
    setup_database
    setup_ssl
    create_dev_scripts
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📚 Next steps:"
    echo "1. Start development environment: ./scripts/start-dev.sh"
    echo "2. Open web app: http://localhost:3000"
    echo "3. Open marketing site: http://localhost:3001"
    echo "4. Open admin panel: http://localhost:3002"
    echo "5. API documentation: http://localhost:5000/api-docs"
    echo ""
    echo "📱 For mobile development:"
    echo "1. cd mobile-app"
    echo "2. flutter run"
    echo ""
    echo "🔧 Useful commands:"
    echo "- npm run dev: Start all services locally"
    echo "- npm run docker:up: Start with Docker"
    echo "- npm run test:all: Run all tests"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main