# Setup Instructions

This document provides step-by-step instructions to set up and run the complete e-commerce application.

## Prerequisites

Before starting, ensure you have the following installed:

- **Go** (version 1.21 or higher)
  - Download from: https://golang.org/dl/
  - Verify installation: `go version`

- **Node.js** (version 16 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version` and `npm --version`

## Step 1: Clone and Setup Project

1. **Clone the repository** (if using git):
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Verify project structure**:
   ```
   project/
   ├── main.go
   ├── models.go
   ├── handlers.go
   ├── main_test.go
   ├── go.mod
   ├── frontend/
   │   ├── package.json
   │   ├── public/
   │   └── src/
   ├── README.md
   ├── postman_collection.json
   └── setup_instructions.md
   ```

## Step 2: Backend Setup

1. **Install Go dependencies**:
   ```bash
   go mod tidy
   ```

2. **Run the backend server**:
   ```bash
   go run .
   ```

   You should see output like:
   ```
   Server starting on port 8080
   ```

3. **Verify the server is running**:
   - Open your browser and go to: `http://localhost:8080/api/items`
   - You should see an empty array `[]` (since no items exist yet)

4. **Run tests** (optional):
   ```bash
   go test
   ```

## Step 3: Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

   The React app should automatically open in your browser at `http://localhost:3000`

## Step 4: Testing the Application

### Using the Web Interface

1. **Access the application**:
   - Open your browser and go to `http://localhost:3000`
   - You should see the login screen

2. **Create a test user**:
   - Use the Postman collection or curl to create a user:
   ```bash
   curl -X POST http://localhost:8080/api/users \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   ```

3. **Login to the application**:
   - Enter the username and password you created
   - Click "Login"
   - You should be redirected to the items page

4. **Add some test items** (using curl or Postman):
   ```bash
   curl -X POST http://localhost:8080/api/items \
     -H "Content-Type: application/json" \
     -d '{"name":"Laptop","description":"High-performance laptop","price":999.99}'

   curl -X POST http://localhost:8080/api/items \
     -H "Content-Type: application/json" \
     -d '{"name":"Mouse","description":"Wireless mouse","price":29.99}'

   curl -X POST http://localhost:8080/api/items \
     -H "Content-Type: application/json" \
     -d '{"name":"Keyboard","description":"Mechanical keyboard","price":89.99}'
   ```

5. **Test the shopping flow**:
   - Click "Add to Cart" on any item
   - Click "Cart" to view your cart
   - Click "Checkout" to place an order
   - Click "Order History" to view your orders

### Using Postman

1. **Import the Postman collection**:
   - Open Postman
   - Import the `postman_collection.json` file

2. **Set up environment variables**:
   - Create a new environment in Postman
   - Add variable `base_url` with value `http://localhost:8080`
   - Add variable `auth_token` (leave empty for now)

3. **Test the API flow**:
   - **Create User**: Run "Create User" request
   - **Login**: Run "Login" request and copy the token from response
   - **Set Auth Token**: Update the `auth_token` variable with the token
   - **Create Items**: Run "Create Item" requests to add products
   - **Add to Cart**: Run "Add Item to Cart" request
   - **View Cart**: Run "List Cart" request
   - **Create Order**: Run "Create Order" request
   - **View Orders**: Run "List Orders" request

## Step 5: Database Management

The application uses SQLite for simplicity. The database file `ecommerce.db` will be created automatically when you first run the application.

### Viewing the Database

You can use any SQLite browser to view the database:

1. **Install SQLite browser** (optional):
   - Download from: https://sqlitebrowser.org/

2. **Open the database**:
   - Open SQLite Browser
   - Open the `ecommerce.db` file in your project directory
   - Browse tables: users, items, carts, cart_items, orders, order_items

### Database Schema

The application automatically creates these tables:

- **users**: User accounts with authentication
- **items**: Product catalog
- **carts**: Shopping carts (one per user)
- **cart_items**: Items in carts
- **orders**: Completed orders
- **order_items**: Items in orders

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Backend: Change port in `main.go` or kill the process using port 8080
   - Frontend: React will automatically suggest an alternative port

2. **CORS errors**:
   - The backend includes CORS headers, but if you see CORS errors, ensure the frontend is making requests to the correct backend URL

3. **Database errors**:
   - Delete the `ecommerce.db` file and restart the server to reset the database

4. **Authentication errors**:
   - Ensure you're using the correct token format: `Bearer <token>`
   - Check that the token hasn't expired

5. **Frontend not connecting to backend**:
   - Verify the backend is running on port 8080
   - Check the proxy setting in `frontend/package.json`
   - Ensure CORS is properly configured

### Debug Mode

To run the backend in debug mode:

```bash
# Set Gin to debug mode
export GIN_MODE=debug
go run .
```

To run the frontend with more verbose output:

```bash
cd frontend
npm start
```

## Production Deployment

### Backend Deployment

1. **Build the binary**:
   ```bash
   go build -o ecommerce-server .
   ```

2. **Deploy the binary**:
   - Copy `ecommerce-server` to your server
   - Set environment variables as needed
   - Run: `./ecommerce-server`

### Frontend Deployment

1. **Build the React app**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the build folder**:
   - Copy the `build` folder to your web server
   - Configure your web server to serve the static files

3. **Update API URL**:
   - Update the `axios.defaults.baseURL` in `App.js` to point to your production API

## Support

If you encounter any issues:

1. Check the console logs in both terminal windows
2. Verify all prerequisites are installed correctly
3. Ensure both backend and frontend are running
4. Check the network tab in browser developer tools for API errors

For additional help, refer to the main README.md file or create an issue in the repository. 