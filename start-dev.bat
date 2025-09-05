@echo off
REM Safe Chat Filter - Development Startup Script (Windows)
REM This script starts both the backend and frontend in development mode

echo Starting Safe Chat Filter Development Environment
echo ================================================

REM Check if we're in the right directory
if not exist "backend" (
    echo Error: Please run this script from the project root directory
    echo    Make sure both 'backend' and 'frontend' folders exist
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: Please run this script from the project root directory
    echo    Make sure both 'backend' and 'frontend' folders exist
    pause
    exit /b 1
)

echo Starting FastAPI backend...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Start backend
echo Backend starting at http://localhost:8000
start "Backend" cmd /k "uvicorn app:app --reload --host 0.0.0.0 --port 8000"

cd ..

echo Starting React frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
npm install

REM Start frontend
echo Frontend starting at http://localhost:3000
start "Frontend" cmd /k "npm run dev"

cd ..

echo.
echo Both services are starting up!
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
