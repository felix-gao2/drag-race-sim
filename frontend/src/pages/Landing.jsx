import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MONO = `'JetBrains Mono', monospace`
const DISPLAY = `'Anton', sans-serif`
const TEXT = '#F5F5F0'
const DIM = 'rgba(245,245,240,0.4)'
const ACCENT = '#DC2626'

export default function Landing() {
  const navigate = useNavigate()
  const [ctaHover, setCtaHover] = useState(false)

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
      {/* ── fixed background structure ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>

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

        {/* left lane marker — vertical line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 80, width: 1, background: 'rgba(245,245,240,0.08)' }} />
        {/* left lane marker — ticks every 120px */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 74, width: 12,
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 119px, rgba(245,245,240,0.08) 119px, rgba(245,245,240,0.08) 120px)',
        }} />

        {/* right lane marker — vertical line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 80, width: 1, background: 'rgba(245,245,240,0.08)' }} />
        {/* right lane marker — ticks every 120px */}
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

      {/* subtle radial vignette, max 5% */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.05) 100%)',
      }} />

      {/* ── top HUD bar ── */}
      <div style={{
        height: 32,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative',
        zIndex: 10,
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

      {/* ── checkered micro-detail ── */}
      <svg style={{ position: 'absolute', top: 38, right: 24, zIndex: 10, pointerEvents: 'none' }} width="24" height="8">
        {Array.from({ length: 12 }, (_, i) => {
          const col = i % 6, row = Math.floor(i / 6)
          return (col + row) % 2 === 0
            ? <rect key={i} x={col * 4} y={row * 4} width="4" height="4" fill="rgba(245,245,240,0.2)" />
            : null
        })}
      </svg>

      {/* ── content group: image + headline + CTA, shifted up 6vh ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '15vh',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* ── hero image ── */}
        <div style={{ position: 'relative', width: '70vw', maxWidth: 900, aspectRatio: '5/3', overflow: 'hidden' }}>
          {/* red color bleed halo, 40px larger on each side */}
          <div style={{
            position: 'absolute',
            top: -40, left: -40, right: -40, bottom: -40,
            background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.15), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <img
            src="/hero.jpg"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 55%',
              display: 'block',
              filter: 'saturate(0.85) contrast(0.95) brightness(0.92)',
              maskImage: 'radial-gradient(ellipse 70% 65% at center, black 35%, transparent 88%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at center, black 35%, transparent 88%)',
              animation: 'heroZoom 24s ease-in-out infinite',
            }}
          />
        </div>

        {/* ── headline: sits just below image ── */}
        <div style={{ textAlign: 'center', marginTop: -16, position: 'relative', zIndex: 11 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <h1 style={{
              margin: 0,
              fontFamily: DISPLAY,
              fontWeight: 400,
              fontSize: 'clamp(72px, 9vw, 120px)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: TEXT,
              userSelect: 'none',
            }}>
              QUARTER MILE SIM
            </h1>
            <span style={{
              position: 'absolute',
              top: -8,
              right: -46,
              fontFamily: MONO,
              fontSize: 11,
              color: ACCENT,
              lineHeight: 1,
              letterSpacing: '0',
            }}>_03</span>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign: 'center', paddingTop: 24, position: 'relative', zIndex: 10 }}>
          <span
            role="button"
            tabIndex={0}
            onClick={() => navigate('/race')}
            onKeyDown={e => e.key === 'Enter' && navigate('/race')}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            style={{
              fontFamily: MONO,
              fontSize: 14,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: ctaHover ? ACCENT : TEXT,
              cursor: 'pointer',
              userSelect: 'none',
              outline: 'none',
              transition: 'color 0.1s',
            }}
          >
            <span style={{ color: ACCENT }}>{'>'}</span>
            {' SELECT CONTENDERS'}
            <span className={ctaHover ? '' : 'blink-caret'} style={{ color: ACCENT }}>_</span>
          </span>
        </div>

      </div>

      {/* ── film grain overlay ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        opacity: 0.08,
        mixBlendMode: 'overlay',
      }} />

      {/* ── bottom HUD bar ── */}
      <div style={{
        height: 32,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(220,38,38,0.2)',
      }}>
        <span style={{
          position: 'absolute',
          left: 24,
          fontFamily: MONO,
          fontSize: 11,
          color: DIM,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          LANE <span style={{ color: 'rgba(220,38,38,0.7)' }}>01</span>
          {' · '}
          LANE <span style={{ color: 'rgba(220,38,38,0.7)' }}>02</span>
        </span>
        <span style={{
          fontFamily: MONO,
          fontSize: 11,
          color: DIM,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          whiteSpace: 'pre',
        }}>
          {'ET 0.000s   ·   60FT 0.000   ·   1/8 0.000s   ·   TRAP 000 MPH'}
        </span>
      </div>
    </div>
  )
}
