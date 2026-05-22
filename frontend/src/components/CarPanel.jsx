import { useState, useEffect } from 'react'
import { getCar } from '../api'
import Cascade from './Cascade'

const ACCENT  = { a: '#dc2626', b: '#3b82f6' }
const LABEL   = { a: 'CAR A',   b: 'CAR B'   }
const MONO    = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`

function fmt(n, decimals = 0) {
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: decimals })
}

function StatBox({ label, value }) {
  return (
    <div style={{
      border: '1px solid #1f1f1f',
      padding: '10px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#525252',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: MONO,
        fontSize: 13,
        color: '#a3a3a3',
        lineHeight: 1.2,
      }}>
        {value}
      </span>
    </div>
  )
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 260 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '72%', height: 'auto', opacity: 0.06, transform: 'scaleX(-1)', display: 'block' }}
      aria-hidden="true"
    >
      <polygon points="5,58 66,54 66,63 5,67" fill="#ffffff" />
      <path d="M 22,60 L 30,46 L 40,36 L 68,30 L 88,26 L 104,22 L 120,19 L 138,22 L 162,26 L 198,30 L 224,34 L 238,42 L 240,60 Z" fill="#ffffff" />
      <rect x="228" y="20" width="5" height="14" fill="#ffffff" />
      <rect x="214" y="16" width="34" height="6"  fill="#ffffff" />
      <circle cx="66"  cy="62" r="10" fill="#ffffff" />
      <circle cx="210" cy="62" r="12" fill="#ffffff" />
    </svg>
  )
}

export default function CarPanel({ side, onCarChange }) {
  const accent = ACCENT[side]
  const [carId, setCarId]   = useState(null)
  const [car, setCar]       = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!carId) { setCar(null); onCarChange(null); return }
    setLoading(true)
    getCar(carId)
      .then(data => { setCar(data); onCarChange(data) })
      .catch(() => { setCar(null); onCarChange(null) })
      .finally(() => setLoading(false))
  }, [carId])

  const isSelected = !loading && car !== null

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      borderLeft:   '1px solid #1f1f1f',
      borderRight:  '1px solid #1f1f1f',
      borderBottom: '1px solid #1f1f1f',
      borderTop:    `2px solid ${accent}`,
      background: 'rgba(255,255,255,0.015)',
      padding: 32,
      gap: 24,
      boxSizing: 'border-box',
      minHeight: 0,
      overflow: 'hidden',
    }}>

      {/* ── Left 40% — empty state or car hero ── */}
      <div style={{
        width: '40%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid #1a1a1a',
        paddingRight: 24,
        minHeight: 0,
      }}>
        {isSelected ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(1.3rem, 2.2vw, 2.6rem)',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: accent,
              lineHeight: 0.9,
              margin: 0,
            }}>
              {car.make}
            </p>
            <p style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(0.9rem, 1.6vw, 1.9rem)',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: '#737373',
              lineHeight: 0.9,
              margin: '6px 0 0',
            }}>
              {car.year} {car.model}
            </p>
            <p style={{
              fontFamily: MONO,
              fontSize: 10,
              color: '#404040',
              letterSpacing: '0.08em',
              margin: '10px 0 0',
              lineHeight: 1.4,
            }}>
              {car.trim}
            </p>
          </div>
        ) : (
          <>
            <EmptyIcon />
            <span style={{
              fontFamily: MONO,
              fontSize: 10,
              color: '#2e2e2e',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginTop: 14,
            }}>
              EMPTY SLOT
            </span>
          </>
        )}
      </div>

      {/* ── Right 60% — label, dropdowns, stats ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        minWidth: 0,
        overflow: 'hidden',
      }}>

        {/* Panel label */}
        <span style={{
          fontFamily: MONO,
          fontSize: 12,
          color: accent,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          {LABEL[side]}
        </span>

        {/* Dropdowns */}
        {loading ? (
          <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252' }}>Loading…</span>
        ) : (
          <Cascade onSelect={setCarId} accentColor={accent} />
        )}

        {/* Stats — shown only after selection */}
        {isSelected && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            flexShrink: 0,
          }}>
            <StatBox label="Horsepower" value={`${fmt(car.horsepower)} hp`} />
            <StatBox label="Torque"     value={`${fmt(car.torque)} lb·ft`} />
            <StatBox label="Weight"     value={`${fmt(car.weight_lbs)} lb`} />
            <StatBox label="Drivetrain" value={car.drivetrain} />
          </div>
        )}
      </div>
    </div>
  )
}
