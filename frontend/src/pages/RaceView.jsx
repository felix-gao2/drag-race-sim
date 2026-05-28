import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRace } from '../api'
import TelemetryChart from '../components/TelemetryChart'

const ACCENT = { a: 'var(--color-car-a)', b: 'var(--color-car-b)' }

function carLabel(car) {
  return `${car.year} ${car.make} ${car.model}`
}

// ── DriveStrip ────────────────────────────────────────────────────────────────

const OUTER_LINE  = 'rgba(245,245,240,0.06)'
const DIVIDER_CLR = 'rgba(245,245,240,0.12)'

function LaneLabel({ side, car, done }) {
  const accent = ACCENT[side]
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: accent,
      }}>
        {carLabel(car)}
      </span>
      {done && (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: accent,
        }}>
          FINISHED
        </span>
      )}
    </div>
  )
}

function DriveStrip({ distAFt, distBFt }) {
  const pctA = Math.max(2, Math.min((distAFt / 1320) * 100, 97))
  const pctB = Math.max(2, Math.min((distBFt / 1320) * 100, 97))

  return (
    <div style={{
      position: 'relative',
      height: '8rem',
      background: '#000000',
      overflow: 'hidden',
    }}>
      {/* outer boundary — top edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 1, background: OUTER_LINE,
      }} />
      {/* outer boundary — bottom edge */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 1, background: OUTER_LINE,
      }} />
      {/* center divider — dashed 8px/8px */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: 1,
        backgroundImage: `repeating-linear-gradient(90deg, ${DIVIDER_CLR} 0px, ${DIVIDER_CLR} 8px, transparent 8px, transparent 16px)`,
      }} />
      {/* start line */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 2, background: 'rgba(245,245,240,0.1)',
      }} />
      {/* finish line */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 3, background: 'var(--color-yellow)',
      }} />

      {/* car A — LANE 01 (top half, centered at 25%) */}
      <div style={{
        position: 'absolute',
        left: `${pctA}%`,
        top: '25%',
        transform: 'translate(-50%, -50%)',
        width: '3.5rem',
        height: '2rem',
        background: ACCENT.a,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: '0.85rem',
        color: '#0B0B0B',
        transition: 'left 0.05s linear',
        letterSpacing: '0.05em',
      }}>
        A
      </div>

      {/* car B — LANE 02 (bottom half, centered at 75%) */}
      <div style={{
        position: 'absolute',
        left: `${pctB}%`,
        top: '75%',
        transform: 'translate(-50%, -50%)',
        width: '3.5rem',
        height: '2rem',
        background: ACCENT.b,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: '0.85rem',
        color: '#0B0B0B',
        transition: 'left 0.05s linear',
        letterSpacing: '0.05em',
      }}>
        B
      </div>
    </div>
  )
}

// ── Results ───────────────────────────────────────────────────────────────────

function StatRow({ label, a, b }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.5rem 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        color: 'var(--color-text)',
        textAlign: 'right',
      }}>{a}</span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-muted)',
        textAlign: 'center',
        minWidth: '5rem',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        color: 'var(--color-text)',
        textAlign: 'left',
      }}>{b}</span>
    </div>
  )
}

function Results({ carA, carB, winnerId, marginSec, telemetry, onRaceAgain }) {
  const [copied, setCopied] = useState(false)

  const winnerSide = winnerId === carA.id ? 'a' : winnerId === carB.id ? 'b' : null
  const winnerCar  = winnerSide === 'a' ? carA : carB
  const deadHeat   = marginSec < 0.05

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>
      {/* winner banner */}
      <div style={{
        background: 'var(--color-surface)',
        border: `1px solid var(--color-border)`,
        borderTop: `3px solid ${winnerSide ? ACCENT[winnerSide] : 'var(--color-yellow)'}`,
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
      }}>
        {deadHeat ? (
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: 'var(--color-yellow)',
            margin: 0,
          }}>
            Dead Heat
          </p>
        ) : (
          <>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.75rem',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              color: winnerSide ? ACCENT[winnerSide] : 'var(--color-text)',
              margin: '0 0 0.25rem',
            }}>
              {carLabel(winnerCar)} wins
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--color-muted)',
              margin: 0,
            }}>
              by {marginSec.toFixed(3)} s
            </p>
          </>
        )}
      </div>

      {/* stats comparison */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '1rem 1.5rem',
      }}>
        {/* column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '1rem',
          marginBottom: '0.5rem',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-car-a)', textAlign: 'right' }}>
            Car A
          </span>
          <span style={{ minWidth: '5rem' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-car-b)', textAlign: 'left' }}>
            Car B
          </span>
        </div>
        <StatRow label="0–60 mph" a={`${carA.zero_to_sixty}s`} b={`${carB.zero_to_sixty}s`} />
        <StatRow label="¼ mile"   a={`${carA.quarter_mile}s`}  b={`${carB.quarter_mile}s`} />
        <StatRow
          label="trap"
          a={carA.trap_mph != null ? `${carA.trap_mph} mph` : '—'}
          b={carB.trap_mph != null ? `${carB.trap_mph} mph` : '—'}
        />
      </div>

      {/* chart */}
      <TelemetryChart
        telemetry={telemetry}
        labelA={carLabel(carA)}
        labelB={carLabel(carB)}
      />

      {/* actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button
          onClick={onRaceAgain}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: 'none',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            padding: '0.75rem 2rem',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-muted)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          Race Again
        </button>
        <button
          onClick={handleShare}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: copied ? 'var(--color-surface-2)' : 'var(--color-yellow)',
            color: copied ? 'var(--color-muted)' : '#0B0B0B',
            border: 'none',
            padding: '0.75rem 2rem',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {copied ? 'Copied!' : 'Share ↗'}
        </button>
      </div>
    </div>
  )
}

// ── RaceView ──────────────────────────────────────────────────────────────────

export default function RaceView() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [frame, setFrame]     = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    getRace(slug)
      .then(setData)
      .catch(() => setError('Race not found or server unavailable.'))
      .finally(() => setLoading(false))
  }, [slug])

  // animation loop — advance one telemetry frame every 50ms
  useEffect(() => {
    if (!data || finished) return
    const id = setInterval(() => {
      setFrame(f => {
        const next = f + 1
        if (next >= data.telemetry.length) {
          setFinished(true)
          return f
        }
        return next
      })
    }, 50)
    return () => clearInterval(id)
  }, [data, finished])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>Loading race…</p>
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-car-a)' }}>{error}</p>
      <button onClick={() => navigate('/race')} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', color: 'var(--color-text)', border: '1px solid var(--color-border)', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>
        Back
      </button>
    </div>
  )

  const { car_a, car_b, telemetry, winner_id, margin_sec } = data
  const tick = telemetry[frame]

  // determine which cars have crossed 1320ft
  const lastTick = telemetry[telemetry.length - 1]
  const aDone = finished || tick.dist_a_ft >= 1320
  const bDone = finished || tick.dist_b_ft >= 1320

  return (
    <div style={{
      maxWidth: '52rem',
      margin: '0 auto',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    }}>
      {/* track */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <LaneLabel side="a" car={car_a} done={aDone} />
        <DriveStrip distAFt={tick.dist_a_ft} distBFt={tick.dist_b_ft} />
        <LaneLabel side="b" car={car_b} done={bDone} />
      </div>

      {/* time counter */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.5rem',
          color: finished ? 'var(--color-yellow)' : 'var(--color-muted)',
          letterSpacing: '0.05em',
          transition: 'color 0.3s',
        }}>
          {tick.time_s.toFixed(2)} s
        </span>
      </div>

      {finished && (
        <Results
          carA={car_a}
          carB={car_b}
          winnerId={winner_id}
          marginSec={margin_sec}
          telemetry={telemetry}
          onRaceAgain={() => navigate('/race')}
        />
      )}
    </div>
  )
}
