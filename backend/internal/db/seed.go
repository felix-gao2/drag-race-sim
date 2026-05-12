package db

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strconv"

	"github.com/jmoiron/sqlx"
)

func Migrate(db *sqlx.DB) error {
	_, err := db.Exec(schema)
	return err
}

// SeedFromCSV reads the CSV (columns: make,model,trim,year_start,year_end,horsepower,torque,
// weight_lbs,drivetrain,zero_to_sixty,quarter_mile,trap_mph) and upserts one row per year
// in the year_start..year_end range so the cascade dropdowns can filter by exact year.
func SeedFromCSV(db *sqlx.DB, path string) error {
	f, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("open csv: %w", err)
	}
	defer f.Close()

	r := csv.NewReader(f)
	if _, err := r.Read(); err != nil { // skip header
		return fmt.Errorf("read header: %w", err)
	}

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
		if len(rec) < 12 {
			return fmt.Errorf("short row (need 12 cols): %v", rec)
		}

		make_ := rec[0]
		model := rec[1]
		trim := rec[2]

		yearStart, err := strconv.Atoi(rec[3])
		if err != nil {
			return fmt.Errorf("year_start %q: %w", rec[3], err)
		}
		yearEnd, err := strconv.Atoi(rec[4])
		if err != nil {
			return fmt.Errorf("year_end %q: %w", rec[4], err)
		}

		hp, err := strconv.Atoi(rec[5])
		if err != nil {
			return fmt.Errorf("horsepower %q: %w", rec[5], err)
		}

		var tq int
		if rec[6] != "" {
			tq, err = strconv.Atoi(rec[6])
			if err != nil {
				return fmt.Errorf("torque %q: %w", rec[6], err)
			}
		}

		wt, err := strconv.Atoi(rec[7])
		if err != nil {
			return fmt.Errorf("weight_lbs %q: %w", rec[7], err)
		}

		drivetrain := rec[8]

		var z60 float64
		if rec[9] != "" {
			z60, err = strconv.ParseFloat(rec[9], 64)
			if err != nil {
				return fmt.Errorf("zero_to_sixty %q: %w", rec[9], err)
			}
		}

		qm, err := strconv.ParseFloat(rec[10], 64)
		if err != nil {
			return fmt.Errorf("quarter_mile %q: %w", rec[10], err)
		}

		var trapMph *float64
		if rec[11] != "" {
			v, err := strconv.ParseFloat(rec[11], 64)
			if err != nil {
				return fmt.Errorf("trap_mph %q: %w", rec[11], err)
			}
			trapMph = &v
		}

		for year := yearStart; year <= yearEnd; year++ {
			if _, err := db.Exec(upsert,
				make_, model, year, trim,
				hp, tq, wt, drivetrain,
				z60, qm, trapMph,
			); err != nil {
				return fmt.Errorf("upsert %s %s %d %s: %w", make_, model, year, trim, err)
			}
		}
	}
	return nil
}
