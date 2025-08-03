package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

// Handler structs
type UserHandler struct {
	db *gorm.DB
}

type ItemHandler struct {
	db *gorm.DB
}

type CartHandler struct {
	db *gorm.DB
}

type OrderHandler struct {
	db *gorm.DB
}

// Request/Response structs
type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CreateItemRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required"`
}

type CreateCartRequest struct {
	ItemID uint `json:"item_id" binding:"required"`
}

type CreateOrderRequest struct {
	CartID uint `json:"cart_id" binding:"required"`
}

// JWT Claims
type Claims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// User Handlers
func (h *UserHandler) CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser User
	if err := h.db.Where("username = ?", req.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Generate token
	token := generateToken()

	user := User{
		Username: req.Username,
		Password: string(hashedPassword),
		Token:    token,
	}

	if err := h.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Don't return password
	user.Password = ""
	c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) ListUsers(c *gin.Context) {
	var users []User
	if err := h.db.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	// Don't return passwords
	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := h.db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/password"})
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/password"})
		return
	}

	// Generate new token
	token := generateToken()
	user.Token = token
	h.db.Save(&user)

	// Don't return password
	user.Password = ""

	response := LoginResponse{
		Token: token,
		User:  user,
	}

	c.JSON(http.StatusOK, response)
}

// Item Handlers
func (h *ItemHandler) CreateItem(c *gin.Context) {
	var req CreateItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item := Item{
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
	}

	if err := h.db.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
		return
	}

	c.JSON(http.StatusCreated, item)
}

func (h *ItemHandler) ListItems(c *gin.Context) {
	var items []Item
	if err := h.db.Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}

	c.JSON(http.StatusOK, items)
}

// Cart Handlers
func (h *CartHandler) CreateCart(c *gin.Context) {
	var req CreateCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("user_id")

	// Check if item exists
	var item Item
	if err := h.db.First(&item, req.ItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Get or create cart for user
	var cart Cart
	if err := h.db.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create new cart
			cart = Cart{UserID: userID}
			if err := h.db.Create(&cart).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart"})
			return
		}
	}

	// Check if item already exists in cart
	var existingCartItem CartItem
	if err := h.db.Where("cart_id = ? AND item_id = ?", cart.ID, req.ItemID).First(&existingCartItem).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Item doesn't exist in cart, create new cart item
			cartItem := CartItem{
				CartID:   cart.ID,
				ItemID:   req.ItemID,
				Quantity: 1,
			}

			if err := h.db.Create(&cartItem).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check cart"})
			return
		}
	} else {
		// Item exists, increment quantity
		existingCartItem.Quantity++
		if err := h.db.Save(&existingCartItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
			return
		}
	}

	// Load cart with items
	h.db.Preload("Items.Item").First(&cart, cart.ID)

	c.JSON(http.StatusCreated, cart)
}

func (h *CartHandler) ListCarts(c *gin.Context) {
	userID := c.GetUint("user_id")

	var carts []Cart
	if err := h.db.Where("user_id = ?", userID).Preload("Items.Item").Find(&carts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch carts"})
		return
	}

	c.JSON(http.StatusOK, carts)
}

func (h *CartHandler) RemoveFromCart(c *gin.Context) {
	userID := c.GetUint("user_id")
	itemID := c.Param("item_id")

	// Get user's cart
	var cart Cart
	if err := h.db.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	// Remove the specific item from cart
	if err := h.db.Where("cart_id = ? AND item_id = ?", cart.ID, itemID).Delete(&CartItem{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item from cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed from cart"})
}

// Order Handlers
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("user_id")

	// Get cart
	var cart Cart
	if err := h.db.Where("id = ? AND user_id = ?", req.CartID, userID).Preload("Items.Item").First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if len(cart.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
		return
	}

	// Calculate total
	var total float64
	for _, cartItem := range cart.Items {
		total += cartItem.Item.Price
	}

	// Create order
	order := Order{
		UserID: userID,
		Total:  total,
	}

	if err := h.db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Create order items
	for _, cartItem := range cart.Items {
		orderItem := OrderItem{
			OrderID: order.ID,
			ItemID:  cartItem.ItemID,
			Price:   cartItem.Item.Price,
		}
		h.db.Create(&orderItem)
	}

	// Delete cart and cart items
	h.db.Where("cart_id = ?", cart.ID).Delete(&CartItem{})
	h.db.Delete(&cart)

	// Load order with items
	h.db.Preload("Items.Item").First(&order, order.ID)

	c.JSON(http.StatusCreated, order)
}

func (h *OrderHandler) ListOrders(c *gin.Context) {
	userID := c.GetUint("user_id")

	var orders []Order
	if err := h.db.Where("user_id = ?", userID).Preload("Items.Item").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// Helper functions
func generateToken() string {
	bytes := make([]byte, 32)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func authMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		fmt.Printf("Auth middleware - Authorization header: %s\n", token)
		
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Remove "Bearer " prefix if present
		if len(token) > 7 && token[:7] == "Bearer " {
			token = token[7:]
		}
		
		fmt.Printf("Auth middleware - Token after processing: %s\n", token)

		var user User
		if err := db.Where("token = ?", token).First(&user).Error; err != nil {
			fmt.Printf("Auth middleware - Token not found in database: %s\n", token)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		fmt.Printf("Auth middleware - User found: %d\n", user.ID)
		c.Set("user_id", user.ID)
		c.Next()
	}
} 