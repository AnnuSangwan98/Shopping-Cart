import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Cart = ({ isOpen, onClose, token }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Product-specific image mapping for cart items
  const getProductImage = (productName) => {
    const productImages = {
      'MacBook Pro': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=72&h=72&fit=crop',
      'iPhone 15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=72&h=72&fit=crop',
      'Sony WH-1000XM4': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=72&h=72&fit=crop',
      'Samsung Galaxy S24': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=72&h=72&fit=crop',
      'iPad Pro': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=72&h=72&fit=crop',
      'Dell XPS 13': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=72&h=72&fit=crop',
      'AirPods Pro': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=72&h=72&fit=crop',
      'Nintendo Switch': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=72&h=72&fit=crop',
      'GoPro Hero 11': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=72&h=72&fit=crop',
      'Canon EOS R5': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=72&h=72&fit=crop',
      'Nike Air Max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=72&h=72&fit=crop',
      'Levi\'s 501 Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=72&h=72&fit=crop',
      'Adidas Ultraboost': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=72&h=72&fit=crop',
      'Ray-Ban Aviator': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=72&h=72&fit=crop',
      'Rolex Submariner': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=72&h=72&fit=crop',
      'Hermès Birkin': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=72&h=72&fit=crop',
      'Gucci Sneakers': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=72&h=72&fit=crop',
      'Chanel No. 5': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=72&h=72&fit=crop',
      'Prada Bag': 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=72&h=72&fit=crop',
      'Supreme Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=72&h=72&fit=crop',
      'IKEA Billy Bookcase': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=72&h=72&fit=crop',
      'Philips Hue Bulbs': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=72&h=72&fit=crop',
      'Dyson V15': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=72&h=72&fit=crop',
      'KitchenAid Mixer': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=72&h=72&fit=crop',
      'Nest Thermostat': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=72&h=72&fit=crop',
      'Weber Grill': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=72&h=72&fit=crop',
      'Roomba i7+': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=72&h=72&fit=crop',
      'Samsung Smart TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=72&h=72&fit=crop',
      'Bose Soundbar': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=72&h=72&fit=crop',
      'Instant Pot': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=72&h=72&fit=crop',
      'The Great Gatsby': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=72&h=72&fit=crop',
      'Harry Potter Set': 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=72&h=72&fit=crop',
      '1984 by Orwell': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=72&h=72&fit=crop',
      'Pride and Prejudice': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=72&h=72&fit=crop',
      'The Hobbit': 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=72&h=72&fit=crop',
      'To Kill a Mockingbird': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=72&h=72&fit=crop',
      'The Catcher in the Rye': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=72&h=72&fit=crop',
      'Lord of the Rings': 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=72&h=72&fit=crop',
      'The Alchemist': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=72&h=72&fit=crop',
      'Rich Dad Poor Dad': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=72&h=72&fit=crop',
      'Programming Guide': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=72&h=72&fit=crop',
      'Nike Basketball': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=72&h=72&fit=crop',
      'Adidas Soccer Cleats': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=72&h=72&fit=crop',
      'Wilson Tennis Racket': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=72&h=72&fit=crop',
      'Callaway Golf Clubs': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=72&h=72&fit=crop',
      'Yoga Mat': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=72&h=72&fit=crop',
      'Dumbbells Set': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=72&h=72&fit=crop',
      'Bicycle': 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=72&h=72&fit=crop',
      'Skateboard': 'https://images.unsplash.com/photo-1572776685600-c7d034c8b89f?w=72&h=72&fit=crop',
      'Surfboard': 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=72&h=72&fit=crop',
      'Treadmill': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=72&h=72&fit=crop'
    };
    
    return productImages[productName] || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=72&h=72&fit=crop';
  };

  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/carts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.length > 0) {
        setCartItems(response.data[0].items || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen, token, fetchCartItems]);

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`/carts/items/${itemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = item.quantity || 1;
      const price = item.item?.price || 0;
      return total + (price * quantity);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 Your Cart</h2>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {loading ? (
            <div className="cart-loading">
              <div className="loading-spinner"></div>
              <p>Loading your cart...</p>
            </div>
          ) : error ? (
            <div className="cart-error">
              <p>❌ {error}</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-cart-icon">🛍️</div>
              <h3>Your cart is empty</h3>
              <p>Add some amazing products to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((cartItem) => (
                                     <div key={cartItem.id} className="cart-item">
                     <div className="cart-item-image">
                                               <img 
                          src={getProductImage(cartItem.item.name)}
                          alt={cartItem.item.name}
                         style={{
                           width: '100%',
                           height: '100%',
                           objectFit: 'cover',
                           borderRadius: '16px'
                         }}
                         onError={(e) => {
                           e.target.style.display = 'none';
                           e.target.nextSibling.style.display = 'flex';
                         }}
                       />
                       <div style={{
                         width: '100%',
                         height: '100%',
                         background: 'linear-gradient(135deg, #667eea, #764ba2)',
                         display: 'none',
                         alignItems: 'center',
                         justifyContent: 'center',
                         fontSize: '1.8rem',
                         color: 'white',
                         fontWeight: '700',
                         borderRadius: '16px',
                         position: 'absolute',
                         top: 0,
                         left: 0
                       }}>
                         {cartItem.item.name.charAt(0)}
                       </div>
                     </div>
                    <div className="cart-item-details">
                      <h4>{cartItem.item.name}</h4>
                      <p className="cart-item-category">{cartItem.item.category}</p>
                      <p className="cart-item-price">${cartItem.item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <span className="cart-item-quantity">Qty: {cartItem.quantity || 1}</span>
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeFromCart(cartItem.item_id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                </div>
                <button className="checkout-btn">
                  💳 Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart; 