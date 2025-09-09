#!/bin/bash

echo "🚀 Quick Start - Waha Platform (without external databases)"

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
cd frontend && npm install && cd ..

# Start backend with in-memory database
cd backend
echo "Starting backend server..."
NODE_ENV=development PORT=5000 node src/server.js &

# Start frontend
cd ../frontend
echo "Starting frontend..."
npm start &

echo "✅ Services starting..."
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"
wait