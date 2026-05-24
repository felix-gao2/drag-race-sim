import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarPanel from '../components/CarPanel'
import { postRace } from '../api'

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
    <span
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: MONO,
        fontSize: 12,
        color: hov ? ACCENT : DIM,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'color 0.1s',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}:{' '}
      <span style={{ color: hov ? ACCENT : TEXT }}>{value}</span>
    </span>
  )
}

function Dot() {
  return (
    <span style={{
      fontFamily: MONO,
      fontSize: 12,
      color: 'rgba(245,245,240,0.15)',
      margin: '0 10px',
      userSelect: 'none',
    }}>·</span>
  )
}

export default function RaceSetup() {
  const navigate = useNavigate()
  const [carA, setCarA] = useState(null)
  const [carB, setCarB] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [distIdx, setDistIdx] = useState(0)
  const [startIdx, setStartIdx] = useState(0)
  const [surfIdx, setSurfIdx] = useState(0)

  const ready = carA !== null && carB !== null

  async function handleStart() {
    if (!ready || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const { slug } = await postRace(carA.id, carB.id)
      navigate(`/race/${slug}`)
    } catch {
      setError('Failed to start race. Is the server running?')
      setSubmitting(false)
    }
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

        {/* Lane A car — top lane, at start line */}
        <div style={{
          position: 'absolute', left: 4, top: '25%',
          transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <CarCoupe strokeColor={carA ? '#DC2626' : 'rgba(220,38,38,0.22)'} />
          <span style={{
            fontFamily: MONO, fontSize: 10,
            color: carA ? 'rgba(220,38,38,0.72)' : 'rgba(220,38,38,0.28)',
            letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            {`LANE 01 — ${carA ? `${carA.year} ${carA.make} ${carA.model}` : 'EMPTY'}`}
          </span>
        </div>

        {/* Lane B car — bottom lane, at start line */}
        <div style={{
          position: 'absolute', left: 4, top: '75%',
          transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <CarCoupe strokeColor={carB ? 'rgba(245,245,240,0.65)' : 'rgba(245,245,240,0.15)'} />
          <span style={{
            fontFamily: MONO, fontSize: 10,
            color: carB ? 'rgba(245,245,240,0.42)' : 'rgba(245,245,240,0.18)',
            letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            {`LANE 02 — ${carB ? `${carB.year} ${carB.make} ${carB.model}` : 'EMPTY'}`}
          </span>
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
        <CarPanel side="a" onCarChange={setCarA} />

        {/* center divider */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          width: 1, background: 'rgba(245,245,240,0.06)',
          zIndex: 1, pointerEvents: 'none',
        }} />

        <CarPanel side="b" onCarChange={setCarB} />
      </div>

      {/* ── Race params toolbar ── */}
      <div style={{
        height: '5vh', minHeight: 44, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(245,245,240,0.05)',
        borderBottom: '1px solid rgba(220,38,38,0.2)',
        background: 'rgba(0,0,0,0.4)',
      }}>

        {/* Left: cycling params */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', userSelect: 'none' }}>
            DA: <span style={{ color: TEXT }}>56 FT</span>
          </span>
          <Dot />
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', userSelect: 'none' }}>
            WIND: <span style={{ color: TEXT }}>0 MPH</span>
          </span>
        </div>

        {/* Right: START RACE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {error && (
            <span style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em' }}>
              {error}
            </span>
          )}
          <span
            onClick={ready && !submitting ? handleStart : undefined}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              opacity: ready ? (submitting ? 0.6 : 1) : 0.2,
              cursor: ready && !submitting ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              userSelect: 'none',
              color: TEXT,
            }}
          >
            <span className="blink" style={{ color: ACCENT, marginRight: 5 }}>{'>'}</span>
            {submitting ? 'STARTING' : 'START RACE'}
            <span className="blink" style={{ color: ACCENT, animationDelay: '0.5s', marginLeft: 1 }}>_</span>
          </span>
        </div>
      </div>

      {/* ── Bottom HUD bar ── */}
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
          fontFamily: MONO, fontSize: 11, color: DIM,
          letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'pre',
        }}>
          {'ET 0.000s   ·   60FT 0.000   ·   1/8 0.000s   ·   TRAP 000 MPH'}
        </span>
      </div>

    </div>
  )
}
