package db

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strconv"

	"github.com/jmoiron/sqlx"
)

type CarRow struct {
	Make        string
	Model       string
	Year        int
	Trim        string
	Horsepower  int
	Torque      int
	WeightLbs   int
	Drivetrain  string
	ZeroToSixty float64
	QuarterMile float64
	TrapMph     *float64
}

func Migrate(db *sqlx.DB) error {
	_, err := db.Exec(schema)
	return err
}

func SeedFromCSV(db *sqlx.DB, path string) error {
	f, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("open csv: %w", err)
	}
	defer f.Close()

	r := csv.NewReader(f)
	header, err := r.Read()
	if err != nil {
		return fmt.Errorf("read header: %w", err)
	}
	_ = header

	const upsert = `
INSERT INTO cars (make, model, year, trim, horsepower, torque, weight_lbs, drivetrain, zero_to_sixty, quarter_mile, trap_mph)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(make, model, year, trim) DO UPDATE SET
    horsepower    = excluded.horsepower,
    torque        = excluded.torque,
    weight_lbs    = excluded.weight_lbs,
    drivetrain    = excluded.drivetrain,
    zero_to_sixty = excluded.zero_to_sixty,
    quarter_mile  = excluded.quarter_mile,
    trap_mph      = excluded.trap_mph`

	for {
		rec, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return fmt.Errorf("read row: %w", err)
		}
		if len(rec) < 11 {
			return fmt.Errorf("short row: %v", rec)
		}

		car, err := parseRow(rec)
		if err != nil {
			return fmt.Errorf("parse row %v: %w", rec, err)
		}

		if _, err := db.Exec(upsert,
			car.Make, car.Model, car.Year, car.Trim,
			car.Horsepower, car.Torque, car.WeightLbs, car.Drivetrain,
			car.ZeroToSixty, car.QuarterMile, car.TrapMph,
		); err != nil {
			return fmt.Errorf("upsert %s %s %d %s: %w", car.Make, car.Model, car.Year, car.Trim, err)
		}
	}
	return nil
}

func parseRow(rec []string) (CarRow, error) {
	var c CarRow
	c.Make = rec[0]
	c.Model = rec[1]

	year, err := strconv.Atoi(rec[2])
	if err != nil {
		return c, fmt.Errorf("year: %w", err)
	}
	c.Year = year
	c.Trim = rec[3]

	hp, err := strconv.Atoi(rec[4])
	if err != nil {
		return c, fmt.Errorf("horsepower: %w", err)
	}
	c.Horsepower = hp

	tq, err := strconv.Atoi(rec[5])
	if err != nil {
		return c, fmt.Errorf("torque: %w", err)
	}
	c.Torque = tq

	wt, err := strconv.Atoi(rec[6])
	if err != nil {
		return c, fmt.Errorf("weight_lbs: %w", err)
	}
	c.WeightLbs = wt

	c.Drivetrain = rec[7]

	z60, err := strconv.ParseFloat(rec[8], 64)
	if err != nil {
		return c, fmt.Errorf("zero_to_sixty: %w", err)
	}
	c.ZeroToSixty = z60

	qm, err := strconv.ParseFloat(rec[9], 64)
	if err != nil {
		return c, fmt.Errorf("quarter_mile: %w", err)
	}
	c.QuarterMile = qm

	if rec[10] != "" {
		v, err := strconv.ParseFloat(rec[10], 64)
		if err != nil {
			return c, fmt.Errorf("trap_mph: %w", err)
		}
		c.TrapMph = &v
	}

	return c, nil
}
