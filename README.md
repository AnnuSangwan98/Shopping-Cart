<<<<<<< HEAD
# E-commerce Store

A complete e-commerce solution with Go backend API and React frontend, featuring a modern UI with product images, cart management, and enhanced user experience.

## ✨ Features

- **User Management**: Signup, login, and authentication with secure token-based auth
- **Product Catalog**: Browse items with categories and high-quality product images
- **Shopping Cart**: Add items to cart with quantity management and item removal
- **Order Management**: Place orders and view order history
- **Modern UI**: Responsive React frontend with glass morphism design, gradients, and animations
- **Real-time Updates**: Cart badge showing item count, toast notifications
- **Product Images**: Category-specific product images from Unsplash
- **Enhanced UX**: Loading states, error handling, and smooth animations

## 🛠️ Tech Stack

### Backend
- **Go** with Gin web framework
- **GORM** for database ORM
- **SQLite** for data storage
- **JWT** for authentication
- **Ginkgo** for comprehensive testing
- **bcrypt** for password hashing

### Frontend
- **React** with functional components and hooks
- **Axios** for API communication
- **React Toastify** for notifications
- **Modern CSS** with responsive design, gradients, and animations
- **Unsplash API** for product images

## 📁 Project Structure

```
project/
├── main.go              # Main Go application with sample data
├── models.go            # Database models (User, Item, Cart, Order)
├── handlers.go          # HTTP handlers for all endpoints
├── main_test.go         # Comprehensive Ginkgo test suite
├── go.mod               # Go dependencies
├── frontend/            # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js     # Login form component
│   │   │   ├── ItemList.js  # Items display with images
│   │   │   └── Cart.js      # Cart modal component
│   │   ├── App.js           # Main application component
│   │   ├── index.js
│   │   └── index.css        # Modern styling with gradients
│   └── package.json
├── README.md
├── postman_collection.json
├── setup_instructions.md
└── PROJECT_SUMMARY.md
```

## 🚀 Quick Start

### Prerequisites
- Go 1.21 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. **Install Go dependencies:**
   ```bash
   go mod tidy
   ```

2. **Run the server:**
   ```bash
   go run main.go handlers.go models.go
   ```
   The server will start on `http://localhost:8080`

3. **Run tests:**
   ```bash
   go test
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

3. **Start the development server:**
   ```bash
   npm start
   ```
   The React app will start on `http://localhost:3000`

## 🎯 API Endpoints

### Authentication
- `POST /api/users` - Create a new user
- `GET /api/users` - List all users
- `POST /api/users/login` - User login (returns token)

### Items
- `POST /api/items` - Create a new item
- `GET /api/items` - List all items with categories

### Cart (Requires Authentication)
- `POST /api/carts` - Add item to cart (with quantity management)
- `GET /api/carts` - List user's cart with items
- `DELETE /api/carts/items/:item_id` - Remove item from cart

### Orders (Requires Authentication)
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - List user's orders

## 🎨 User Experience Flow

### 1. User Registration/Login
- **Modern login screen** with glass morphism design
- **Secure authentication** with token-based sessions
- **Error handling** with clear feedback messages
- **Persistent login state** across browser sessions

### 2. Product Browsing
- **Category-based product display** (Electronics, Clothing, Books, Sports, Home & Garden)
- **High-quality product images** from Unsplash
- **Product details** with name, description, price, and category
- **Responsive grid layout** that adapts to screen size

### 3. Shopping Cart Experience
- **Add to cart** with one-click functionality
- **Cart badge** showing real-time item count
- **Cart modal** with detailed item view
- **Quantity management** for cart items
- **Remove items** from cart
- **Cart total calculation** with proper pricing

### 4. Checkout Process
- **Seamless checkout** converting cart to order
- **Order confirmation** with success notifications
- **Order history** accessible via dedicated button
- **Toast notifications** for all user actions

## 🗄️ Database Schema

### Users
- `id` (Primary Key)
- `username` (Unique)
- `password` (Hashed with bcrypt)
- `token` (Unique, for authentication)
- `created_at`, `updated_at`

### Items
- `id` (Primary Key)
- `name`
- `description`
- `price`
- `category` (Electronics, Clothing, Books, Sports, Home & Garden)
- `created_at`, `updated_at`

### Carts
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `created_at`, `updated_at`

### Cart Items
- `id` (Primary Key)
- `cart_id` (Foreign Key)
- `item_id` (Foreign Key)
- `quantity` (Default: 1)

### Orders
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `total` (Calculated from items)
- `created_at`, `updated_at`

### Order Items
- `id` (Primary Key)
- `order_id` (Foreign Key)
- `item_id` (Foreign Key)
- `price` (Snapshot of item price)

## 🧪 Testing

The project includes comprehensive tests using Ginkgo:

```bash
# Run all tests
go test

# Run tests with verbose output
go test -v

# Run specific test suite
go test -ginkgo.focus="User Management"
```

### Test Coverage
- **User Management**: Registration, login, duplicate handling
- **Item Management**: Create and list items with categories
- **Cart Management**: Add, remove, and list cart items
- **Order Management**: Create orders from cart
- **Authentication**: Token validation and middleware

## 🎨 UI/UX Features

### Modern Design
- **Glass morphism** effects with backdrop blur
- **Gradient backgrounds** and button styles
- **Smooth animations** and hover effects
- **Responsive design** for all screen sizes
- **Loading states** and error handling

### Enhanced Functionality
- **Product images** for all items with category-specific photos
- **Cart badge** showing real-time item count
- **Toast notifications** for user feedback
- **Modal dialogs** for cart and order views
- **Quantity management** in shopping cart
- **Remove items** functionality

### User Experience
- **Intuitive navigation** with clear button labels
- **Visual feedback** for all user actions
- **Error recovery** with helpful messages
- **Persistent state** across browser sessions
- **Mobile-friendly** responsive design

## 🔒 Security Features

### Authentication
- **Password Hashing**: bcrypt with salt
- **Token-Based Auth**: Secure token generation
- **Session Management**: Single token per user
- **CORS Protection**: Proper cross-origin handling

### Data Protection
- **Input Validation**: Request validation
- **SQL Injection Protection**: GORM parameterized queries
- **XSS Protection**: Proper content-type headers

## 🚀 Performance & Scalability

### Backend Performance
- **Efficient Queries**: GORM optimized queries
- **Connection Pooling**: Database connection management
- **CORS Optimization**: Minimal overhead

### Frontend Performance
- **Lazy Loading**: Components loaded as needed
- **Optimized Bundles**: React build optimization
- **Caching**: localStorage for auth tokens
- **Image Optimization**: Responsive image loading

## 📦 Sample Data

The application comes with pre-loaded sample data:

### Sample User
- **Username**: `testuser`
- **Password**: `password123`

### Sample Products (25 items across 5 categories)
- **Electronics**: MacBook Pro, iPhone 15, Sony Headphones, etc.
- **Clothing**: Nike Air Max, Levi's Jeans, Ray-Ban Sunglasses, etc.
- **Home & Garden**: Dyson Vacuum, Philips Hue, IKEA Furniture, etc.
- **Books**: The Great Gatsby, Harry Potter Set, Programming Guide, etc.
- **Sports**: Wilson Tennis Racket, Nike Basketball, Yoga Mat, etc.

## 🔧 Development

### Adding New Features

1. **Backend**: Add new models in `models.go`, handlers in `handlers.go`
2. **Frontend**: Create new components in `frontend/src/components/`
3. **Tests**: Add corresponding tests in `main_test.go`

### Database Migrations

The application uses GORM's auto-migration feature. When you add new models or modify existing ones, the database schema will be automatically updated on startup.

## 📦 Deployment

### Backend Deployment
1. Build the Go binary: `go build -o ecommerce-server .`
2. Deploy the binary to your server
3. Set environment variables as needed
4. Run the server

### Frontend Deployment
1. Build the React app: `cd frontend && npm run build`
2. Deploy the `build` folder to your web server
3. Update the API base URL in `App.js` if needed

## 📚 Documentation

### Complete Documentation
- **README.md**: This comprehensive project overview
- **setup_instructions.md**: Step-by-step setup guide
- **postman_collection.json**: API testing collection
- **PROJECT_SUMMARY.md**: Detailed project summary

### API Documentation
All endpoints documented with:
- Request/response formats
- Authentication requirements
- Error handling
- Example usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Project Status

✅ **Complete Backend API** with all specified endpoints  
✅ **Modern React Frontend** with all required screens  
✅ **Authentication System** with secure token management  
✅ **Shopping Cart Functionality** with persistent state  
✅ **Order Management** with checkout process  
✅ **Comprehensive Testing** with Ginkgo test suite  
✅ **Complete Documentation** with setup instructions  
✅ **Postman Collection** for API testing  
✅ **Enhanced UI/UX** with modern design and animations  
✅ **Product Images** with category-specific photos  
✅ **Cart Management** with quantity and removal features  
✅ **Responsive Design** for mobile and desktop  

**This e-commerce solution is production-ready with excellent user experience and comprehensive functionality!** 🚀 
=======
# Shopping-Cart
A full-stack e-commerce prototype built using Go (Gin + GORM + JWT) and React, featuring item listing, cart management, and order placement.
>>>>>>> 18b6cceab96ba16079c023b7237a6d4831ae1dd3
