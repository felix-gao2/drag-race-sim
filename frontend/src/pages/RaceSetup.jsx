import { useState, useEffect, useMemo, useRef } from 'react'
import CarPanel from '../components/CarPanel'
import { postRace, getRace } from '../api'

const MONO    = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`
const TEXT    = '#F5F5F0'
const DIM     = 'rgba(245,245,240,0.4)'
const ACCENT  = '#DC2626'

const SPEED_VALS  = ['0.25×', '0.5×', '0.75×', '1×', '2×']
const SPEED_RATES = [0.25, 0.5, 0.75, 1, 2]

function CarCoupe({ strokeColor }) {
  return (
    <svg
      viewBox="0 0 200 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: '42px', width: 'auto', display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <path
        d="M 15,64 L 11,56 L 22,48 L 50,42 L 72,17 L 138,15 L 164,29 L 178,44 L 186,57 L 190,64 L 182,64 A 15 15 0 0 0 152,64 L 72,64 A 15 15 0 0 0 42,64 Z"
        fill="none" stroke={strokeColor}
        strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
      />
      <line x1="88" y1="40" x2="163" y2="33"
        stroke={strokeColor} strokeWidth="0.8" opacity="0.4" />
      <circle cx="57"  cy="64" r="14"  fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="57"  cy="64" r="4.5" fill="none" stroke={strokeColor} strokeWidth="0.8" opacity="0.4" />
      <circle cx="167" cy="64" r="14"  fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="167" cy="64" r="4.5" fill="none" stroke={strokeColor} strokeWidth="0.8" opacity="0.4" />
    </svg>
  )
}

const DIST_VALS  = ['1/4 MILE', '1/8 MILE', '1/2 MILE']
const START_VALS = ['DIG', 'ROLL']
const SURF_VALS  = ['DRY', 'WET']

function SegOption({ label, isActive, locked, onClick }) {
  const [hov, setHov] = useState(false)
  let opacity
  if (locked) {
    opacity = isActive ? 0.5 : 0.15
  } else if (isActive) {
    opacity = 1
  } else {
    opacity = hov ? 0.6 : 0.3
  }
  const underlineColor = locked ? 'rgba(220,38,38,0.4)' : '#DC2626'
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => { if (!locked && !isActive) setHov(true) }}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: MONO, fontSize: 16,
        color: `rgba(245,245,240,${opacity})`,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        cursor: locked || isActive ? 'default' : 'pointer',
        transition: 'color 0.1s', lineHeight: 1,
        display: 'inline-block',
        paddingBottom: 4,
        borderBottom: isActive ? `1.5px solid ${underlineColor}` : '1.5px solid transparent',
        userSelect: 'none', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function SegmentedParam({ label, options, activeIdx, onSelect, locked }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, userSelect: 'none', whiteSpace: 'nowrap' }}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {options.map((opt, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <span style={{
                fontFamily: MONO, fontSize: 12,
                color: `rgba(245,245,240,${locked ? 0.1 : 0.2})`,
                margin: '0 8px', lineHeight: 1, userSelect: 'none',
              }}>·</span>
            )}
            <SegOption
              label={opt}
              isActive={i === activeIdx}
              locked={locked}
              onClick={() => !locked && onSelect(i)}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

function StatParam({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, whiteSpace: 'nowrap', userSelect: 'none' }}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: 16, color: TEXT, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>{value}</span>
    </div>
  )
}

function PlaybackBtn({ label, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: MONO, fontSize: 13,
        letterSpacing: '0.05em', textTransform: 'uppercase',
        color: hov ? TEXT : 'rgba(245,245,240,0.7)',
        background: 'none',
        border: `1px solid ${hov ? TEXT : 'rgba(245,245,240,0.3)'}`,
        padding: '10px 18px',
        cursor: 'pointer',
        transition: 'color 0.12s, border-color 0.12s',
        userSelect: 'none', lineHeight: 1, borderRadius: 0,
      }}
    >
      {label}
    </button>
  )
}

function PlayPauseBtn({ paused, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: MONO, fontSize: 15,
        letterSpacing: '0.05em', textTransform: 'uppercase',
        color: ACCENT, background: 'none',
        border: `1px solid ${ACCENT}`,
        padding: '12px 24px', minWidth: 140,
        cursor: 'pointer', userSelect: 'none',
        lineHeight: 1, borderRadius: 0,
      }}
    >
      {paused ? (
        <><span className="blink">▷</span>{' PLAY_'}</>
      ) : (
        '❚❚ PAUSE_'
      )}
    </button>
  )
}

function SpeedParam({ label, value, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer', userSelect: 'none' }}
    >
      <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
        {label}
      </span>
      <span style={{
        fontFamily: MONO, fontSize: 16,
        color: hov ? ACCENT : TEXT,
        letterSpacing: '0.06em', lineHeight: 1,
        transition: 'color 0.1s',
      }}>
        {value}
      </span>
    </div>
  )
}

const DIVIDER = (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ width: 32 }} />
    <div style={{ width: 1, height: 40, background: 'rgba(245,245,240,0.2)', flexShrink: 0 }} />
    <div style={{ width: 32 }} />
  </div>
)

function PlaybackHeader({ tick, paused, onPlayPause, onRestart, onPrev, onNext, speedIdx, onCycleSpeed }) {
  const timeStr = tick ? tick.time_s.toFixed(2) : '0.00'
  return (
    <div style={{
      height: '12vh', minHeight: 86, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
      position: 'relative', zIndex: 10,
      borderTop: '1px solid rgba(220,38,38,0.4)',
      borderBottom: '1px solid rgba(220,38,38,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Nav + play buttons */}
        <PlaybackBtn label="RESTART" onClick={onRestart} />
        <PlaybackBtn label="PREV"    onClick={onPrev} />
        <PlayPauseBtn paused={paused} onClick={onPlayPause} />
        <PlaybackBtn label="NEXT"    onClick={onNext} />

        {DIVIDER}

        {/* Time readout */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{
            fontFamily: MONO, fontSize: 48,
            color: TEXT, lineHeight: 1,
            letterSpacing: '0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {timeStr}
          </span>
          <span style={{
            fontFamily: MONO, fontSize: 16,
            color: DIM, marginLeft: 6,
            letterSpacing: '0.08em', lineHeight: 1,
          }}>
            S
          </span>
        </div>

        {DIVIDER}

        {/* Speed */}
        <SpeedParam label="SPEED" value={SPEED_VALS[speedIdx]} onClick={onCycleSpeed} />
      </div>
    </div>
  )
}

function TimelineScrubber({ telemetry, frame, onScrub }) {
  const trackRef = useRef(null)
  const [hoverRatio, setHoverRatio] = useState(null)

  const totalFrames = telemetry.length - 1
  const tick = telemetry[Math.min(frame, totalFrames)]
  const pctA = Math.min((tick.dist_a_ft / 1320) * 100, 99)
  const pctB = Math.min((tick.dist_b_ft / 1320) * 100, 99)

  function getRatio(e) {
    const rect = trackRef.current.getBoundingClientRect()
    return Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1))
  }

  const hoverTime = hoverRatio !== null
    ? telemetry[Math.round(hoverRatio * totalFrames)]?.time_s
    : null

  return (
    <div
      ref={trackRef}
      onClick={e => onScrub(Math.round(getRatio(e) * totalFrames))}
      onMouseMove={e => setHoverRatio(getRatio(e))}
      onMouseLeave={() => setHoverRatio(null)}
      style={{
        height: '4vh', minHeight: 28, flexShrink: 0,
        position: 'relative', zIndex: 10,
        cursor: 'crosshair',
        borderBottom: '1px solid rgba(245,245,240,0.06)',
      }}
    >
      {/* Track line */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: '44%', height: 1,
        background: 'rgba(245,245,240,0.2)',
        pointerEvents: 'none',
      }} />

      {/* Tick marks */}
      {[{ pct: 25, label: '330FT' }, { pct: 50, label: '660FT' }, { pct: 75, label: '1000FT' }].map(({ pct, label }) => (
        <div key={pct} style={{
          position: 'absolute', left: `${pct}%`,
          top: 'calc(44% - 5px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: 'translateX(-50%)', pointerEvents: 'none',
        }}>
          <div style={{ width: 1, height: 10, background: 'rgba(245,245,240,0.2)' }} />
          <span style={{
            fontFamily: MONO, fontSize: 9,
            color: 'rgba(245,245,240,0.25)',
            letterSpacing: '0.06em', marginTop: 3, whiteSpace: 'nowrap',
          }}>{label}</span>
        </div>
      ))}

      {/* Finish line */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 1, background: 'rgba(245,245,240,0.6)',
        pointerEvents: 'none',
      }} />

      {/* Lane B marker (behind A) */}
      <div style={{
        position: 'absolute',
        left: `${pctB}%`, top: '44%',
        transform: 'translate(-50%, -50%)',
        width: 8, height: 8, background: '#F5F5F0',
        pointerEvents: 'none', transition: 'left 0.05s linear',
      }} />

      {/* Lane A marker (in front) */}
      <div style={{
        position: 'absolute',
        left: `${pctA}%`, top: '44%',
        transform: 'translate(-50%, -50%)',
        width: 8, height: 8, background: '#DC2626',
        pointerEvents: 'none', transition: 'left 0.05s linear',
      }} />

      {/* Hover tooltip */}
      {hoverRatio !== null && hoverTime != null && (
        <div style={{
          position: 'absolute',
          left: `${hoverRatio * 100}%`,
          top: 'calc(44% - 22px)',
          transform: 'translateX(-50%)',
          fontFamily: MONO, fontSize: 11,
          color: TEXT,
          background: 'rgba(0,0,0,0.85)',
          padding: '1px 5px',
          pointerEvents: 'none', whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          border: '1px solid rgba(245,245,240,0.12)',
        }}>
          {hoverTime.toFixed(2)}s
        </div>
      )}
    </div>
  )
}

const INIT_MILESTONES = {
  a: { sixty: null, eighth: null, trap: null, et: null },
  b: { sixty: null, eighth: null, trap: null, et: null },
}

export default function RaceSetup() {
  const [carA, setCarA] = useState(null)
  const [carB, setCarB] = useState(null)
  const [distIdx,  setDistIdx]  = useState(0)
  const [startIdx, setStartIdx] = useState(0)
  const [surfIdx,  setSurfIdx]  = useState(0)

  const [raceState, setRaceState] = useState('idle')
  const [raceData,  setRaceData]  = useState(null)
  const [frame,     setFrame]     = useState(0)
  const [paused,    setPaused]    = useState(false)
  const [speedIdx,  setSpeedIdx]  = useState(3)
  const [error,     setError]     = useState(null)

  const ready = carA !== null && carB !== null

  const milestones = useMemo(() => {
    if (!raceData || raceState === 'idle' || raceState === 'loading') return INIT_MILESTONES
    const m = {
      a: { sixty: null, eighth: null, eighthSpeed: null, trap: null, et: null },
      b: { sixty: null, eighth: null, eighthSpeed: null, trap: null, et: null },
    }
    for (let i = 0; i <= Math.min(frame, raceData.telemetry.length - 1); i++) {
      const t = raceData.telemetry[i]
      if (m.a.sixty  === null && t.dist_a_ft >= 60)   m.a.sixty  = t.time_s
      if (m.b.sixty  === null && t.dist_b_ft >= 60)   m.b.sixty  = t.time_s
      if (m.a.eighth === null && t.dist_a_ft >= 660)  { m.a.eighth = t.time_s; m.a.eighthSpeed = Math.round(t.speed_a_mph) }
      if (m.b.eighth === null && t.dist_b_ft >= 660)  { m.b.eighth = t.time_s; m.b.eighthSpeed = Math.round(t.speed_b_mph) }
      if (m.a.trap   === null && t.dist_a_ft >= 1320) { m.a.trap = t.speed_a_mph; m.a.et = t.time_s }
      if (m.b.trap   === null && t.dist_b_ft >= 1320) { m.b.trap = t.speed_b_mph; m.b.et = t.time_s }
    }
    return m
  }, [raceData, raceState, frame])

  // animation loop — respects pause and speed
  useEffect(() => {
    if (raceState !== 'racing' || !raceData || paused) return
    const interval = Math.round(50 / SPEED_RATES[speedIdx])
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
    }, interval)
    return () => clearInterval(id)
  }, [raceState, raceData, paused, speedIdx])

  function resetRace() {
    setRaceState('idle')
    setRaceData(null)
    setFrame(0)
    setError(null)
    setPaused(false)
  }

  function handleCarAChange(car) { setCarA(car); if (!car) resetRace() }
  function handleCarBChange(car) { setCarB(car); if (!car) resetRace() }

  async function handleStart() {
    if (!ready || raceState !== 'idle') return
    setRaceState('loading')
    setError(null)
    try {
      const { slug } = await postRace(carA.id, carB.id)
      const data = await getRace(slug)
      setRaceData(data)
      setFrame(0)
      setRaceState('racing')
      setPaused(false)
    } catch {
      setError('Failed to start race. Is the server running?')
      setRaceState('idle')
    }
  }

  function handleRaceAgain() {
    setRaceState('idle')
    setRaceData(null)
    setFrame(0)
    setError(null)
    setPaused(false)
  }

  function handlePlayPause() {
    if (raceState === 'done') {
      setFrame(0)
      setRaceState('racing')
      setPaused(false)
    } else {
      setPaused(p => !p)
    }
  }

  function handleRestart() {
    setFrame(0)
    setPaused(false)
    if (raceState === 'done') setRaceState('racing')
  }

  function handlePrev() {
    setFrame(f => Math.max(0, f - 1))
  }

  function handleNext() {
    if (!raceData) return
    setFrame(f => Math.min(f + 1, raceData.telemetry.length - 1))
  }

  function handleScrub(targetFrame) {
    if (!raceData) return
    const clamped = Math.max(0, Math.min(targetFrame, raceData.telemetry.length - 1))
    setFrame(clamped)
    if (raceState === 'done' && clamped < raceData.telemetry.length - 1 && !paused) {
      setRaceState('racing')
    }
  }

  const hasRace = (raceState === 'racing' || raceState === 'done') && raceData

  const currentTickFull = raceData ? raceData.telemetry[Math.min(frame, raceData.telemetry.length - 1)] : null
  const prevTickFull    = raceData && frame > 0 ? raceData.telemetry[frame - 1] : null
  function calcGForce(curr, prev, side) {
    if (!curr || !prev) return 0
    const delta = side === 'a' ? curr.speed_a_mph - prev.speed_a_mph : curr.speed_b_mph - prev.speed_b_mph
    return Math.max(0, (delta * 1.467) / (0.05 * 32.174))
  }
  const gForceA = calcGForce(currentTickFull, prevTickFull, 'a')
  const gForceB = calcGForce(currentTickFull, prevTickFull, 'b')
  const winnerA = raceData?.winner_id != null && raceData.winner_id === raceData?.car_a?.id
  const winnerB = raceData?.winner_id != null && raceData.winner_id === raceData?.car_b?.id

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000000', color: TEXT,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}.blink{animation:blink 1s step-end infinite}`}</style>

      {/* ── Background ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(245,245,240,0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(245,245,240,0.04) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '40px 40px',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(245,245,240,0.05) 0, rgba(245,245,240,0.05) 4px, transparent 4px, transparent 12px)',
        }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 80, width: 1, background: 'rgba(245,245,240,0.08)' }} />
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 74, width: 12,
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 119px, rgba(245,245,240,0.08) 119px, rgba(245,245,240,0.08) 120px)',
        }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 80, width: 1, background: 'rgba(245,245,240,0.08)' }} />
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 74, width: 12,
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 119px, rgba(245,245,240,0.08) 119px, rgba(245,245,240,0.08) 120px)',
        }} />
        <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '1px solid rgba(220,38,38,0.6)', borderLeft: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTop: '1px solid rgba(220,38,38,0.6)', borderRight: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottom: '1px solid rgba(220,38,38,0.6)', borderLeft: '1px solid rgba(220,38,38,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '1px solid rgba(220,38,38,0.6)', borderRight: '1px solid rgba(220,38,38,0.6)' }} />
      </div>

      {/* ── Top HUD ── */}
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
          1/4 MILE · SIDE BY SIDE · DIG START
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase' }}>SYS — READY</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em' }}>·</span>
          <span className="rec-pulse" style={{ color: ACCENT, fontSize: 8, lineHeight: 1 }}>●</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase' }}>REC</span>
        </span>
      </div>

      {/* ── Playback header ── */}
      {hasRace && (
        <PlaybackHeader
          tick={raceData.telemetry[Math.min(frame, raceData.telemetry.length - 1)]}
          paused={paused || raceState === 'done'}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
          onPrev={handlePrev}
          onNext={handleNext}
          speedIdx={speedIdx}
          onCycleSpeed={() => setSpeedIdx(i => (i + 1) % SPEED_VALS.length)}
        />
      )}

      {/* ── Drag strip viz ── */}
      <div style={{
        height: '22vh', flexShrink: 0,
        position: 'relative', zIndex: 5,
        borderBottom: '1px solid rgba(245,245,240,0.07)',
        overflow: 'hidden',
      }}>
        {[0.52, 0.62, 0.72, 0.82, 0.91].map((yPct, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${yPct * 100}%`, left: 0, right: 0, height: 1,
            backgroundImage: `repeating-linear-gradient(90deg, rgba(245,245,240,${(0.02 + i * 0.006).toFixed(3)}) 0, rgba(245,245,240,${(0.02 + i * 0.006).toFixed(3)}) 8px, transparent 8px, transparent 24px)`,
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(245,245,240,0.07) 0, rgba(245,245,240,0.07) 4px, transparent 4px, transparent 16px)',
        }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: '#DC2626' }} />
        <span style={{ position: 'absolute', left: 6, top: 7, fontFamily: MONO, fontSize: 10, color: '#DC2626', letterSpacing: '0.15em', textTransform: 'uppercase' }}>START</span>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 1, background: 'rgba(245,245,240,0.6)' }} />
        <span style={{ position: 'absolute', right: 6, top: 7, fontFamily: MONO, fontSize: 10, color: 'rgba(245,245,240,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>FINISH</span>
        {[{ pct: 25, label: '330 FT' }, { pct: 50, label: '660 FT' }, { pct: 75, label: '1000 FT' }].map(({ pct, label }) => (
          <div key={pct} style={{ position: 'absolute', left: `${pct}%`, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
            <span style={{ fontFamily: MONO, fontSize: 8, color: 'rgba(245,245,240,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', marginBottom: 3 }}>{label}</span>
            <div style={{ width: 1, height: 8, background: 'rgba(245,245,240,0.14)' }} />
          </div>
        ))}
        <span style={{ position: 'absolute', right: 6, bottom: 14, fontFamily: MONO, fontSize: 8, color: 'rgba(245,245,240,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>1/4 MILE</span>

        {/* Lane A car */}
        {(() => {
          const live = raceData && frame < raceData.telemetry.length
          const tick = live ? raceData.telemetry[frame] : null
          const pctA = tick ? Math.max(0.3, Math.min((tick.dist_a_ft / 1320) * 96, 94)) : 0.3
          return (
            <div style={{
              position: 'absolute',
              left: live ? `${pctA}%` : 4,
              top: '25%', transform: 'translateY(-50%)',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: live ? 'left 0.05s linear' : 'none',
            }}>
              <CarCoupe strokeColor={carA ? '#DC2626' : 'rgba(220,38,38,0.22)'} />
              {!live && (
                <span style={{ fontFamily: MONO, fontSize: 10, color: carA ? 'rgba(220,38,38,0.72)' : 'rgba(220,38,38,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
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
              top: '75%', transform: 'translateY(-50%)',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: live ? 'left 0.05s linear' : 'none',
            }}>
              <CarCoupe strokeColor={carB ? 'rgba(245,245,240,0.65)' : 'rgba(245,245,240,0.15)'} />
              {!live && (
                <span style={{ fontFamily: MONO, fontSize: 10, color: carB ? 'rgba(245,245,240,0.42)' : 'rgba(245,245,240,0.18)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {`LANE 02 — ${carB ? `${carB.year} ${carB.make} ${carB.model}` : 'EMPTY'}`}
                </span>
              )}
            </div>
          )
        })()}
      </div>

      {/* ── Timeline scrubber ── */}
      {hasRace && (
        <TimelineScrubber
          telemetry={raceData.telemetry}
          frame={Math.min(frame, raceData.telemetry.length - 1)}
          onScrub={handleScrub}
        />
      )}

      {/* ── Race params toolbar ── */}
      <div style={{
        height: '8vh', minHeight: 60, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(220,38,38,0.4)',
        borderBottom: '1px solid rgba(220,38,38,0.4)',
        background: 'rgba(0,0,0,0.4)',
      }}>
        {/* Centered params */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <SegmentedParam label="DISTANCE" options={DIST_VALS}  activeIdx={distIdx}  onSelect={setDistIdx}  locked={raceState !== 'idle'} />
          <SegmentedParam label="START"    options={START_VALS} activeIdx={startIdx} onSelect={setStartIdx} locked={raceState !== 'idle'} />
          <SegmentedParam label="SURFACE"  options={SURF_VALS}  activeIdx={surfIdx}  onSelect={setSurfIdx}  locked={raceState !== 'idle'} />
          <StatParam label="DA"   value="56 FT" />
          <StatParam label="WIND" value="0 MPH" />
        </div>

        {/* Right-aligned CTA */}
        <div style={{ position: 'absolute', right: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          {error && (
            <span style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em' }}>{error}</span>
          )}
          {raceState === 'racing' || raceState === 'loading' ? (
            <span style={{ fontFamily: DISPLAY, fontSize: 22, letterSpacing: '0.04em', textTransform: 'uppercase', color: DIM, opacity: 0.5, display: 'flex', alignItems: 'center', userSelect: 'none' }}>
              {'>'} {raceState === 'loading' ? 'LOADING...' : 'RACING...'}
            </span>
          ) : raceState === 'done' ? (
            <span onClick={handleRaceAgain} style={{ fontFamily: DISPLAY, fontSize: 22, letterSpacing: '0.04em', textTransform: 'uppercase', color: ACCENT, cursor: 'pointer', display: 'flex', alignItems: 'center', userSelect: 'none' }}>
              <span className="blink" style={{ marginRight: 6 }}>{'>'}</span>
              RACE AGAIN
              <span className="blink" style={{ animationDelay: '0.5s', marginLeft: 2 }}>_</span>
            </span>
          ) : (
            <span onClick={ready ? handleStart : undefined} style={{ fontFamily: DISPLAY, fontSize: 22, letterSpacing: '0.04em', textTransform: 'uppercase', color: ACCENT, opacity: ready ? 1 : 0.2, cursor: ready ? 'pointer' : 'default', display: 'flex', alignItems: 'center', userSelect: 'none' }}>
              <span className="blink" style={{ marginRight: 6 }}>{'>'}</span>
              START RACE
              <span className="blink" style={{ animationDelay: '0.5s', marginLeft: 2 }}>_</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Lane panels ── */}
      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr',
        position: 'relative', zIndex: 5, minHeight: 0, overflow: 'hidden',
      }}>
        <CarPanel
          side="a"
          onCarChange={handleCarAChange}
          racePhase={raceState}
          tick={currentTickFull}
          gForce={gForceA}
          milestones={milestones.a}
          isWinner={winnerA}
          onReplay={handleRestart}
        />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(245,245,240,0.06)', zIndex: 1, pointerEvents: 'none' }} />
        <CarPanel
          side="b"
          onCarChange={handleCarBChange}
          racePhase={raceState}
          tick={currentTickFull}
          gForce={gForceB}
          milestones={milestones.b}
          isWinner={winnerB}
          onReplay={handleRestart}
        />
      </div>

      {/* ── Bottom HUD ── */}
      {(() => {
        const live = raceState === 'racing' || raceState === 'done'
        const tick = raceData && frame < raceData.telemetry.length ? raceData.telemetry[frame] : null
        const fmt3   = v => v != null ? v.toFixed(3) : '—'
        const fmtMph = v => v != null ? Math.round(v).toString().padStart(3, '0') : '—'
        const etA    = live ? (milestones.a.et     != null ? milestones.a.et.toFixed(3)    : (tick ? tick.time_s.toFixed(3) : '0.000')) : '0.000'
        const etB    = live ? (milestones.b.et     != null ? milestones.b.et.toFixed(3)    : (tick ? tick.time_s.toFixed(3) : '0.000')) : '0.000'
        const sixtyA = live ? fmt3(milestones.a.sixty)  : '0.000'
        const sixtyB = live ? fmt3(milestones.b.sixty)  : '0.000'
        const eighthA = live ? fmt3(milestones.a.eighth) : '0.000'
        const eighthB = live ? fmt3(milestones.b.eighth) : '0.000'
        const trapA  = live ? fmtMph(milestones.a.trap) : '000'
        const trapB  = live ? fmtMph(milestones.b.trap) : '000'
        return (
          <div style={{ height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, borderTop: '1px solid rgba(245,245,240,0.05)' }}>
            <span style={{ position: 'absolute', left: 24, fontFamily: MONO, fontSize: 11, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              LANE <span style={{ color: 'rgba(220,38,38,0.7)' }}>01</span>{' · '}LANE <span style={{ color: 'rgba(245,245,240,0.35)' }}>02</span>
            </span>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 0 }}>
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
