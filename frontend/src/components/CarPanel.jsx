import { useState, useEffect } from 'react'
import { getCar } from '../api'
import Cascade from './Cascade'

const ACCENT = { a: 'var(--color-car-a)', b: 'var(--color-car-b)' }
const LABEL = { a: 'Car A', b: 'Car B' }

function StatBox({ label, value, mono = true, span = 1 }) {
  return (
    <div style={{
      gridColumn: `span ${span}`,
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-muted)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
        fontWeight: mono ? 500 : 700,
        fontSize: mono ? '1.1rem' : '1rem',
        color: 'var(--color-text)',
        lineHeight: 1.2,
      }}>
        {value}
      </span>
    </div>
  )
}

function fmt(n, decimals = 0) {
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export default function CarPanel({ side, onCarChange }) {
  const accent = ACCENT[side]
  const [carId, setCarId] = useState(null)
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!carId) { setCar(null); onCarChange(null); return }
    setLoading(true)
    getCar(carId)
      .then(data => { setCar(data); onCarChange(data) })
      .catch(() => { setCar(null); onCarChange(null) })
      .finally(() => setLoading(false))
  }, [carId])

  function handleRemove() {
    setCarId(null)
  }

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: `1px solid var(--color-border)`,
      borderTop: `3px solid ${accent}`,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '22rem',
    }}>
      {/* panel header */}
      <div style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: accent,
        }}>
          {LABEL[side]}
        </span>
        {car && (
          <button
            onClick={handleRemove}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              background: 'none',
              border: '1px solid var(--color-border)',
              padding: '0.25rem 0.6rem',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
          >
            Remove
          </button>
        )}
      </div>

      {/* body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {loading && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-muted)', textAlign: 'center' }}>
            Loading…
          </p>
        )}

        {!loading && !car && (
          <Cascade onSelect={setCarId} accentColor={accent} />
        )}

        {!loading && car && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* car name */}
            <div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.5rem',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                color: 'var(--color-text)',
                margin: 0,
              }}>
                {car.year} {car.make} {car.model}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--color-muted)',
                margin: '0.3rem 0 0',
                letterSpacing: '0.05em',
              }}>
                {car.trim}
              </p>
            </div>

            {/* 2×2 stat grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <StatBox label="Horsepower" value={`${fmt(car.horsepower)} hp`} />
              <StatBox label="Torque" value={`${fmt(car.torque)} lb·ft`} />
              <StatBox
                label="Weight"
                value={`${fmt(car.weight_lbs)} lb`}
              />
              <StatBox
                label="Drivetrain"
                value={car.drivetrain}
                mono={false}
              />
            </div>

            {/* performance row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <StatBox label="0–60 mph" value={`${car.zero_to_sixty}s`} />
              <StatBox label="¼ mile" value={`${car.quarter_mile}s`} />
              <StatBox label="Trap" value={car.trap_mph != null ? `${car.trap_mph} mph` : '—'} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
