import { useState, useEffect } from 'react'
import { getCar } from '../api'
import Cascade from './Cascade'

const ACCENT  = { a: '#DC2626', b: '#F5F5F0' }
const LABEL   = { a: 'LANE 01', b: 'LANE 02' }
const MONO    = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`
const TEXT    = '#F5F5F0'
const DIM     = 'rgba(245,245,240,0.4)'

function fmt(n, decimals = 0) {
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: decimals })
}

function StatRow({ label, value }) {
  return (
    <div style={{
      borderTop: '1px solid rgba(245,245,240,0.07)',
      padding: '9px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    }}>
      <span style={{
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: DIM,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: MONO,
        fontSize: 15,
        color: TEXT,
        lineHeight: 1,
        letterSpacing: '0.04em',
      }}>
        {value}
      </span>
    </div>
  )
}

export default function CarPanel({ side, onCarChange }) {
  const accent = ACCENT[side]
  const label  = LABEL[side]

  const [carId, setCarId]         = useState(null)
  const [car, setCar]             = useState(null)
  const [loading, setLoading]     = useState(false)
  const [showCascade, setShowCascade] = useState(true)

  useEffect(() => {
    if (!carId) { setCar(null); onCarChange(null); return }
    setLoading(true)
    getCar(carId)
      .then(data => { setCar(data); onCarChange(data); setShowCascade(false) })
      .catch(() => { setCar(null); onCarChange(null) })
      .finally(() => setLoading(false))
  }, [carId])

  function handleChange() {
    setCarId(null)
    setCar(null)
    onCarChange(null)
    setShowCascade(true)
  }

  const isSelected = !loading && car !== null

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderTop: `2px solid ${accent}`,
      background: side === 'a'
        ? 'rgba(220,38,38,0.025)'
        : 'rgba(245,245,240,0.012)',
      boxSizing: 'border-box',
      minHeight: 0,
      overflow: 'hidden',
    }}>

      {/* ── Panel header — only when a car is selected ── */}
      {!showCascade && (
        <div style={{
          height: 36,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid rgba(245,245,240,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: accent, display: 'inline-block', flexShrink: 0,
              opacity: side === 'b' ? 0.6 : 1,
            }} />
            <span style={{
              fontFamily: MONO, fontSize: 10,
              color: accent, letterSpacing: '0.3em', textTransform: 'uppercase',
              opacity: side === 'b' ? 0.7 : 1,
            }}>
              {label}
            </span>
          </div>

          <button
            onClick={handleChange}
            style={{
              fontFamily: MONO, fontSize: 9,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: DIM, background: 'none',
              border: '1px solid rgba(245,245,240,0.1)',
              borderRadius: 0, padding: '3px 10px',
              cursor: 'pointer',
              transition: 'color 0.1s, border-color 0.1s',
            }}
            onMouseEnter={e => { e.target.style.color = TEXT; e.target.style.borderColor = 'rgba(245,245,240,0.3)' }}
            onMouseLeave={e => { e.target.style.color = ''; e.target.style.borderColor = '' }}
          >
            CHANGE
          </button>
        </div>
      )}

      {/* ── Content area ── */}
      <div style={{
        flex: 1, minHeight: 0, overflow: 'hidden auto',
        padding: '28px 24px',
        boxSizing: 'border-box',
      }}>
        {loading ? (
          <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.1em' }}>
            Loading…
          </span>
        ) : showCascade ? (
          <>
            {/* Lane label */}
            <span style={{
              fontFamily: MONO, fontSize: 18,
              color: accent, letterSpacing: '0.3em',
              textTransform: 'uppercase',
              display: 'block', marginBottom: 8,
            }}>
              {label}
            </span>
            {/* Status */}
            <span style={{
              fontFamily: MONO, fontSize: 11,
              color: DIM, letterSpacing: '0.12em',
              display: 'block', marginBottom: 32,
            }}>
              {'> AWAITING SELECTION'}
            </span>
            <Cascade onSelect={setCarId} accentColor={accent} />
          </>
        ) : isSelected && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Car identity */}
            <div style={{ marginBottom: 22 }}>
              <p style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(1.8rem, 3vw, 3.8rem)',
                fontWeight: 400,
                textTransform: 'uppercase',
                color: accent,
                lineHeight: 0.88,
                margin: 0,
                opacity: side === 'b' ? 0.85 : 1,
              }}>
                {car.make}
              </p>
              <p style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(1.1rem, 2vw, 2.4rem)',
                fontWeight: 400,
                textTransform: 'uppercase',
                color: TEXT,
                lineHeight: 0.9,
                margin: '10px 0 0',
              }}>
                {car.year} {car.model}
              </p>
              <p style={{
                fontFamily: MONO,
                fontSize: 9,
                color: DIM,
                letterSpacing: '0.1em',
                margin: '10px 0 0',
                lineHeight: 1.5,
                textTransform: 'uppercase',
              }}>
                {car.trim}
              </p>
            </div>

            {/* Stats — 2-column grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: 28,
            }}>
              <StatRow label="Horsepower" value={`${fmt(car.horsepower)} hp`} />
              <StatRow label="Torque"     value={`${fmt(car.torque)} lb·ft`} />
              <StatRow label="Weight"     value={`${fmt(car.weight_lbs)} lb`} />
              <StatRow label="Drivetrain" value={car.drivetrain} />
              <StatRow label="0 – 60 mph" value={car.zero_to_sixty != null ? `${car.zero_to_sixty}s` : '—'} />
              <StatRow label="¼ Mile"     value={car.quarter_mile  != null ? `${car.quarter_mile}s`  : '—'} />
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
