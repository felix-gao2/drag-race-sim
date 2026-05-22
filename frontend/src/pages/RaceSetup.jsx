import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarPanel from '../components/CarPanel'
import { postRace } from '../api'

const MONO = `'JetBrains Mono', monospace`
const CAR_COUNT = 1017

function CarSilhouette({ fillColor, strokeColor }) {
  return (
    <svg
      viewBox="0 0 260 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: '7vh', width: 'auto', display: 'block', transform: 'scaleX(-1)' }}
      aria-hidden="true"
    >
      {/* Front wing */}
      <polygon
        points="5,58 66,54 66,63 5,67"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Main body */}
      <path
        d="M 22,60 L 30,46 L 40,36 L 68,30 L 88,26 L 104,22 L 120,19 L 138,22 L 162,26 L 198,30 L 224,34 L 238,42 L 240,60 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Rear wing pillar */}
      <rect x="228" y="20" width="5" height="14" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
      {/* Rear wing blade */}
      <rect x="214" y="16" width="34" height="6" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
      {/* Front wheel */}
      <circle cx="66" cy="62" r="10" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="66" cy="62" r="3.5" fill="none" stroke={strokeColor} strokeWidth="1" />
      {/* Rear wheel */}
      <circle cx="210" cy="62" r="12" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="210" cy="62" r="4.5" fill="none" stroke={strokeColor} strokeWidth="1" />
    </svg>
  )
}

function Chip({ label }) {
  return (
    <span style={{
      fontFamily: MONO,
      fontSize: 11,
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: '#a3a3a3',
      border: '1px solid #2a2a2a',
      borderRadius: 2,
      background: 'rgba(255,255,255,0.02)',
      padding: '10px 18px',
      whiteSpace: 'nowrap',
      display: 'inline-block',
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
  const [btnHover, setBtnHover] = useState(false)

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
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #191919',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        }}>

          {/* Lane divider at 60% */}
          <div style={{
            position: 'absolute',
            top: '60%',
            left: 0, right: 0,
            height: 1,
            backgroundImage: 'repeating-linear-gradient(to right, #2a2a2a 0 40px, transparent 40px 80px)',
          }} />

          {/* Lane divider at 80% */}
          <div style={{
            position: 'absolute',
            top: '80%',
            left: 0, right: 0,
            height: 1,
            backgroundImage: 'repeating-linear-gradient(to right, #2a2a2a 0 40px, transparent 40px 80px)',
          }} />

          {/* START line */}
          <div style={{
            position: 'absolute',
            left: '8%',
            top: 0, bottom: 0,
            width: 1,
            background: '#facc15',
          }} />
          <span style={{
            position: 'absolute',
            left: '8%',
            top: 14,
            transform: 'translateX(-50%)',
            fontFamily: MONO,
            fontSize: 9,
            color: '#facc15',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            START
          </span>

          {/* FINISH line */}
          <div style={{
            position: 'absolute',
            left: '92%',
            top: 0, bottom: 0,
            width: 1,
            background: '#dc2626',
          }} />
          <span style={{
            position: 'absolute',
            left: '92%',
            top: 14,
            transform: 'translateX(-50%)',
            fontFamily: MONO,
            fontSize: 9,
            color: '#dc2626',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            FINISH
          </span>

          {/* Car A — top lane, ~50% vertical */}
          <div style={{
            position: 'absolute',
            left: '9%',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
          }}>
            {carA ? (
              <img
                src="/cars/placeholder-car.svg"
                style={{ height: '7vh', width: 'auto', display: 'block' }}
                alt=""
              />
            ) : (
              <CarSilhouette
                fillColor="rgba(220,38,38,0.2)"
                strokeColor="rgba(220,38,38,1)"
              />
            )}
            <span style={{
              fontFamily: MONO,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: carA ? '#dc2626' : '#525252',
              whiteSpace: 'nowrap',
            }}>
              {carA ? `${carA.year} ${carA.make} ${carA.model}` : '—— EMPTY ——'}
            </span>
          </div>

          {/* Car B — bottom lane, ~70% vertical */}
          <div style={{
            position: 'absolute',
            left: '9%',
            top: '70%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
          }}>
            {carB ? (
              <img
                src="/cars/placeholder-car.svg"
                style={{
                  height: '7vh',
                  width: 'auto',
                  display: 'block',
                  filter: 'hue-rotate(220deg) saturate(1.2) brightness(1.1)',
                }}
                alt=""
              />
            ) : (
              <CarSilhouette
                fillColor="rgba(59,130,246,0.2)"
                strokeColor="rgba(59,130,246,1)"
              />
            )}
            <span style={{
              fontFamily: MONO,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: carB ? '#3b82f6' : '#525252',
              whiteSpace: 'nowrap',
            }}>
              {carB ? `${carB.year} ${carB.make} ${carB.model}` : '—— EMPTY ——'}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────── */}
        {/* BAND 2: Settings                        */}
        {/* ─────────────────────────────────────── */}
        <div style={{
          height: 80,
          borderTop: '1px solid #1f1f1f',
          borderBottom: '1px solid #1f1f1f',
          display: 'grid',
          gridTemplateColumns: '40% 20% 40%',
          alignItems: 'center',
          padding: '0 24px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 5,
        }}>
          {/* Left: pill chips */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Chip label="DISTANCE · ¼ MILE" />
            <Chip label="START · DIG" />
          </div>

          {/* Center: tagline */}
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontFamily: MONO,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: '#525252',
              whiteSpace: 'nowrap',
            }}>
              SELECT YOUR CONTENDERS · QUARTER MILE · WINNER TAKES ALL
            </span>
          </div>

          {/* Right: reserved */}
          <div />
        </div>

        {/* ─────────────────────────────────────── */}
        {/* BAND 3: Car panels + Start CTA         */}
        {/* ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>

          {/* Car panels */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}>
            <CarPanel side="a" onCarChange={setCarA} />
            <CarPanel side="b" onCarChange={setCarB} />
          </div>

          {/* Start Race CTA */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            paddingTop: 24,
            paddingBottom: 28,
            flexShrink: 0,
          }}>
            <div style={{ animation: ready && !submitting ? 'fadeIn 0.3s ease both' : 'none' }}>
              <button
                onClick={handleStart}
                disabled={!ready || submitting}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  fontFamily: MONO,
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  background: ready ? '#dc2626' : '#1f1f1f',
                  color: ready ? '#0a0a0a' : '#525252',
                  border: 'none',
                  borderRadius: 0,
                  padding: '18px 64px',
                  width: 400,
                  cursor: ready ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s',
                  opacity: submitting ? 0.6 : 1,
                  animation: ready && !submitting && !btnHover
                    ? 'ctaPulse 2.4s ease-in-out infinite'
                    : 'none',
                }}
              >
                {submitting ? 'Starting…' : 'START RACE'}
              </button>
            </div>
            <span style={{
              fontFamily: MONO,
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#525252',
            }}>
              {ready ? 'READY TO RACE' : 'SELECT BOTH CARS TO CONTINUE'}
            </span>
            {error && (
              <span style={{ fontFamily: MONO, fontSize: 10, color: '#dc2626', letterSpacing: '0.1em' }}>
                {error}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: '#060606',
        borderTop: '1px solid #131313',
        padding: '0 24px',
        height: 44,
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
          {(carA ? 1 : 0) + (carB ? 1 : 0)} / 2 SELECTED
        </span>
      </div>

    </div>
  )
}
