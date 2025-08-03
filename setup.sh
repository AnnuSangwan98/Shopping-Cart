#!/bin/bash

echo "🚀 Setting up E-commerce Store Application"
echo "=========================================="

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.21 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install Go dependencies
echo "📦 Installing Go dependencies..."
go mod tidy

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully"

# Create some sample data
echo "📝 Creating sample data..."

# Start the backend server in background
echo "🔧 Starting backend server..."
go run . &
BACKEND_PID=$!

# Wait for server to start
sleep 3

# Create sample items
echo "📦 Creating sample items..."
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"High-performance laptop with latest specs","price":999.99}' \
  -s > /dev/null

curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Wireless Mouse","description":"Ergonomic wireless mouse","price":29.99}' \
  -s > /dev/null

curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Mechanical Keyboard","description":"RGB mechanical keyboard","price":89.99}' \
  -s > /dev/null

curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Monitor","description":"27-inch 4K monitor","price":299.99}' \
  -s > /dev/null

echo "✅ Sample data created"

# Stop the backend server
kill $BACKEND_PID

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start the backend: go run ."
echo "2. Start the frontend: cd frontend && npm start"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8080"
echo ""
echo "Sample user credentials:"
echo "- Username: testuser"
echo "- Password: password123"
echo ""
echo "Don't forget to create a user account first using the API or Postman collection!" 