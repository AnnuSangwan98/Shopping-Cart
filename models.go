package main

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Password  string    `json:"password" gorm:"not null"`
	Token     string    `json:"token" gorm:"unique"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Item represents a product in the store
type Item struct {
	ID          uint      `json:"id" gorm:"primary_key"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Price       float64   `json:"price" gorm:"not null"`
	Category    string    `json:"category" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Cart represents a user's shopping cart
type Cart struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	User      User      `json:"user" gorm:"foreignkey:UserID"`
	Items     []CartItem `json:"items" gorm:"foreignkey:CartID"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CartItem represents an item in a cart
type CartItem struct {
	ID       uint  `json:"id" gorm:"primary_key"`
	CartID   uint  `json:"cart_id" gorm:"not null"`
	ItemID   uint  `json:"item_id" gorm:"not null"`
	Quantity uint  `json:"quantity" gorm:"default:1"`
	Item     Item  `json:"item" gorm:"foreignkey:ItemID"`
}

// Order represents a completed order
type Order struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	User      User      `json:"user" gorm:"foreignkey:UserID"`
	Items     []OrderItem `json:"items" gorm:"foreignkey:OrderID"`
	Total     float64   `json:"total"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	ID      uint  `json:"id" gorm:"primary_key"`
	OrderID uint  `json:"order_id" gorm:"not null"`
	ItemID  uint  `json:"item_id" gorm:"not null"`
	Item    Item  `json:"item" gorm:"foreignkey:ItemID"`
	Price   float64 `json:"price"`
} 