import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarPanel from '../components/CarPanel'
import { postRace } from '../api'

const MONO = `'JetBrains Mono', monospace`
const CAR_COUNT = 1017

function Chip({ label }) {
  return (
    <span style={{
      fontFamily: MONO,
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#525252',
      border: '1px solid #262626',
      borderRadius: '999px',
      padding: '5px 14px',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
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
    } catch (e) {
      setError('Failed to start race. Is the server running?')
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a',
      color: '#f5f5f4',
      position: 'relative',
    }}>

      {/* ── Background: perspective grid (same as Landing) ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(to right, rgba(250,204,21,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(250,204,21,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        transform: 'perspective(800px) rotateX(60deg) scale(2)',
        transformOrigin: 'center bottom',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
        animation: 'gridScroll 8s linear infinite',
        willChange: 'background-position',
      }} />

      {/* ── Background: corner vignette ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
      }} />

      {/* ── Top status bar ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #191919',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          v0.1.0 // {CAR_COUNT} CARS
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          ¼ MILE · SIDE BY SIDE · DIG START
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', flexShrink: 0, animation: 'sysBlink 1.6s ease-in-out infinite' }} />
          <span style={{ fontFamily: MONO, fontSize: 11, color: '#525252', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            SYS — READY
          </span>
        </span>
      </div>

      {/* ── 3-band grid ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateRows: '35vh auto 1fr',
        position: 'relative',
        zIndex: 5,
        minHeight: 0,
      }}>

        {/* ─────────────────────────────────────── */}
        {/* BAND 1: Dragstrip preview               */}
        {/* ─────────────────────────────────────── */}
        <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid #191919' }}>

          {/* Asphalt floor with perspective */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '300%',
            transform: 'perspective(540px) rotateX(70deg)',
            transformOrigin: 'bottom center',
            background: '#0d0d0d',
          }} />

          {/* Track grid lines on floor */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '300%',
            transform: 'perspective(540px) rotateX(70deg)',
            transformOrigin: 'bottom center',
            backgroundImage: `
              linear-gradient(to right, #1e1e1e 1px, transparent 1px),
              linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            animation: 'gridScroll 3s linear infinite',
            willChange: 'background-position',
          }} />

          {/* Lane A color wash — left half */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(220,38,38,0.07) 0%, rgba(220,38,38,0.07) 50%, transparent 50%)',
            pointerEvents: 'none',
          }} />

          {/* Lane B color wash — right half */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, transparent 50%, rgba(51,153,255,0.07) 50%)',
            pointerEvents: 'none',
          }} />

          {/* Center divider */}
          <div style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: '50%',
            width: 1,
            background: '#1c1c1c',
            transform: 'translateX(-50%)',
          }} />

          {/* Starting line (bi-color) */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 3,
            background: 'linear-gradient(to right, #dc2626 0 50%, #3399ff 50% 100%)',
          }} />

          {/* Top sky fade */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '55%',
            background: 'linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Horizon glow */}
          <div style={{
            position: 'absolute',
            top: '40%', left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(250,204,21,0.08), transparent)',
          }} />

          {/* ¼ MILE label — top center */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: MONO,
            fontSize: 10,
            color: '#2e2e2e',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            1320 FT — QUARTER MILE
          </div>

          {/* Lane A label */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: '25%',
            transform: 'translateX(-50%)',
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(220,38,38,0.35)',
          }}>
            LANE A
          </div>

          {/* Lane B label */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: '75%',
            transform: 'translateX(-50%)',
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(51,153,255,0.35)',
          }}>
            LANE B
          </div>
        </div>

        {/* ─────────────────────────────────────── */}
        {/* BAND 2: Settings                        */}
        {/* ─────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 24px',
          height: 80,
          borderBottom: '1px solid #191919',
          flexShrink: 0,
          position: 'relative',
          zIndex: 5,
          background: 'rgba(10,10,10,0.7)',
        }}>
          {/* Pill chips */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <Chip label="¼ Mile" />
            <Chip label="Dig Start" />
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 20, background: '#1f1f1f', flexShrink: 0 }} />

          {/* Tagline */}
          <span style={{
            fontFamily: MONO,
            fontSize: 11,
            color: '#2e2e2e',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            flex: 1,
          }}>
            PICK TWO · RUN THE QUARTER · SEE WHO WINS
          </span>

          {/* Error */}
          {error && (
            <span style={{ fontFamily: MONO, fontSize: 10, color: '#dc2626', letterSpacing: '0.1em', flexShrink: 0 }}>
              {error}
            </span>
          )}

          {/* Start Race CTA */}
          <button
            onClick={handleStart}
            disabled={!ready || submitting}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background: ready ? '#dc2626' : 'transparent',
              color: ready ? '#0a0a0a' : '#383838',
              border: ready ? 'none' : '1px solid #242424',
              borderRadius: 0,
              padding: '12px 28px',
              cursor: ready ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s, color 0.15s',
              opacity: submitting ? 0.6 : 1,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (ready && !submitting) e.currentTarget.style.background = '#ef4444' }}
            onMouseLeave={e => { if (ready) e.currentTarget.style.background = '#dc2626' }}
          >
            {submitting ? 'Starting…' : 'Start Race →'}
          </button>
        </div>

        {/* ─────────────────────────────────────── */}
        {/* BAND 3: Car panels                     */}
        {/* ─────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: 0,
          overflow: 'auto',
        }}>
          <div style={{ borderRight: '1px solid #191919' }}>
            <CarPanel side="a" onCarChange={setCarA} />
          </div>
          <div>
            <CarPanel side="b" onCarChange={setCarB} />
          </div>
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: '#060606',
        borderTop: '1px solid #131313',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#383838', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {ready
            ? `${carA.year} ${carA.make} ${carA.model}  ·  vs  ·  ${carB.year} ${carB.make} ${carB.model}`
            : 'SELECT BOTH CARS TO RACE'
          }
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: '#383838', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {ready ? 'READY' : `${(carA ? 1 : 0) + (carB ? 1 : 0)} / 2 SELECTED`}
        </span>
      </div>

    </div>
  )
}
