package main

import (
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Remove existing database file
	os.Remove("ecommerce.db")

	// Initialize database
	db, err := gorm.Open("sqlite3", "ecommerce.db")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Auto migrate the schema
	db.AutoMigrate(&User{}, &Item{}, &Cart{}, &CartItem{}, &Order{}, &OrderItem{})

	// Create sample user
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	sampleUser := User{
		Username: "testuser",
		Password: string(hashedPassword),
		Token:    "sample-token-123",
	}
	db.Create(&sampleUser)

	// Create sample items with categories
	sampleItems := []Item{
		// Electronics
		{Name: "MacBook Pro", Description: "High-performance laptop with M2 chip", Price: 1299.99, Category: "Electronics"},
		{Name: "iPhone 15", Description: "Latest smartphone with advanced camera", Price: 899.99, Category: "Electronics"},
		{Name: "Sony WH-1000XM4", Description: "Premium noise-canceling headphones", Price: 349.99, Category: "Electronics"},
		{Name: "iPad Air", Description: "Lightweight tablet for productivity", Price: 599.99, Category: "Electronics"},
		{Name: "Apple Watch", Description: "Smartwatch with health tracking", Price: 399.99, Category: "Electronics"},
		
		// Clothing
		{Name: "Nike Air Max", Description: "Comfortable running shoes", Price: 129.99, Category: "Clothing"},
		{Name: "Levi's Jeans", Description: "Classic blue denim jeans", Price: 79.99, Category: "Clothing"},
		{Name: "Adidas Hoodie", Description: "Warm and stylish hoodie", Price: 59.99, Category: "Clothing"},
		{Name: "Ray-Ban Aviator", Description: "Classic sunglasses", Price: 159.99, Category: "Clothing"},
		{Name: "Rolex Submariner", Description: "Luxury diving watch", Price: 8999.99, Category: "Clothing"},
		
		// Home & Garden
		{Name: "Dyson V15", Description: "Cordless vacuum cleaner", Price: 699.99, Category: "Home & Garden"},
		{Name: "Philips Hue", Description: "Smart LED light bulbs", Price: 199.99, Category: "Home & Garden"},
		{Name: "IKEA Furniture", Description: "Modern living room set", Price: 899.99, Category: "Home & Garden"},
		{Name: "KitchenAid Mixer", Description: "Professional stand mixer", Price: 399.99, Category: "Home & Garden"},
		{Name: "Nest Thermostat", Description: "Smart home temperature control", Price: 249.99, Category: "Home & Garden"},
		
		// Books
		{Name: "The Great Gatsby", Description: "Classic American novel", Price: 12.99, Category: "Books"},
		{Name: "Harry Potter Set", Description: "Complete 7-book collection", Price: 89.99, Category: "Books"},
		{Name: "Programming Guide", Description: "Learn coding from scratch", Price: 49.99, Category: "Books"},
		{Name: "Cookbook Collection", Description: "1000+ recipes", Price: 34.99, Category: "Books"},
		{Name: "Business Strategy", Description: "Modern business insights", Price: 24.99, Category: "Books"},
		
		// Sports
		{Name: "Wilson Tennis Racket", Description: "Professional tennis equipment", Price: 199.99, Category: "Sports"},
		{Name: "Nike Basketball", Description: "Official size basketball", Price: 29.99, Category: "Sports"},
		{Name: "Yoga Mat", Description: "Premium non-slip yoga mat", Price: 39.99, Category: "Sports"},
		{Name: "Gym Equipment", Description: "Complete home gym set", Price: 599.99, Category: "Sports"},
		{Name: "Bicycle", Description: "Mountain bike for adventure", Price: 799.99, Category: "Sports"},
	}
	
	for _, item := range sampleItems {
		db.Create(&item)
	}

	log.Println("Database reset successfully! Created 25 items with categories.")
	log.Println("Now restart the main application: go run main.go models.go handlers.go")
} 