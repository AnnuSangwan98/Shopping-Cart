import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemList = ({ onAddToCart }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [itemImages, setItemImages] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/items');
      setItems(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(['All', ...uniqueCategories]);

      // Fetch images for each item
      await fetchItemImages(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const fetchItemImages = async (itemsList) => {
    const images = {};
    
    // Product-specific image mapping
    const productImages = {
      // Electronics
      'MacBook Pro': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      'iPhone 15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      'Sony WH-1000XM4': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'Samsung Galaxy S24': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
      'iPad Pro': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      'Dell XPS 13': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
      'AirPods Pro': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
      'Nintendo Switch': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop',
      'GoPro Hero 11': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
      'Canon EOS R5': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      
      // Clothing
      'Nike Air Max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      'Levi\'s 501 Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      'Adidas Ultraboost': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop',
      'Ray-Ban Aviator': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
      'Rolex Submariner': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
      'Hermès Birkin': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
      'Gucci Sneakers': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
      'Chanel No. 5': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
      'Prada Bag': 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=300&fit=crop',
      'Supreme Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop',
      'T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      'Dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
      'Jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
      'Sweater': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop',
      'Shorts': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      
      // Home & Garden
      'IKEA Billy Bookcase': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'Philips Hue Bulbs': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
      'Dyson V15': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      'KitchenAid Mixer': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'Nest Thermostat': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'Weber Grill': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'Roomba i7+': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      'Samsung Smart TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
      'Bose Soundbar': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
      'Instant Pot': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'Coffee Maker': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'Blender': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'Toaster': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'Microwave': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'Refrigerator': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      
      // Books
      'The Great Gatsby': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
      'Harry Potter Set': 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=400&h=300&fit=crop',
      '1984 by Orwell': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      'Pride and Prejudice': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
      'The Hobbit': 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=400&h=300&fit=crop',
      'To Kill a Mockingbird': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
      'The Catcher in the Rye': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
      'Lord of the Rings': 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=400&h=300&fit=crop',
      'The Alchemist': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
      'Rich Dad Poor Dad': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
      'Programming Guide': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      
      // Sports
      'Nike Basketball': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Adidas Soccer Cleats': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Wilson Tennis Racket': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      'Callaway Golf Clubs': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      'Yoga Mat': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      'Dumbbells Set': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Bicycle': 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop',
      'Skateboard': 'https://images.unsplash.com/photo-1572776685600-c7d034c8b89f?w=400&h=300&fit=crop',
      'Surfboard': 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop',
      'Treadmill': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Basketball': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Soccer Ball': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Tennis Ball': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      'Golf Ball': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      'Running Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
    };
    
    for (const item of itemsList) {
      try {
        // Check if we have a specific image for this product
        if (productImages[item.name]) {
          images[item.id] = productImages[item.name];
        } else {
          // Fallback: search for category-specific images
          const categoryImages = {
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
            'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
            'Home & Garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            'Books': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
            'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
          };
          images[item.id] = categoryImages[item.category] || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop';
        }
      } catch (error) {
        console.error(`Error fetching image for ${item.name}:`, error);
        // Final fallback
        images[item.id] = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop';
      }
    }
    
    setItemImages(images);
  };

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (category) => {
    const icons = {
      'All': '🛍️',
      'Electronics': '💻',
      'Clothing': '👕',
      'Home & Garden': '🏠',
      'Books': '📚',
      'Sports': '⚽'
    };
    return icons[category] || '🛍️';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'All': 'linear-gradient(135deg, #667eea, #764ba2)',
      'Electronics': 'linear-gradient(135deg, #667eea, #764ba2)',
      'Clothing': 'linear-gradient(135deg, #ed8936, #dd6b20)',
      'Home & Garden': 'linear-gradient(135deg, #48bb78, #38a169)',
      'Books': 'linear-gradient(135deg, #9f7aea, #805ad5)',
      'Sports': 'linear-gradient(135deg, #f56565, #e53e3e)'
    };
    return colors[category] || 'linear-gradient(135deg, #667eea, #764ba2)';
  };

  if (loading) {
    return (
      <div className="loading">
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        Loading amazing products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Categories Section */}
      <div className="categories-section">
        <h2 className="categories-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div
              key={category}
              className="category-card"
              onClick={() => setSelectedCategory(category)}
              style={{
                border: selectedCategory === category ? '3px solid #667eea' : '1px solid rgba(255, 255, 255, 0.2)',
                transform: selectedCategory === category ? 'translateY(-5px)' : 'translateY(0)'
              }}
            >
              <div className="category-title">
                <div 
                  className="category-icon"
                  style={{ background: getCategoryColor(category) }}
                >
                  {getCategoryIcon(category)}
                </div>
                {category}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                {category === 'All' 
                  ? `${items.length} items` 
                  : `${items.filter(item => item.category === category).length} items`
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items Section */}
      <div>
        <h2 className="categories-title">
          {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Products`} ({filteredItems.length} items)
        </h2>
        <div className="items-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-image">
                {itemImages[item.id] ? (
                  <img 
                    src={itemImages[item.id]} 
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '20px 20px 0 0'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    color: 'white',
                    fontWeight: '700'
                  }}>
                    {item.name.charAt(0)}
                  </div>
                )}
                {/* Fallback placeholder */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: itemImages[item.id] ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  color: 'white',
                  fontWeight: '700',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}>
                  {item.name.charAt(0)}
                </div>
              </div>
              <div className="item-details">
                <div className="item-category">{item.category}</div>
                <div className="item-name">{item.name}</div>
                <div className="item-description">{item.description}</div>
                <div className="item-price">${item.price.toFixed(2)}</div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(item.id)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            fontSize: '1.2rem',
            padding: '40px'
          }}>
            No items found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList; 