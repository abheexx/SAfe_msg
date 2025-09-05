#!/bin/bash

# Bumble Safe Chat Filter - Development Startup Script
# This script starts both the backend and frontend in development mode

echo "🐝 Starting Bumble Safe Chat Filter Development Environment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Make sure both 'backend' and 'frontend' folders exist"
    exit 1
fi

# Function to start backend
start_backend() {
    echo "🚀 Starting FastAPI backend..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "📦 Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    echo "📥 Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Start backend
    echo "🌐 Backend starting at http://localhost:8000"
    uvicorn app:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🚀 Starting React frontend..."
    cd frontend
    
    # Install dependencies
    echo "📥 Installing Node.js dependencies..."
    npm install
    
    # Start frontend
    echo "🌐 Frontend starting at http://localhost:3000"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Start both services
start_backend
sleep 3
start_frontend

echo ""
echo "✅ Both services are starting up!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait
