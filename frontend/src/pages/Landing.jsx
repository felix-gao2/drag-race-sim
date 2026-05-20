import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

      {/* eyebrow */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
      }}>
        ¼ mile · side by side · dig start
      </p>

      {/* headline */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(4rem, 14vw, 10rem)',
        fontWeight: 900,
        lineHeight: 0.9,
        letterSpacing: '-0.02em',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: 'var(--color-text)',
        margin: 0,
      }}>
        Drag
        <br />
        <span style={{ color: 'var(--color-yellow)' }}>Race</span>
        <br />
        Sim
      </h1>

      {/* divider */}
      <div style={{
        width: '4rem',
        height: '2px',
        background: 'var(--color-border)',
        margin: '2rem 0',
      }} />

      {/* description */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1.0625rem',
        color: 'var(--color-muted)',
        textAlign: 'center',
        maxWidth: '26rem',
        lineHeight: 1.6,
        margin: '0 0 2.5rem',
      }}>
        Pick any two cars. Put them on the quarter mile. See who wins.
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate('/race')}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background: 'var(--color-yellow)',
          color: '#0B0B0B',
          border: 'none',
          padding: '0.875rem 2.5rem',
          cursor: 'pointer',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Get Started →
      </button>
    </div>
  )
}
