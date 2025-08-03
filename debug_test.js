const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

async function testAuth() {
  try {
    console.log('=== Testing Authentication ===');
    
    // Step 1: Login
    console.log('1. Attempting login...');
    const loginResponse = await axios.post(`${API_BASE}/users/login`, {
      username: 'testuser',
      password: 'password123'
    });
    
    console.log('Login successful!');
    console.log('User:', loginResponse.data.user);
    console.log('Token:', loginResponse.data.token);
    
    const token = loginResponse.data.token;
    
    // Step 2: Test adding item to cart
    console.log('\n2. Testing add to cart...');
    const cartResponse = await axios.post(`${API_BASE}/carts`, 
      { item_id: 2 }, // Phone item
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log('Cart response:', cartResponse.data);
    console.log('✅ Add to cart successful!');
    
    // Step 3: Test getting cart
    console.log('\n3. Testing get cart...');
    const getCartResponse = await axios.get(`${API_BASE}/carts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Cart items:', getCartResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testAuth(); 