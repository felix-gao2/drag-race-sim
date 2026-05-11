package main

import (
	"log"
	"net/http"

	"drag-race-sim/internal/db"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "modernc.org/sqlite"
)

func main() {
	database, err := sqlx.Open("sqlite", "./drag-race.db")
	if err != nil {
		log.Fatalf("failed to open db: %v", err)
	}
	defer database.Close()

	if err := database.Ping(); err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}

	if err := db.Migrate(database); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	if err := db.SeedFromCSV(database, "./data/cars.csv"); err != nil {
		log.Fatalf("seed: %v", err)
	}

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	log.Println("server starting on :8000")
	if err := r.Run(":8000"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
