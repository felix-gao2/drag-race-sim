import { useState } from 'react'
import Cascade from './Cascade'

const ACCENT  = { a: '#DC2626', b: '#F5F5F0' }
const LABEL   = { a: 'LANE 01', b: 'LANE 02' }
const MONO    = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`
const TEXT    = '#F5F5F0'
const DIM     = 'rgba(245,245,240,0.38)'

const DRIVE_LABEL = {
  AWD:  'ALL-WHEEL',
  RWD:  'REAR-WHEEL',
  FWD:  'FRONT-WHEEL',
  '4WD':'FOUR-WHEEL',
}

function StatBlock({ label, value }) {
  return (
    <div>
      <span style={{
        fontFamily: MONO, fontSize: 10,
        color: DIM, letterSpacing: '0.22em',
        textTransform: 'uppercase',
        display: 'block', marginBottom: 8,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: DISPLAY, fontSize: 28,
        color: TEXT, lineHeight: 1,
        display: 'block',
      }}>
        {value}
      </span>
    </div>
  )
}

function ActionLink({ children, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: MONO, fontSize: 11,
        color: hov ? '#DC2626' : DIM,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'color 0.1s',
        userSelect: 'none',
      }}
    >
      {children}
    </span>
  )
}

export default function CarPanel({ side, onCarChange, racePhase = 'idle' }) {
  const accent = ACCENT[side]
  const label  = LABEL[side]

  const [selectedCar, setSelectedCar] = useState(null)

  function handleSelect(car) {
    setSelectedCar(car)
    onCarChange(car)
  }

  function handleClear() {
    setSelectedCar(null)
    onCarChange(null)
  }

  const pwRatio    = selectedCar ? (selectedCar.weight_lbs / selectedCar.horsepower).toFixed(1) : null
  const driveLabel = selectedCar ? (DRIVE_LABEL[selectedCar.drivetrain] ?? selectedCar.drivetrain) : null

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
    }}>
      <div style={{
        flex: 1, minHeight: 0,
        overflow: 'hidden auto',
        padding: '48px',
        boxSizing: 'border-box',
      }}>

        {!selectedCar ? (
          /* ── STATE A: empty ── */
          <>
            <span style={{
              fontFamily: MONO, fontSize: 18,
              color: accent, letterSpacing: '0.3em',
              textTransform: 'uppercase',
              display: 'block', marginBottom: 8,
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: MONO, fontSize: 11,
              color: DIM, letterSpacing: '0.12em',
              display: 'block', marginBottom: 32,
            }}>
              {'> AWAITING SELECTION'}
            </span>
            <Cascade onSelect={handleSelect} accentColor={accent} />
          </>
        ) : (
          /* ── STATE B: populated ── */
          <>
            {/* Car name */}
            <p style={{
              fontFamily: DISPLAY, fontSize: 32,
              color: accent, lineHeight: 1,
              textTransform: 'uppercase',
              margin: '0 0 8px',
            }}>
              {selectedCar.year} {selectedCar.make} {selectedCar.model}
            </p>

            {/* Trim + drivetrain */}
            <p style={{
              fontFamily: MONO, fontSize: 11,
              color: DIM, letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0 0 32px',
            }}>
              {selectedCar.trim} · {driveLabel}
            </p>

            {/* 2×2 stat grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px 28px',
              marginBottom: 36,
            }}>
              <StatBlock label="HORSEPOWER"    value={`${selectedCar.horsepower} HP`} />
              <StatBlock label="TORQUE"        value={`${selectedCar.torque} LB-FT`} />
              <StatBlock label="WEIGHT"        value={`${selectedCar.weight_lbs} LBS`} />
              <StatBlock label="POWER / WEIGHT" value={`${pwRatio} LB/HP`} />
            </div>

            {/* Action links */}
            {racePhase === 'idle' ? (
              <div style={{ display: 'flex', gap: 24 }}>
                <ActionLink onClick={handleClear}>[ EDIT ]</ActionLink>
                <ActionLink onClick={handleClear}>[ REMOVE ]</ActionLink>
              </div>
            ) : racePhase === 'done' ? (
              <ActionLink onClick={handleClear}>[ CHANGE CARS ]</ActionLink>
            ) : null}
          </>
        )}

      </div>
    </div>
  )
}
