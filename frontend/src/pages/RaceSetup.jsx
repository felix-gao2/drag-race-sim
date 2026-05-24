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

function CarSilhouette({ fillColor, strokeColor }) {
  return (
    <svg
      viewBox="0 0 260 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: '5vh', width: 'auto', display: 'block' }}
      aria-hidden="true"
    >
      <polygon points="5,58 66,54 66,63 5,67"
        fill={fillColor} stroke={strokeColor} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M 22,60 L 30,46 L 40,36 L 68,30 L 88,26 L 104,22 L 120,19 L 138,22 L 162,26 L 198,30 L 224,34 L 238,42 L 240,60 Z"
        fill={fillColor} stroke={strokeColor} strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="228" y="20" width="5" height="14"
        fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
      <rect x="214" y="16" width="34" height="6" rx="1"
        fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
      <circle cx="66"  cy="62" r="10"  fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="66"  cy="62" r="3.5" fill="none"      stroke={strokeColor} strokeWidth="1" />
      <circle cx="210" cy="62" r="12"  fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="210" cy="62" r="4.5" fill="none"      stroke={strokeColor} strokeWidth="1" />
    </svg>
  )
}

function ParamChip({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      padding: '0 18px',
      borderLeft: '1px solid rgba(245,245,240,0.07)',
    }}>
      <span style={{ fontFamily: MONO, fontSize: 9, color: DIM, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontFamily: MONO, fontSize: 11, color: TEXT, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {value}
      </span>
    </div>
  )
}

export default function RaceSetup() {
  const navigate = useNavigate()
  const [carA, setCarA] = useState(null)
  const [carB, setCarB] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

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
        height: '18vh', flexShrink: 0,
        position: 'relative', zIndex: 5,
        borderBottom: '1px solid rgba(245,245,240,0.07)',
        overflow: 'hidden',
      }}>

        {/* START line */}
        <div style={{
          position: 'absolute', left: 170, top: 0, bottom: 0,
          width: 1, background: 'rgba(220,38,38,0.25)',
        }} />
        <span style={{
          position: 'absolute', left: 170, top: 8,
          transform: 'translateX(-50%)',
          fontFamily: MONO, fontSize: 8,
          color: 'rgba(220,38,38,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>
          START
        </span>

        {/* Lane A — top half */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          borderBottom: '1px solid rgba(245,245,240,0.05)',
          display: 'flex', alignItems: 'center',
        }}>
          {/* Lane label */}
          <div style={{
            position: 'absolute', left: 100,
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: LANE_A, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: MONO, fontSize: 9, color: LANE_A, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.75 }}>
              LANE 01
            </span>
          </div>

          {/* Car silhouette + name */}
          <div style={{
            position: 'absolute', left: 180,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <CarSilhouette
              fillColor={carA ? 'rgba(220,38,38,0.18)' : 'rgba(220,38,38,0.06)'}
              strokeColor={carA ? 'rgba(220,38,38,0.9)' : 'rgba(220,38,38,0.3)'}
            />
            {carA && (
              <span style={{
                fontFamily: MONO, fontSize: 10,
                color: LANE_A, letterSpacing: '0.1em', textTransform: 'uppercase',
                whiteSpace: 'nowrap', opacity: 0.9,
              }}>
                {carA.year} {carA.make} {carA.model}
              </span>
            )}
          </div>
        </div>

        {/* Lane B — bottom half */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          display: 'flex', alignItems: 'center',
        }}>
          {/* Lane label */}
          <div style={{
            position: 'absolute', left: 100,
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: LANE_B, display: 'inline-block', flexShrink: 0, opacity: 0.4 }} />
            <span style={{ fontFamily: MONO, fontSize: 9, color: DIM, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
              LANE 02
            </span>
          </div>

          {/* Car silhouette + name */}
          <div style={{
            position: 'absolute', left: 180,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <CarSilhouette
              fillColor={carB ? 'rgba(245,245,240,0.12)' : 'rgba(245,245,240,0.03)'}
              strokeColor={carB ? 'rgba(245,245,240,0.7)' : 'rgba(245,245,240,0.15)'}
            />
            {carB && (
              <span style={{
                fontFamily: MONO, fontSize: 10,
                color: TEXT, letterSpacing: '0.1em', textTransform: 'uppercase',
                whiteSpace: 'nowrap', opacity: 0.75,
              }}>
                {carB.year} {carB.make} {carB.model}
              </span>
            )}
          </div>
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

      {/* ── Race params toolbar + START RACE ── */}
      <div style={{
        height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(245,245,240,0.07)',
        background: 'rgba(0,0,0,0.5)',
      }}>

        {/* Param chips */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div style={{ paddingRight: 18 }}>
            <span style={{ fontFamily: MONO, fontSize: 9, color: DIM, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
              DISTANCE
            </span>
            <span style={{ fontFamily: MONO, fontSize: 11, color: TEXT, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ¼ MILE
            </span>
          </div>
          <ParamChip label="START"    value="DIG" />
          <ParamChip label="SURFACE"  value="ASPHALT" />
          <ParamChip label="ALTITUDE" value="SEA LEVEL" />
          <ParamChip label="WIND"     value="CALM" />
        </div>

        {/* Right side: error + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {error && (
            <span style={{ fontFamily: MONO, fontSize: 10, color: ACCENT, letterSpacing: '0.1em' }}>
              {error}
            </span>
          )}

          {!ready && (
            <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              SELECT BOTH CARS
            </span>
          )}

          <button
            onClick={handleStart}
            disabled={!ready || submitting}
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              background: ready ? ACCENT : 'rgba(245,245,240,0.04)',
              color: ready ? '#000000' : 'rgba(245,245,240,0.18)',
              border: ready ? 'none' : '1px solid rgba(245,245,240,0.08)',
              borderRadius: 0,
              padding: '0 28px',
              height: 36,
              cursor: ready ? 'pointer' : 'not-allowed',
              transition: 'background 0.12s',
              opacity: submitting ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (ready) e.target.style.background = '#b91c1c' }}
            onMouseLeave={e => { if (ready) e.target.style.background = ACCENT }}
          >
            {submitting ? 'STARTING…' : 'START RACE'}
          </button>
        </div>
      </div>

      {/* ── Bottom HUD bar — identical to Landing ── */}
      <div style={{
        height: 32, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(220,38,38,0.2)',
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
