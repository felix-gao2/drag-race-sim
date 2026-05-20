package main

import (
	"log"
	"net/http"

	"drag-race-sim/internal/api"
	"drag-race-sim/internal/db"

	"github.com/gin-contrib/cors"
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

	h := &api.Handler{DB: database}

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST"},
		AllowHeaders: []string{"Content-Type"},
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api")
	{
		v1.GET("/makes", h.GetMakes)
		v1.GET("/models", h.GetModels)
		v1.GET("/years", h.GetYears)
		v1.GET("/trims", h.GetTrims)
		v1.GET("/cars/:id", h.GetCar)
		v1.POST("/races", h.PostRace)
		v1.GET("/races/:slug", h.GetRace)
		v1.GET("/og/:slug", h.GetOGImage)
	}

	log.Println("server starting on :8000")
	if err := r.Run(":8000"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
