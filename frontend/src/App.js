import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Login from './components/Login';
import ItemList from './components/ItemList';
import Cart from './components/Cart';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8080/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axios.get('/carts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.length > 0) {
        const totalItems = response.data[0].items.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalItems);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItemCount(0);
    }
  }, [token]);

  useEffect(() => {
    // Check if user is logged in on app start
    if (token) {
      setIsLoggedIn(true);
      fetchCartCount();
    }
  }, [token, fetchCartCount]);

  const handleLogin = (userData, userToken) => {
    console.log('Login successful:', userData);
    console.log('Token received:', userToken);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    setIsLoggedIn(true);
    toast.success('Login successful!');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCartItemCount(0);
    toast.info('Logged out successfully');
  };

  const handleAddToCart = async (itemId) => {
    try {
      console.log('Adding item to cart:', itemId);
      console.log('Token:', token);
      
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await axios.post('/carts', 
        { item_id: itemId },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      console.log('Cart response:', response.data);
      toast.success('Item added to cart!');
      fetchCartCount(); // Update cart count
    } catch (error) {
      console.error('Error adding item to cart:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to add item to cart');
    }
  };

  const handleCheckout = async () => {
    try {
      // First get the user's cart
      const cartResponse = await axios.get('/carts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (cartResponse.data.length === 0) {
        toast.error('Your cart is empty!');
        return;
      }

      const cart = cartResponse.data[0]; // Get the first cart

      // Create order from cart
      await axios.post('/orders', 
        { cart_id: cart.id },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      toast.success('Order placed successfully!');
      setCartItemCount(0); // Reset cart count
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
    }
  };

  const handleViewOrders = async () => {
    try {
      const response = await axios.get('/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.length === 0) {
        toast.info('No orders found');
        return;
      }

      const orderIds = response.data.map(order => `Order ID: ${order.id}`).join('\n');
      alert(`Your Orders:\n${orderIds}`);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    fetchCartCount(); // Refresh cart count when closing
  };

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <header className="header">
            <div className="container">
              <div className="header-content">
                <h1>E-commerce Store</h1>
                <div className="buttons-container">
                  <button className="btn btn-cart" onClick={openCart}>
                    🛒 Cart
                    {cartItemCount > 0 && (
                      <span className="cart-badge">{cartItemCount}</span>
                    )}
                  </button>
                  <button className="btn btn-secondary" onClick={handleViewOrders}>
                    📋 Order History
                  </button>
                  <button className="btn btn-success" onClick={handleCheckout}>
                    💳 Checkout
                  </button>
                  <button className="btn btn-primary" onClick={handleLogout}>
                    👋 Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="container">
            <ItemList onAddToCart={handleAddToCart} />
          </div>

          <Cart 
            isOpen={isCartOpen} 
            onClose={closeCart} 
            token={token}
          />
        </div>
      )}
    </div>
  );
}

export default App; 