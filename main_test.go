package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/mattn/go-sqlite3"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestEcommerceAPI(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Ecommerce API Suite")
}

var _ = Describe("Ecommerce API", func() {
	var (
		router *gin.Engine
		db     *gorm.DB
	)

	BeforeEach(func() {
		// Set Gin to test mode
		gin.SetMode(gin.TestMode)

		// Initialize test database
		var err error
		db, err = gorm.Open("sqlite3", ":memory:")
		Expect(err).NotTo(HaveOccurred())

		// Auto migrate the schema
		db.AutoMigrate(&User{}, &Item{}, &Cart{}, &Order{})

		// Initialize router
		router = gin.New()
		router.Use(func(c *gin.Context) {
			c.Header("Access-Control-Allow-Origin", "*")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
			
			if c.Request.Method == "OPTIONS" {
				c.AbortWithStatus(204)
				return
			}
			
			c.Next()
		})

		// Initialize handlers
		userHandler := &UserHandler{db: db}
		itemHandler := &ItemHandler{db: db}
		cartHandler := &CartHandler{db: db}
		orderHandler := &OrderHandler{db: db}

		// Routes
		api := router.Group("/api")
		{
			api.POST("/users", userHandler.CreateUser)
			api.GET("/users", userHandler.ListUsers)
			api.POST("/users/login", userHandler.Login)
			api.POST("/items", itemHandler.CreateItem)
			api.GET("/items", itemHandler.ListItems)
			api.POST("/carts", authMiddleware(db), cartHandler.CreateCart)
			api.GET("/carts", authMiddleware(db), cartHandler.ListCarts)
			api.POST("/orders", authMiddleware(db), orderHandler.CreateOrder)
			api.GET("/orders", authMiddleware(db), orderHandler.ListOrders)
		}
	})

	AfterEach(func() {
		db.Close()
	})

	Describe("User Management", func() {
		It("should create a new user", func() {
			userData := CreateUserRequest{
				Username: "testuser",
				Password: "password123",
			}

			jsonData, _ := json.Marshal(userData)
			req := httptest.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusCreated))

			var response User
			json.Unmarshal(w.Body.Bytes(), &response)
			Expect(response.Username).To(Equal("testuser"))
			Expect(response.Password).To(Equal(""))
			Expect(response.Token).NotTo(BeEmpty())
		})

		It("should not create user with duplicate username", func() {
			userData := CreateUserRequest{
				Username: "testuser",
				Password: "password123",
			}

			jsonData, _ := json.Marshal(userData)
			req := httptest.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			// Create same user again
			w2 := httptest.NewRecorder()
			router.ServeHTTP(w2, req)

			Expect(w2.Code).To(Equal(http.StatusConflict))
		})

		It("should login user successfully", func() {
			// Create user first
			userData := CreateUserRequest{
				Username: "testuser",
				Password: "password123",
			}

			jsonData, _ := json.Marshal(userData)
			req := httptest.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			// Login
			loginData := LoginRequest{
				Username: "testuser",
				Password: "password123",
			}

			loginJson, _ := json.Marshal(loginData)
			loginReq := httptest.NewRequest("POST", "/api/users/login", bytes.NewBuffer(loginJson))
			loginReq.Header.Set("Content-Type", "application/json")

			w2 := httptest.NewRecorder()
			router.ServeHTTP(w2, loginReq)

			Expect(w2.Code).To(Equal(http.StatusOK))

			var response LoginResponse
			json.Unmarshal(w2.Body.Bytes(), &response)
			Expect(response.Token).NotTo(BeEmpty())
			Expect(response.User.Username).To(Equal("testuser"))
		})

		It("should fail login with wrong password", func() {
			// Create user first
			userData := CreateUserRequest{
				Username: "testuser",
				Password: "password123",
			}

			jsonData, _ := json.Marshal(userData)
			req := httptest.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			// Login with wrong password
			loginData := LoginRequest{
				Username: "testuser",
				Password: "wrongpassword",
			}

			loginJson, _ := json.Marshal(loginData)
			loginReq := httptest.NewRequest("POST", "/api/users/login", bytes.NewBuffer(loginJson))
			loginReq.Header.Set("Content-Type", "application/json")

			w2 := httptest.NewRecorder()
			router.ServeHTTP(w2, loginReq)

			Expect(w2.Code).To(Equal(http.StatusUnauthorized))
		})
	})

	Describe("Item Management", func() {
		It("should create an item", func() {
			itemData := CreateItemRequest{
				Name:        "Test Item",
				Description: "A test item",
				Price:       29.99,
			}

			jsonData, _ := json.Marshal(itemData)
			req := httptest.NewRequest("POST", "/api/items", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusCreated))

			var response Item
			json.Unmarshal(w.Body.Bytes(), &response)
			Expect(response.Name).To(Equal("Test Item"))
			Expect(response.Price).To(Equal(29.99))
		})

		It("should list all items", func() {
			// Create some items first
			items := []CreateItemRequest{
				{Name: "Item 1", Description: "First item", Price: 10.0},
				{Name: "Item 2", Description: "Second item", Price: 20.0},
			}

			for _, item := range items {
				jsonData, _ := json.Marshal(item)
				req := httptest.NewRequest("POST", "/api/items", bytes.NewBuffer(jsonData))
				req.Header.Set("Content-Type", "application/json")

				w := httptest.NewRecorder()
				router.ServeHTTP(w, req)
			}

			// List items
			req := httptest.NewRequest("GET", "/api/items", nil)
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			Expect(w.Code).To(Equal(http.StatusOK))

			var response []Item
			json.Unmarshal(w.Body.Bytes(), &response)
			Expect(len(response)).To(Equal(2))
		})
	})

	Describe("Cart Management", func() {
		var token string

		BeforeEach(func() {
			// Create user and login
			userData := CreateUserRequest{
				Username: "testuser",
				Password: "password123",
			}

			jsonData, _ := json.Marshal(userData)
			req := httptest.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			var user User
			json.Unmarshal(w.Body.Bytes(), &user)
			token = user.Token
		})

		It("should add item to cart", func() {
			// Create an item first
			itemData := CreateItemRequest{
				Name:  "Test Item",
				Price: 29.99,
			}

			jsonData, _ := json.Marshal(itemData)
			req := httptest.NewRequest("POST", "/api/items", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			var item Item
			json.Unmarshal(w.Body.Bytes(), &item)

			// Add item to cart
			cartData := CreateCartRequest{
				ItemID: item.ID,
			}

			cartJson, _ := json.Marshal(cartData)
			cartReq := httptest.NewRequest("POST", "/api/carts", bytes.NewBuffer(cartJson))
			cartReq.Header.Set("Content-Type", "application/json")
			cartReq.Header.Set("Authorization", "Bearer "+token)

			w2 := httptest.NewRecorder()
			router.ServeHTTP(w2, cartReq)

			Expect(w2.Code).To(Equal(http.StatusCreated))

			var cart Cart
			json.Unmarshal(w2.Body.Bytes(), &cart)
			Expect(len(cart.Items)).To(Equal(1))
			Expect(cart.Items[0].ItemID).To(Equal(item.ID))
		})
	})

	Describe("Order Management", func() {
		var token string
		var itemID uint

		BeforeEach(func() {
			// Create user and login
			userData := CreateUserRequest{
				Username: "testuser",
				Password: "password123",
			}

			jsonData, _ := json.Marshal(userData)
			req := httptest.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			var user User
			json.Unmarshal(w.Body.Bytes(), &user)
			token = user.Token

			// Create an item
			itemData := CreateItemRequest{
				Name:  "Test Item",
				Price: 29.99,
			}

			jsonData, _ = json.Marshal(itemData)
			req = httptest.NewRequest("POST", "/api/items", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w = httptest.NewRecorder()
			router.ServeHTTP(w, req)

			var item Item
			json.Unmarshal(w.Body.Bytes(), &item)
			itemID = item.ID
		})

		It("should create order from cart", func() {
			// Add item to cart
			cartData := CreateCartRequest{
				ItemID: itemID,
			}

			cartJson, _ := json.Marshal(cartData)
			cartReq := httptest.NewRequest("POST", "/api/carts", bytes.NewBuffer(cartJson))
			cartReq.Header.Set("Content-Type", "application/json")
			cartReq.Header.Set("Authorization", "Bearer "+token)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, cartReq)

			var cart Cart
			json.Unmarshal(w.Body.Bytes(), &cart)

			// Create order
			orderData := CreateOrderRequest{
				CartID: cart.ID,
			}

			orderJson, _ := json.Marshal(orderData)
			orderReq := httptest.NewRequest("POST", "/api/orders", bytes.NewBuffer(orderJson))
			orderReq.Header.Set("Content-Type", "application/json")
			orderReq.Header.Set("Authorization", "Bearer "+token)

			w2 := httptest.NewRecorder()
			router.ServeHTTP(w2, orderReq)

			Expect(w2.Code).To(Equal(http.StatusCreated))

			var order Order
			json.Unmarshal(w2.Body.Bytes(), &order)
			Expect(order.Total).To(Equal(29.99))
			Expect(len(order.Items)).To(Equal(1))
		})
	})
}) 