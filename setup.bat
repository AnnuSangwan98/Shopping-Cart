@echo off
echo 🚀 Setting up E-commerce Store Application
echo ==========================================

REM Check if Go is installed
go version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Go is not installed. Please install Go 1.21 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install Go dependencies
echo 📦 Installing Go dependencies...
go mod tidy

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
cd frontend
npm install
cd ..

echo ✅ Dependencies installed successfully

echo.
echo 🎉 Setup completed successfully!
echo.
echo To start the application:
echo 1. Start the backend: go run .
echo 2. Start the frontend: cd frontend ^&^& npm start
echo.
echo The application will be available at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8080
echo.
echo Sample user credentials:
echo - Username: testuser
echo - Password: password123
echo.
echo Don't forget to create a user account first using the API or Postman collection!
pause 