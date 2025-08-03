package main

import (
	"log"
	"github.com/jinzhu/gorm"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// Connect to database
	db, err := gorm.Open("sqlite3", "ecommerce.db")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Add quantity column to cart_items table
	err = db.Exec("ALTER TABLE cart_items ADD COLUMN quantity INTEGER DEFAULT 1").Error
	if err != nil {
		log.Println("Column might already exist or error occurred:", err)
	} else {
		log.Println("Successfully added quantity column to cart_items table")
	}

	// Update existing cart items to have quantity 1
	err = db.Exec("UPDATE cart_items SET quantity = 1 WHERE quantity IS NULL").Error
	if err != nil {
		log.Println("Error updating existing cart items:", err)
	} else {
		log.Println("Successfully updated existing cart items with quantity 1")
	}

	log.Println("Migration completed successfully!")
} 