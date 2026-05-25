import { useState, useRef, useEffect } from 'react'
import Cascade from './Cascade'

const ACCENT  = { a: '#DC2626', b: '#F5F5F0' }
const LABEL   = { a: 'LANE 01', b: 'LANE 02' }
const MONO    = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`
const TEXT    = '#F5F5F0'
const DIM     = 'rgba(245,245,240,0.38)'

const DRIVE_LABEL = {
  AWD: 'ALL-WHEEL', RWD: 'REAR-WHEEL',
  FWD: 'FRONT-WHEEL', '4WD': 'FOUR-WHEEL',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function estimateRPM(speedMph, car) {
  if (!car || speedMph <= 0) return 0
  const maxRpm = car.horsepower > 500 ? 9000
    : car.horsepower > 350 ? 7800
    : car.horsepower > 200 ? 7000
    : 6000
  const gears = [[0, 30], [30, 56], [56, 80], [80, 108], [108, 145], [145, 190]]
  const idx = Math.max(0, gears.findIndex(([, max]) => speedMph < max))
  const [gMin, gMax] = gears[idx]
  const lo = idx === 0 ? 4000 : 2200
  const frac = Math.max(0, Math.min((speedMph - gMin) / (gMax - gMin), 1))
  return Math.round(lo + frac * (maxRpm - lo))
}

function maxRpmFor(car) {
  if (!car) return 7000
  return car.horsepower > 500 ? 9000
    : car.horsepower > 350 ? 7800
    : car.horsepower > 200 ? 7000
    : 6000
}

// ── ArcGauge ──────────────────────────────────────────────────────────────────
// 270° sweep, gap at bottom-right. Start: 135° (7:30 clock), End: 45° (4:30 clock)

function ArcGauge({ value, max, color, size = 60, showRedline = false }) {
  const cx = size / 2
  const cy = size / 2
  const r  = size * 0.38

  const START = 135
  const SWEEP = 270
  const arcLen = (SWEEP / 360) * 2 * Math.PI * r

  function pt(deg) {
    const rad = deg * Math.PI / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }

  const [sx, sy] = pt(START)
  const [ex, ey] = pt(START + SWEEP)   // 405 mod 360 = 45
  const fullPath = `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 1 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`

  const frac = Math.max(0, Math.min(value / max, 1))
  const needleAngleDeg = START + frac * SWEEP
  const needleRad      = needleAngleDeg * Math.PI / 180
  const nLen = r - 5
  const nex  = cx + nLen * Math.cos(needleRad)
  const ney  = cy + nLen * Math.sin(needleRad)

  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => {
    const ang = START + t * SWEEP
    const [ax, ay] = pt(ang)
    const ir = r - 5
    const irad = ang * Math.PI / 180
    return { x1: cx + ir * Math.cos(irad), y1: cy + ir * Math.sin(irad), x2: ax, y2: ay }
  })

  const redlineTick = showRedline ? (() => {
    const ang = START + 0.8 * SWEEP
    const [ax, ay] = pt(ang)
    const ir = r - 6
    const irad = ang * Math.PI / 180
    return { x1: cx + ir * Math.cos(irad), y1: cy + ir * Math.sin(irad), x2: ax, y2: ay }
  })() : null

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0, overflow: 'visible' }}
    >
      {/* background arc */}
      <path d={fullPath} fill="none" stroke="rgba(245,245,240,0.08)" strokeWidth="1.5" strokeLinecap="round" />
      {/* progress arc */}
      <path
        d={fullPath} fill="none"
        stroke={color} strokeWidth="1.5" strokeLinecap="round"
        strokeDasharray={`${(frac * arcLen).toFixed(2)} ${(arcLen + 4).toFixed(2)}`}
      />
      {/* tick marks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1.toFixed(2)} y1={t.y1.toFixed(2)} x2={t.x2.toFixed(2)} y2={t.y2.toFixed(2)}
          stroke="rgba(245,245,240,0.2)" strokeWidth="0.8" />
      ))}
      {/* redline tick */}
      {redlineTick && (
        <line
          x1={redlineTick.x1.toFixed(2)} y1={redlineTick.y1.toFixed(2)}
          x2={redlineTick.x2.toFixed(2)} y2={redlineTick.y2.toFixed(2)}
          stroke="#DC2626" strokeWidth="1.5"
        />
      )}
      {/* needle */}
      <line
        x1={cx} y1={cy}
        x2={nex.toFixed(2)} y2={ney.toFixed(2)}
        stroke={color} strokeWidth="1.5" strokeLinecap="round"
      />
      {/* center dot */}
      <circle cx={cx} cy={cy} r="2" fill={color} />
    </svg>
  )
}

// ── GForcePlot ────────────────────────────────────────────────────────────────

function GForcePlot({ gx, gy, color, size = 60 }) {
  const MAX_G = 1.5
  const pad   = 6
  const range = size - pad * 2
  const cx    = size / 2
  const cy    = size / 2
  const scale = range / 2 / MAX_G

  const dotX = Math.max(pad, Math.min(size - pad, cx + gx * scale))
  const dotY = Math.max(pad, Math.min(size - pad, cy - gy * scale))  // y-up = forward

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {/* box */}
      <rect x="0.5" y="0.5" width={size - 1} height={size - 1}
        fill="none" stroke="rgba(245,245,240,0.3)" strokeWidth="1" />
      {/* crosshair */}
      <line x1={cx} y1={1} x2={cx} y2={size - 1} stroke="rgba(245,245,240,0.12)" strokeWidth="0.5" />
      <line x1={1} y1={cy} x2={size - 1} y2={cy} stroke="rgba(245,245,240,0.12)" strokeWidth="0.5" />
      {/* g-dot */}
      <circle cx={dotX.toFixed(2)} cy={dotY.toFixed(2)} r="4" fill={color} />
    </svg>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatBlock({ label, value }) {
  return (
    <div>
      <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
        {label}
      </span>
      <span style={{ fontFamily: DISPLAY, fontSize: 28, color: TEXT, lineHeight: 1, display: 'block' }}>
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
        letterSpacing: '0.14em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'color 0.1s', userSelect: 'none',
      }}
    >
      {children}
    </span>
  )
}

// ── Live telemetry cell ───────────────────────────────────────────────────────

function LiveCell({ label, value, unit, viz }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      padding: '14px 0',
    }}>
      <span style={{
        fontFamily: MONO, fontSize: 10,
        color: DIM, letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, minWidth: 0 }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 36,
            color: TEXT, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {value}
          </span>
          {unit && (
            <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.08em' }}>
              {unit}
            </span>
          )}
        </div>
        {viz && viz}
      </div>
    </div>
  )
}

// ── Results cell ──────────────────────────────────────────────────────────────

function ResultCell({ label, time, timeFontSize = 36, suffix, sub }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      padding: '14px 0',
    }}>
      <span style={{
        fontFamily: MONO, fontSize: 10,
        color: DIM, letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{
          fontFamily: DISPLAY, fontSize: timeFontSize,
          color: TEXT, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {time}
        </span>
        {suffix && (
          <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.08em' }}>
            {suffix}
          </span>
        )}
      </div>
      {sub && (
        <span style={{
          fontFamily: MONO, fontSize: 12,
          color: DIM, letterSpacing: '0.08em',
          lineHeight: 1,
        }}>
          {sub}
        </span>
      )}
    </div>
  )
}

// ── Grid divider ──────────────────────────────────────────────────────────────

function GridDivider({ vertical }) {
  return (
    <div style={vertical ? {
      width: 1, background: 'rgba(245,245,240,0.07)',
      alignSelf: 'stretch',
    } : {
      height: 1, background: 'rgba(245,245,240,0.07)',
      gridColumn: '1 / -1',
    }} />
  )
}

// ── Results section (terminal log) ───────────────────────────────────────────

function ResultsSection({ milestones, accent, distIdx, racePhase, isDone, isWinner }) {
  const [flashing, setFlashing] = useState({})
  const prevRef = useRef({ sixty: null, eighth: null, et: null, half: null, trap: null })

  useEffect(() => {
    const keys = ['sixty', 'eighth', 'et', 'half', 'trap']
    const newly = {}
    for (const k of keys) {
      if (prevRef.current[k] == null && milestones[k] != null) newly[k] = true
    }
    prevRef.current = {
      sixty: milestones.sixty, eighth: milestones.eighth,
      et: milestones.et, half: milestones.half, trap: milestones.trap,
    }
    if (!Object.keys(newly).length) return
    setFlashing(f => ({ ...f, ...newly }))
    const tid = setTimeout(() => {
      setFlashing(f => {
        const next = { ...f }
        for (const k of Object.keys(newly)) delete next[k]
        return next
      })
    }, 350)
    return () => clearTimeout(tid)
  }, [milestones.sixty, milestones.eighth, milestones.et, milestones.half, milestones.trap])

  const accentRgb = accent === '#DC2626' ? '220,38,38' : '245,245,240'
  const dotLeader = {
    flex: 1, height: 1, margin: '0 8px',
    backgroundImage: 'radial-gradient(circle, rgba(245,245,240,0.15) 1px, transparent 1px)',
    backgroundSize: '5px 1px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center',
  }

  const rows = []
  rows.push({
    key: 'sixty', flashKey: 'sixty', label: '0-60 MPH',
    mainVal: milestones.sixty != null ? `${milestones.sixty.toFixed(2)} S` : null,
    suffix: null,
  })
  rows.push({
    key: 'eighth', flashKey: 'eighth', label: '1/8 MILE',
    mainVal: milestones.eighth != null ? `${milestones.eighth.toFixed(3)} S` : null,
    suffix: milestones.eighth != null && milestones.eighthSpeed != null
      ? `@ ${milestones.eighthSpeed} MPH` : null,
  })
  if (distIdx === 0 || distIdx === 2) {
    rows.push({
      key: 'et', flashKey: 'et', label: '1/4 MILE',
      mainVal: milestones.et != null ? `${milestones.et.toFixed(3)} S` : null,
      suffix: milestones.et != null && milestones.trap != null
        ? `@ ${Math.round(milestones.trap)} MPH` : null,
    })
  }
  if (distIdx === 2) {
    rows.push({
      key: 'half', flashKey: 'half', label: '1/2 MILE',
      mainVal: milestones.half != null ? `${milestones.half.toFixed(3)} S` : null,
      suffix: milestones.half != null && milestones.halfSpeed != null
        ? `@ ${milestones.halfSpeed} MPH` : null,
    })
  }
  rows.push({
    key: 'trap', flashKey: distIdx === 1 ? 'eighth' : 'trap', label: 'TRAP SPEED',
    mainVal: distIdx === 1
      ? (milestones.eighthSpeed != null ? `${milestones.eighthSpeed} MPH` : null)
      : (milestones.trap != null ? `${milestones.trap.toFixed(1)} MPH` : null),
    suffix: null,
  })

  const isActive = racePhase === 'racing'
  const allLocked = rows.every(r => r.mainVal !== null)
  const showBlink = isActive && !allLocked

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        height: 1, margin: '0 0 16px',
        background: `rgba(${accentRgb},0.2)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          fontFamily: DISPLAY, fontSize: 14, color: accent,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {'> RESULTS'}
        </span>
        {showBlink && (
          <span className="blink" style={{
            marginLeft: 3, color: '#DC2626',
            fontFamily: MONO, fontSize: 13, lineHeight: 1,
          }}>|</span>
        )}
        {isDone && isWinner && (
          <span style={{
            marginLeft: 14, fontFamily: DISPLAY, fontSize: 12,
            color: '#DC2626', letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span className="blink">·</span>WINNER
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map(row => {
          const locked = row.mainVal !== null
          const isFlashing = !!flashing[row.flashKey]
          return (
            <div key={row.key} style={{
              display: 'flex', alignItems: 'center',
              padding: '3px 0', minHeight: 26,
            }}>
              <span style={{
                fontFamily: MONO, fontSize: 12,
                color: 'rgba(245,245,240,0.5)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                flexShrink: 0, lineHeight: 1,
              }}>
                {row.label}
              </span>
              <div style={dotLeader} />
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 4,
                flexShrink: 0, padding: '1px 4px',
                animation: isFlashing ? 'flashLock 0.25s ease-out forwards' : 'none',
              }}>
                <span style={{
                  fontFamily: DISPLAY, fontSize: 16,
                  color: locked ? accent : `rgba(${accentRgb},0.25)`,
                  letterSpacing: '0.02em', lineHeight: 1,
                }}>
                  {locked ? row.mainVal : '───'}
                </span>
                {locked && row.suffix && (
                  <span style={{
                    fontFamily: MONO, fontSize: 11,
                    color: `rgba(${accentRgb},0.6)`,
                    letterSpacing: '0.06em', lineHeight: 1,
                  }}>
                    {row.suffix}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── CarPanel ──────────────────────────────────────────────────────────────────

export default function CarPanel({
  side,
  onCarChange,
  racePhase = 'idle',
  tick       = null,
  gForce     = 0,
  milestones = { sixty: null, eighth: null, eighthSpeed: null, trap: null, et: null, half: null, halfSpeed: null },
  isWinner   = false,
  onReplay,
  distIdx    = 0,
}) {
  const accent = ACCENT[side]
  const label  = LABEL[side]

  const [selectedCar, setSelectedCar] = useState(null)

  function handleSelect(car) { setSelectedCar(car); onCarChange(car) }
  function handleClear()     { setSelectedCar(null); onCarChange(null) }

  const pwRatio    = selectedCar ? (selectedCar.weight_lbs / selectedCar.horsepower).toFixed(1) : null
  const driveLabel = selectedCar ? (DRIVE_LABEL[selectedCar.drivetrain] ?? selectedCar.drivetrain) : null

  // derive live values from tick
  const speedVal = tick ? Math.round(side === 'a' ? tick.speed_a_mph : tick.speed_b_mph) : 0
  const etVal    = tick ? (side === 'a' ? tick.time_s : tick.time_s).toFixed(2) : '0.00'
  const rpmVal   = estimateRPM(speedVal, selectedCar)
  const maxRpm   = maxRpmFor(selectedCar)

  const isLive    = racePhase === 'racing' || racePhase === 'loading'
  const isDone    = racePhase === 'done'
  const showLive  = isLive && selectedCar
  const showDone  = isDone && selectedCar

  const fmt3 = v => v != null ? v.toFixed(3) : '—'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%',
      borderTop: `2px solid ${accent}`,
      background: side === 'a' ? 'rgba(220,38,38,0.025)' : 'rgba(245,245,240,0.012)',
      boxSizing: 'border-box', minHeight: 0,
    }}>
      <div style={{
        flex: 1, minHeight: 0,
        overflow: 'hidden auto',
        padding: '32px 40px',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
      }}>

        {!selectedCar ? (
          /* ── EMPTY ── */
          <>
            <span style={{ fontFamily: MONO, fontSize: 18, color: accent, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              {label}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', display: 'block', marginBottom: 32 }}>
              {'> AWAITING SELECTION'}
            </span>
            <Cascade onSelect={handleSelect} accentColor={accent} />
          </>
        ) : (
          /* ── SELECTED (all phases) ── */
          <>
            {/* ── Header — always shown ── */}
            <div style={{ marginBottom: showLive || showDone ? 20 : 32 }}>
              <p style={{
                fontFamily: DISPLAY, fontSize: 32,
                color: accent, lineHeight: 1,
                textTransform: 'uppercase',
                margin: '0 0 6px',
              }}>
                {selectedCar.year} {selectedCar.make} {selectedCar.model}
              </p>
              <p style={{
                fontFamily: MONO, fontSize: 11,
                color: DIM, letterSpacing: '0.12em',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                {label} · {selectedCar.trim} · {driveLabel}
              </p>
            </div>

            {/* ── IDLE: spec card ── */}
            {!showLive && !showDone && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 28px' }}>
                <StatBlock label="HORSEPOWER"     value={`${selectedCar.horsepower} HP`} />
                <StatBlock label="TORQUE"         value={`${selectedCar.torque} LB-FT`} />
                <StatBlock label="WEIGHT"         value={`${selectedCar.weight_lbs} LBS`} />
                <StatBlock label="POWER / WEIGHT" value={`${pwRatio} LB/HP`} />
              </div>
            )}

            {/* ── LIVE/DONE: telemetry 2×2 + results section ── */}
            {(showLive || showDone) && (
              <div style={{ flex: 1 }}>
                {/* Telemetry grid — dims to 50% when race ends */}
                <div style={{
                  opacity: isDone ? 0.5 : 1,
                  transition: 'opacity 0.4s ease',
                }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1px 1fr',
                    gap: 0,
                  }}>
                    <LiveCell
                      label="RPM"
                      value={rpmVal.toLocaleString('en-US')}
                      unit={null}
                      viz={<ArcGauge value={rpmVal} max={maxRpm} color={accent} showRedline />}
                    />
                    <GridDivider vertical />
                    <div style={{ paddingLeft: 20 }}>
                      <LiveCell
                        label="SPEED"
                        value={speedVal}
                        unit="MPH"
                        viz={<ArcGauge value={speedVal} max={200} color={accent} />}
                      />
                    </div>

                    <GridDivider />

                    <LiveCell
                      label="G-FORCE"
                      value={gForce.toFixed(1)}
                      unit="G"
                      viz={<GForcePlot gx={0} gy={gForce} color={accent} />}
                    />
                    <GridDivider vertical />
                    <div style={{ paddingLeft: 20 }}>
                      <LiveCell label="ET" value={etVal} unit="S" />
                    </div>
                  </div>
                </div>

                <ResultsSection
                  milestones={milestones}
                  accent={accent}
                  distIdx={distIdx}
                  racePhase={racePhase}
                  isDone={isDone}
                  isWinner={isWinner}
                />
              </div>
            )}

            {/* ── Action links ── */}
            <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
              {racePhase === 'idle' || racePhase === 'loading' ? (
                <ActionLink onClick={handleClear}>[ REMOVE ]</ActionLink>
              ) : racePhase === 'racing' ? (
                <ActionLink onClick={handleClear}>[ CHANGE CAR ]</ActionLink>
              ) : (
                <>
                  <ActionLink onClick={handleClear}>[ CHANGE CAR ]</ActionLink>
                  {onReplay && <ActionLink onClick={onReplay}>[ REPLAY ]</ActionLink>}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
