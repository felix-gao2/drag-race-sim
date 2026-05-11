package api

import (
	"fmt"
	"regexp"
	"sort"
	"strings"

	"drag-race-sim/internal/db"
)

var nonAlphanumDash = regexp.MustCompile(`[^a-z0-9]+`)

func carSlugPart(car *db.Car) string {
	raw := fmt.Sprintf("%d %s %s %s", car.Year, car.Make, car.Model, car.Trim)
	lower := strings.ToLower(raw)
	slug := nonAlphanumDash.ReplaceAllString(lower, "-")
	return strings.Trim(slug, "-")
}

func buildRaceSlug(carA, carB *db.Car) string {
	partA := carSlugPart(carA)
	partB := carSlugPart(carB)
	parts := []string{partA, partB}
	sort.Strings(parts)
	return parts[0] + "-vs-" + parts[1]
}
