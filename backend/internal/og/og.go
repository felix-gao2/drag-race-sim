package og

import (
	"bytes"
	"image"
	"image/color"
	"image/png"
)

const (
	Width  = 1200
	Height = 630
)

// Placeholder returns a 1200×630 dark PNG.
// Phase 2 replaces this with a rendered template including car names and times.
func Placeholder() ([]byte, error) {
	img := image.NewRGBA(image.Rect(0, 0, Width, Height))

	for y := 0; y < Height; y++ {
		t := float64(y) / float64(Height)
		r := uint8(10 + uint8(t*8))
		g := uint8(10 + uint8(t*8))
		b := uint8(20 + uint8(t*15))
		c := color.RGBA{R: r, G: g, B: b, A: 255}
		for x := 0; x < Width; x++ {
			img.SetRGBA(x, y, c)
		}
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
