#!/bin/bash

echo "🚀 Quick Start - Upflyover Platform (Individual Signup Testing)"
echo "📋 This will start both frontend and backend locally"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Run this from the upflyover root directory"
    echo "📁 Expected structure: upflyover/backend and upflyover/frontend"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend npm install failed"
    exit 1
fi
cd ..

# Install frontend dependencies  
echo "🎨 Installing frontend dependencies..."
cd frontend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend npm install failed"
    exit 1
fi
cd ..

echo ""
echo "🚀 Starting services..."
echo "📝 Backend will use in-memory storage (no MongoDB required)"
echo "🔐 Twilio OTP will work with your configured credentials"
echo ""

# Start backend server
echo "🔧 Starting backend server on port 5000..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📋 Test Individual Signup: http://localhost:3000/signup"
echo ""
echo "🧪 Test Flow:"
echo "   1. Go to http://localhost:3000/signup"
echo "   2. Choose 'Individual' signup"
echo "   3. Register with email/password"
echo "   4. Verify email OTP (real Twilio)"
echo "   5. Select user type"
echo "   6. Verify mobile OTP (real Twilio)"
echo "   7. Complete KYC process"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Function to cleanup processes
cleanup() {
    echo "\n🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup INT

# Wait for processes
wait