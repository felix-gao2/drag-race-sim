package sim

import (
	"fmt"
	"math"
)

const (
	mph2fps   = 5280.0 / 3600.0
	quarterFt = 1320.0
	speed60   = 60 * mph2fps // ft/s
)

// velocity returns ft/s at time t for the two-parameter exponential model.
func velocity(vTerm, k, t float64) float64 {
	return vTerm * (1 - math.Exp(-k*t))
}

// position returns feet traveled at time t.
func position(vTerm, k, t float64) float64 {
	return vTerm * (t + (math.Exp(-k*t)-1)/k)
}

// fitParams solves for vTerm (ft/s) and k given 0-60 time and quarter-mile time (both seconds).
// Uses bisection on k; vTerm is derived analytically from k.
func fitParams(t60, tQuarter float64) (vTerm, k float64, err error) {
	f := func(k float64) float64 {
		vt := speed60 / (1 - math.Exp(-k*t60))
		return position(vt, k, tQuarter) - quarterFt
	}

	lo, hi := 1e-4, 200.0
	fLo, fHi := f(lo), f(hi)

	if fLo*fHi > 0 {
		return 0, 0, fmt.Errorf("bisection failed: f(%g)=%g f(%g)=%g (t60=%g tQ=%g)", lo, fLo, hi, fHi, t60, tQuarter)
	}

	for range 100 {
		mid := (lo + hi) / 2
		fMid := f(mid)
		if math.Abs(fMid) < 1e-4 {
			k = mid
			break
		}
		if fLo*fMid < 0 {
			hi, fHi = mid, fMid
		} else {
			lo, fLo = mid, fMid
		}
		k = mid
	}

	vTerm = speed60 / (1 - math.Exp(-k*t60))
	return vTerm, k, nil
}
