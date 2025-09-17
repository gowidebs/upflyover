# Waha Platform Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB 7.0+
- Docker and Docker Compose (optional)
- Git

## Quick Start with Docker

1. **Clone and setup:**
```bash
git clone <repository-url>
cd waha-platform
cp .env.example .env
```

2. **Start all services:**
```bash
docker-compose up -d
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## Manual Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set environment variables:**
```bash
cp ../.env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB:**
```bash
# Using Docker
docker run -d -p 27017:27017 --name waha-mongo mongo:7.0

# Or install MongoDB locally
```

5. **Start the backend:**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the frontend:**
```bash
npm start
```

## Development Workflow

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production
```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

## Environment Configuration

Key environment variables:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS

## Troubleshooting

### Common Issues

1. **Port conflicts:** Change ports in docker-compose.yml or .env
2. **MongoDB connection:** Ensure MongoDB is running and accessible
3. **CORS errors:** Check FRONTEND_URL in backend .env

### Logs
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Local development
# Backend logs in terminal
# Frontend logs in browser console
```