package db

import (
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type Car struct {
	ID          int      `db:"id"            json:"id"`
	Make        string   `db:"make"          json:"make"`
	Model       string   `db:"model"         json:"model"`
	Year        int      `db:"year"          json:"year"`
	Trim        string   `db:"trim"          json:"trim"`
	Horsepower  int      `db:"horsepower"    json:"horsepower"`
	Torque      int      `db:"torque"        json:"torque"`
	WeightLbs   int      `db:"weight_lbs"    json:"weight_lbs"`
	Drivetrain  string   `db:"drivetrain"    json:"drivetrain"`
	ZeroToSixty float64  `db:"zero_to_sixty" json:"zero_to_sixty"`
	QuarterMile float64  `db:"quarter_mile"  json:"quarter_mile"`
	TrapMph     *float64 `db:"trap_mph"      json:"trap_mph"`
}

func GetMakes(db *sqlx.DB) ([]string, error) {
	var makes []string
	err := db.Select(&makes, `SELECT DISTINCT make FROM cars ORDER BY make`)
	return makes, err
}

func GetModels(db *sqlx.DB, make string) ([]string, error) {
	var models []string
	err := db.Select(&models, `SELECT DISTINCT model FROM cars WHERE make = ? ORDER BY model`, make)
	return models, err
}

func GetYears(db *sqlx.DB, make, model string) ([]int, error) {
	var years []int
	err := db.Select(&years, `SELECT DISTINCT year FROM cars WHERE make = ? AND model = ? ORDER BY year DESC`, make, model)
	return years, err
}

func GetTrims(db *sqlx.DB, make, model string, year int) ([]string, error) {
	var trims []string
	err := db.Select(&trims, `SELECT DISTINCT trim FROM cars WHERE make = ? AND model = ? AND year = ? ORDER BY trim`, make, model, year)
	return trims, err
}

func GetCarByID(db *sqlx.DB, id int) (*Car, error) {
	var car Car
	err := db.Get(&car, `SELECT * FROM cars WHERE id = ?`, id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &car, err
}

type Race struct {
	Slug    string `db:"slug"`
	CarAID  int    `db:"car_a_id"`
	CarBID  int    `db:"car_b_id"`
}

func GetRaceBySlug(db *sqlx.DB, slug string) (*Race, error) {
	var race Race
	err := db.Get(&race, `SELECT slug, car_a_id, car_b_id FROM races WHERE slug = ?`, slug)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &race, err
}

func CreateRace(db *sqlx.DB, slug string, carAID, carBID int) error {
	_, err := db.Exec(
		`INSERT OR IGNORE INTO races (slug, car_a_id, car_b_id) VALUES (?, ?, ?)`,
		slug, carAID, carBID,
	)
	return err
}

func GetCarByMakeModelYearTrim(db *sqlx.DB, make, model string, year int, trim string) (*Car, error) {
	var car Car
	err := db.Get(&car, `SELECT * FROM cars WHERE make = ? AND model = ? AND year = ? AND trim = ?`, make, model, year, trim)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("query car: %w", err)
	}
	return &car, nil
}
