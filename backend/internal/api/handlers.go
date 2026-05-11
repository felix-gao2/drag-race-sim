package api

import (
	"net/http"
	"strconv"

	"drag-race-sim/internal/db"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type Handler struct {
	DB *sqlx.DB
}

func (h *Handler) GetMakes(c *gin.Context) {
	makes, err := db.GetMakes(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, makes)
}

func (h *Handler) GetModels(c *gin.Context) {
	make := c.Query("make")
	if make == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "make required"})
		return
	}
	models, err := db.GetModels(h.DB, make)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, models)
}

func (h *Handler) GetYears(c *gin.Context) {
	make := c.Query("make")
	model := c.Query("model")
	if make == "" || model == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "make and model required"})
		return
	}
	years, err := db.GetYears(h.DB, make, model)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, years)
}

func (h *Handler) GetTrims(c *gin.Context) {
	make := c.Query("make")
	model := c.Query("model")
	yearStr := c.Query("year")
	if make == "" || model == "" || yearStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "make, model, and year required"})
		return
	}
	year, err := strconv.Atoi(yearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "year must be an integer"})
		return
	}
	trims, err := db.GetTrims(h.DB, make, model, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, trims)
}

func (h *Handler) GetCar(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id must be an integer"})
		return
	}
	car, err := db.GetCarByID(h.DB, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if car == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "car not found"})
		return
	}
	c.JSON(http.StatusOK, car)
}
