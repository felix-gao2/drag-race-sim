package sim

import "math"

type CarInput struct {
	ZeroToSixty float64
	QuarterMile float64
}

type Point struct {
	TimeS     float64 `json:"time_s"`
	SpeedAMph float64 `json:"speed_a_mph"`
	SpeedBMph float64 `json:"speed_b_mph"`
	DistAFt   float64 `json:"dist_a_ft"`
	DistBFt   float64 `json:"dist_b_ft"`
}

type Result struct {
	Telemetry []Point
	Winner    string  // "a", "b", or "" for dead heat
	MarginSec float64
}

func Run(a, b CarInput) (Result, error) {
	vTermA, kA, err := fitParams(a.ZeroToSixty, a.QuarterMile)
	if err != nil {
		return Result{}, err
	}
	vTermB, kB, err := fitParams(b.ZeroToSixty, b.QuarterMile)
	if err != nil {
		return Result{}, err
	}

	tFinA := a.QuarterMile
	tFinB := b.QuarterMile
	tMax := math.Max(tFinA, tFinB)

	const dt = 0.05
	var points []Point

	for t := 0.0; t < tMax+dt-1e-9; t += dt {
		ta := math.Min(t, tFinA)
		tb := math.Min(t, tFinB)

		sA := velocity(vTermA, kA, ta) / mph2fps
		sB := velocity(vTermB, kB, tb) / mph2fps
		dA := math.Min(position(vTermA, kA, ta), quarterFt)
		dB := math.Min(position(vTermB, kB, tb), quarterFt)

		points = append(points, Point{
			TimeS:     round3(t),
			SpeedAMph: round2(sA),
			SpeedBMph: round2(sB),
			DistAFt:   round1(dA),
			DistBFt:   round1(dB),
		})
	}

	var winner string
	var margin float64
	switch {
	case tFinA < tFinB-0.05:
		winner, margin = "a", tFinB-tFinA
	case tFinB < tFinA-0.05:
		winner, margin = "b", tFinA-tFinB
	}

	return Result{Telemetry: points, Winner: winner, MarginSec: round3(margin)}, nil
}

func round1(v float64) float64 { return math.Round(v*10) / 10 }
func round2(v float64) float64 { return math.Round(v*100) / 100 }
func round3(v float64) float64 { return math.Round(v*1000) / 1000 }
