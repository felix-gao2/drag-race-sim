import { useState, useEffect } from 'react'
import CarPanel from '../components/CarPanel'
import { postRace, getRace } from '../api'

const MONO    = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`
const TEXT    = '#F5F5F0'
const DIM     = 'rgba(245,245,240,0.4)'
const ACCENT  = '#DC2626'
const LANE_A  = '#DC2626'
const LANE_B  = '#F5F5F0'

function CarCoupe({ strokeColor }) {
  return (
    <svg
      viewBox="0 0 200 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: '42px', width: 'auto', display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* body outline with wheel arch cutouts */}
      <path
        d="M 15,64 L 11,56 L 22,48 L 50,42 L 72,17 L 138,15 L 164,29 L 178,44 L 186,57 L 190,64 L 182,64 A 15 15 0 0 0 152,64 L 72,64 A 15 15 0 0 0 42,64 Z"
        fill="none" stroke={strokeColor}
        strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
      />
      {/* beltline */}
      <line x1="88" y1="40" x2="163" y2="33"
        stroke={strokeColor} strokeWidth="0.8" opacity="0.4" />
      {/* front wheel */}
      <circle cx="57"  cy="64" r="14"  fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="57"  cy="64" r="4.5" fill="none" stroke={strokeColor} strokeWidth="0.8" opacity="0.4" />
      {/* rear wheel */}
      <circle cx="167" cy="64" r="14"  fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="167" cy="64" r="4.5" fill="none" stroke={strokeColor} strokeWidth="0.8" opacity="0.4" />
    </svg>
  )
}

const DIST_VALS  = ['¼ MILE', '⅛ MILE', '½ MILE']
const START_VALS = ['DIG', 'ROLL']
const SURF_VALS  = ['DRY', 'WET']

function CycleParam({ label, value, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 4,
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        fontFamily: MONO, fontSize: 10,
        color: hov ? ACCENT : DIM,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        transition: 'color 0.1s', lineHeight: 1,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: MONO, fontSize: 18,
        color: TEXT, letterSpacing: '0.06em',
        textTransform: 'uppercase', lineHeight: 1,
      }}>
        {value}
      </span>
    </div>
  )
}

function StatParam({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, whiteSpace: 'nowrap', userSelect: 'none' }}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: MONO, fontSize: 18, color: TEXT, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>
        {value}
      </span>
    </div>
  )
}

function Dot() {
  return (
    <span style={{
      fontFamily: MONO,
      fontSize: 14,
      color: 'rgba(245,245,240,0.15)',
      margin: '0 14px',
      userSelect: 'none',
      alignSelf: 'center',
    }}>·</span>
  )
}

const INIT_MILESTONES = {
  a: { sixty: null, eighth: null, trap: null, et: null },
  b: { sixty: null, eighth: null, trap: null, et: null },
}

export default function RaceSetup() {
  const [carA, setCarA] = useState(null)
  const [carB, setCarB] = useState(null)
  const [distIdx, setDistIdx] = useState(0)
  const [startIdx, setStartIdx] = useState(0)
  const [surfIdx, setSurfIdx] = useState(0)

  // race state machine: idle | loading | racing | done
  const [raceState, setRaceState] = useState('idle')
  const [raceData,  setRaceData]  = useState(null)
  const [frame,     setFrame]     = useState(0)
  const [milestones, setMilestones] = useState(INIT_MILESTONES)
  const [error, setError] = useState(null)

  const ready = carA !== null && carB !== null

  // animation loop — advance one telemetry frame every 50ms
  useEffect(() => {
    if (raceState !== 'racing' || !raceData) return
    const id = setInterval(() => {
      setFrame(f => {
        const next = f + 1
        if (next >= raceData.telemetry.length) {
          clearInterval(id)
          setRaceState('done')
          return f
        }
        return next
      })
    }, 50)
    return () => clearInterval(id)
  }, [raceState, raceData])

  // milestone tracking — runs every frame during race
  useEffect(() => {
    if (!raceData || raceState !== 'racing') return
    const tick = raceData.telemetry[frame]
    setMilestones(prev => {
      const a = { ...prev.a }
      const b = { ...prev.b }
      if (a.sixty  === null && tick.dist_a_ft >= 60)   a.sixty  = tick.time_s
      if (b.sixty  === null && tick.dist_b_ft >= 60)   b.sixty  = tick.time_s
      if (a.eighth === null && tick.dist_a_ft >= 660)  a.eighth = tick.time_s
      if (b.eighth === null && tick.dist_b_ft >= 660)  b.eighth = tick.time_s
      if (a.trap   === null && tick.dist_a_ft >= 1320) { a.trap = tick.speed_a_mph; a.et = tick.time_s }
      if (b.trap   === null && tick.dist_b_ft >= 1320) { b.trap = tick.speed_b_mph; b.et = tick.time_s }
      return { a, b }
    })
  }, [frame, raceData, raceState])

  function resetRace() {
    setRaceState('idle')
    setRaceData(null)
    setFrame(0)
    setMilestones(INIT_MILESTONES)
    setError(null)
  }

  function handleCarAChange(car) {
    setCarA(car)
    if (!car) resetRace()
  }

  function handleCarBChange(car) {
    setCarB(car)
    if (!car) resetRace()
  }

  async function handleStart() {
    if (!ready || raceState !== 'idle') return
    setRaceState('loading')
    setError(null)
    try {
      const { slug } = await postRace(carA.id, carB.id)
      const data = await getRace(slug)
      setRaceData(data)
      setFrame(0)
      setMilestones(INIT_MILESTONES)
      setRaceState('racing')
    } catch {
      setError('Failed to start race. Is the server running?')
      setRaceState('idle')
    }
  }

  function handleRaceAgain() {
    setRaceState('idle')
    setRaceData(null)
    setFrame(0)
    setMilestones(INIT_MILESTONES)
    setError(null)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000000',
      color: TEXT,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}.blink{animation:blink 1s step-end infinite}`}</style>

      {/* ── Background: exact match to Landing ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>

        {/* 40×40 grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(245,245,240,0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(245,245,240,0.04) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '40px 40px',
        }} />

        {/* center staging dashed line */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(245,245,240,0.05) 0, rgba(245,245,240,0.05) 4px, transparent 4px, transparent 12px)',
        }} />

        {/* left lane marker — line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 80, width: 1, background: 'rgba(245,245,240,0.08)' }} />
        {/* left lane marker — ticks */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 74, width: 12,
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 119px, rgba(245,245,240,0.08) 119px, rgba(245,245,240,0.08) 120px)',
        }} />

        {/* right lane marker — line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 80, width: 1, background: 'rgba(245,245,240,0.08)' }} />
        {/* right lane marker — ticks */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 74, width: 12,
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 119px, rgba(245,245,240,0.08) 119px, rgba(245,245,240,0.08) 120px)',
        }} />

        {/* corner brackets */}
        <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '1px solid rgba(220,38,38,0.6)', borderLeft: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTop: '1px solid rgba(220,38,38,0.6)', borderRight: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottom: '1px solid rgba(220,38,38,0.6)', borderLeft: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '1px solid rgba(220,38,38,0.6)', borderRight: '1px solid rgba(220,38,38,0.6)' }} />

      </div>

      {/* ── Top HUD bar — identical to Landing ── */}
      <div style={{
        height: 32, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(220,38,38,0.2)',
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          V0.1.0 // 1017 CARS
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          ¼ MILE · SIDE BY SIDE · DIG START
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            SYS — READY
          </span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em' }}>·</span>
          <span className="rec-pulse" style={{ color: ACCENT, fontSize: 8, lineHeight: 1 }}>●</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase' }}>REC</span>
        </span>
      </div>

      {/* ── Drag strip viz ── */}
      <div style={{
        height: '22vh', flexShrink: 0,
        position: 'relative', zIndex: 5,
        borderBottom: '1px solid rgba(245,245,240,0.07)',
        overflow: 'hidden',
      }}>

        {/* Grid floor — perspective-faded dashed horizontal lines */}
        {[0.52, 0.62, 0.72, 0.82, 0.91].map((yPct, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${yPct * 100}%`,
            left: 0, right: 0, height: 1,
            backgroundImage: `repeating-linear-gradient(90deg, rgba(245,245,240,${(0.02 + i * 0.006).toFixed(3)}) 0, rgba(245,245,240,${(0.02 + i * 0.006).toFixed(3)}) 8px, transparent 8px, transparent 24px)`,
          }} />
        ))}

        {/* Lane divider — center dashed line */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(245,245,240,0.07) 0, rgba(245,245,240,0.07) 4px, transparent 4px, transparent 16px)',
        }} />

        {/* START line */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: '#DC2626' }} />
        <span style={{
          position: 'absolute', left: 6, top: 7,
          fontFamily: MONO, fontSize: 10,
          color: '#DC2626', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>START</span>

        {/* FINISH line */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 1, background: 'rgba(245,245,240,0.6)' }} />
        <span style={{
          position: 'absolute', right: 6, top: 7,
          fontFamily: MONO, fontSize: 10,
          color: 'rgba(245,245,240,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>FINISH</span>

        {/* Distance markers at 25 / 50 / 75% */}
        {[
          { pct: 25, label: '330 FT' },
          { pct: 50, label: '660 FT' },
          { pct: 75, label: '1000 FT' },
        ].map(({ pct, label }) => (
          <div key={pct} style={{
            position: 'absolute', left: `${pct}%`, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            transform: 'translateX(-50%)',
          }}>
            <span style={{
              fontFamily: MONO, fontSize: 8,
              color: 'rgba(245,245,240,0.2)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              whiteSpace: 'nowrap', marginBottom: 3,
            }}>
              {label}
            </span>
            <div style={{ width: 1, height: 8, background: 'rgba(245,245,240,0.14)' }} />
          </div>
        ))}

        {/* ¼ MILE at finish edge */}
        <span style={{
          position: 'absolute', right: 6, bottom: 14,
          fontFamily: MONO, fontSize: 8,
          color: 'rgba(245,245,240,0.2)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>¼ MILE</span>

        {/* Lane A car */}
        {(() => {
          const live = raceData && frame < raceData.telemetry.length
          const tick = live ? raceData.telemetry[frame] : null
          const pctA = tick ? Math.max(0.3, Math.min((tick.dist_a_ft / 1320) * 96, 94)) : 0.3
          return (
            <div style={{
              position: 'absolute',
              left: live ? `${pctA}%` : 4,
              top: '25%',
              transform: 'translateY(-50%)',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: live ? 'left 0.05s linear' : 'none',
            }}>
              <CarCoupe strokeColor={carA ? '#DC2626' : 'rgba(220,38,38,0.22)'} />
              {!live && (
                <span style={{
                  fontFamily: MONO, fontSize: 10,
                  color: carA ? 'rgba(220,38,38,0.72)' : 'rgba(220,38,38,0.28)',
                  letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {`LANE 01 — ${carA ? `${carA.year} ${carA.make} ${carA.model}` : 'EMPTY'}`}
                </span>
              )}
            </div>
          )
        })()}

        {/* Lane B car */}
        {(() => {
          const live = raceData && frame < raceData.telemetry.length
          const tick = live ? raceData.telemetry[frame] : null
          const pctB = tick ? Math.max(0.3, Math.min((tick.dist_b_ft / 1320) * 96, 94)) : 0.3
          return (
            <div style={{
              position: 'absolute',
              left: live ? `${pctB}%` : 4,
              top: '75%',
              transform: 'translateY(-50%)',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: live ? 'left 0.05s linear' : 'none',
            }}>
              <CarCoupe strokeColor={carB ? 'rgba(245,245,240,0.65)' : 'rgba(245,245,240,0.15)'} />
              {!live && (
                <span style={{
                  fontFamily: MONO, fontSize: 10,
                  color: carB ? 'rgba(245,245,240,0.42)' : 'rgba(245,245,240,0.18)',
                  letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {`LANE 02 — ${carB ? `${carB.year} ${carB.make} ${carB.model}` : 'EMPTY'}`}
                </span>
              )}
            </div>
          )
        })()}

      </div>

      {/* ── Race params toolbar ── */}
      <div style={{
        height: '8vh', minHeight: 60, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(220,38,38,0.4)',
        borderBottom: '1px solid rgba(220,38,38,0.4)',
        background: 'rgba(0,0,0,0.4)',
      }}>

        {/* Left: cycling params — locked during/after race */}
        <div style={{ display: 'flex', alignItems: 'center', opacity: raceState !== 'idle' ? 0.3 : 1, transition: 'opacity 0.2s', pointerEvents: raceState !== 'idle' ? 'none' : 'auto' }}>
          <CycleParam
            label="DISTANCE"
            value={DIST_VALS[distIdx]}
            onClick={() => setDistIdx(i => (i + 1) % DIST_VALS.length)}
          />
          <Dot />
          <CycleParam
            label="START"
            value={START_VALS[startIdx]}
            onClick={() => setStartIdx(i => (i + 1) % START_VALS.length)}
          />
          <Dot />
          <CycleParam
            label="SURFACE"
            value={SURF_VALS[surfIdx]}
            onClick={() => setSurfIdx(i => (i + 1) % SURF_VALS.length)}
          />
          <Dot />
          <StatParam label="DA" value="56 FT" />
          <Dot />
          <StatParam label="WIND" value="0 MPH" />
        </div>

        {/* Right: CTA — changes based on race state */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {error && (
            <span style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em' }}>
              {error}
            </span>
          )}
          {raceState === 'racing' || raceState === 'loading' ? (
            <span style={{
              fontFamily: DISPLAY, fontSize: 22,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: DIM, opacity: 0.5,
              display: 'flex', alignItems: 'center', userSelect: 'none',
            }}>
              {'>'} {raceState === 'loading' ? 'LOADING...' : 'RACING...'}
            </span>
          ) : raceState === 'done' ? (
            <span
              onClick={handleRaceAgain}
              style={{
                fontFamily: DISPLAY, fontSize: 22,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                color: ACCENT, opacity: 1,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', userSelect: 'none',
              }}
            >
              <span className="blink" style={{ marginRight: 6 }}>{'>'}</span>
              RACE AGAIN
              <span className="blink" style={{ animationDelay: '0.5s', marginLeft: 2 }}>_</span>
            </span>
          ) : (
            <span
              onClick={ready ? handleStart : undefined}
              style={{
                fontFamily: DISPLAY, fontSize: 22,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                color: ACCENT,
                opacity: ready ? 1 : 0.2,
                cursor: ready ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', userSelect: 'none',
              }}
            >
              <span className="blink" style={{ marginRight: 6 }}>{'>'}</span>
              START RACE
              <span className="blink" style={{ animationDelay: '0.5s', marginLeft: 2 }}>_</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Lane panels ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        position: 'relative',
        zIndex: 5,
        minHeight: 0,
        overflow: 'hidden',
      }}>
        <CarPanel side="a" onCarChange={handleCarAChange} racePhase={raceState} />

        {/* center divider */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          width: 1, background: 'rgba(245,245,240,0.06)',
          zIndex: 1, pointerEvents: 'none',
        }} />

        <CarPanel side="b" onCarChange={handleCarBChange} racePhase={raceState} />
      </div>

      {/* ── Bottom HUD bar ── */}
      {(() => {
        const live = raceState === 'racing' || raceState === 'done'
        const tick = raceData && frame < raceData.telemetry.length ? raceData.telemetry[frame] : null
        const fmt3 = v => v != null ? v.toFixed(3) : '—'
        const fmtMph = v => v != null ? Math.round(v).toString().padStart(3, '0') : '—'
        const etA = live ? (milestones.a.et != null ? milestones.a.et.toFixed(3) : (tick ? tick.time_s.toFixed(3) : '0.000')) : '0.000'
        const etB = live ? (milestones.b.et != null ? milestones.b.et.toFixed(3) : (tick ? tick.time_s.toFixed(3) : '0.000')) : '0.000'
        const sixtyA = live ? fmt3(milestones.a.sixty) : '0.000'
        const sixtyB = live ? fmt3(milestones.b.sixty) : '0.000'
        const eighthA = live ? fmt3(milestones.a.eighth) : '0.000'
        const eighthB = live ? fmt3(milestones.b.eighth) : '0.000'
        const trapA = live ? fmtMph(milestones.a.trap) : '000'
        const trapB = live ? fmtMph(milestones.b.trap) : '000'
        return (
          <div style={{
            height: 32, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 10,
            borderTop: '1px solid rgba(245,245,240,0.05)',
          }}>
            <span style={{
              position: 'absolute', left: 24,
              fontFamily: MONO, fontSize: 11, color: DIM,
              letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              LANE <span style={{ color: 'rgba(220,38,38,0.7)' }}>01</span>
              {' · '}
              LANE <span style={{ color: 'rgba(245,245,240,0.35)' }}>02</span>
            </span>
            <span style={{
              fontFamily: MONO, fontSize: 11,
              letterSpacing: '0.10em', textTransform: 'uppercase', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 0,
            }}>
              <span style={{ color: DIM }}>ET </span>
              <span style={{ color: live ? 'rgba(220,38,38,0.85)' : DIM }}>{etA}</span>
              <span style={{ color: 'rgba(245,245,240,0.12)', margin: '0 4px' }}>/</span>
              <span style={{ color: live ? 'rgba(245,245,240,0.6)' : DIM }}>{etB}</span>
              <span style={{ color: 'rgba(245,245,240,0.12)', margin: '0 14px' }}>·</span>
              <span style={{ color: DIM }}>60FT </span>
              <span style={{ color: milestones.a.sixty != null ? 'rgba(220,38,38,0.85)' : DIM }}>{sixtyA}</span>
              <span style={{ color: 'rgba(245,245,240,0.12)', margin: '0 4px' }}>/</span>
              <span style={{ color: milestones.b.sixty != null ? 'rgba(245,245,240,0.6)' : DIM }}>{sixtyB}</span>
              <span style={{ color: 'rgba(245,245,240,0.12)', margin: '0 14px' }}>·</span>
              <span style={{ color: DIM }}>1/8 </span>
              <span style={{ color: milestones.a.eighth != null ? 'rgba(220,38,38,0.85)' : DIM }}>{eighthA}</span>
              <span style={{ color: 'rgba(245,245,240,0.12)', margin: '0 4px' }}>/</span>
              <span style={{ color: milestones.b.eighth != null ? 'rgba(245,245,240,0.6)' : DIM }}>{eighthB}</span>
              <span style={{ color: 'rgba(245,245,240,0.12)', margin: '0 14px' }}>·</span>
              <span style={{ color: DIM }}>TRAP </span>
              <span style={{ color: milestones.a.trap != null ? 'rgba(220,38,38,0.85)' : DIM }}>{trapA}</span>
              <span style={{ color: 'rgba(245,245,240,0.12)', margin: '0 4px' }}>/</span>
              <span style={{ color: milestones.b.trap != null ? 'rgba(245,245,240,0.6)' : DIM }}>{trapB}</span>
              <span style={{ color: DIM, marginLeft: 4 }}>MPH</span>
            </span>
          </div>
        )
      })()}

    </div>
  )
}
