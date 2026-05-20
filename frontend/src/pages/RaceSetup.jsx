import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarPanel from '../components/CarPanel'
import { postRace } from '../api'

function Chip({ label }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--color-muted)',
      border: '1px solid var(--color-border)',
      padding: '0.3rem 0.75rem',
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
      padding: '2rem',
      maxWidth: '72rem',
      margin: '0 auto',
      gap: '1.5rem',
    }}>
      {/* settings chips */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Chip label="Distance: ¼ mile" />
        <Chip label="Start: dig" />
      </div>

      {/* car panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        flex: 1,
      }}>
        <CarPanel side="a" onCarChange={setCarA} />
        <CarPanel side="b" onCarChange={setCarB} />
      </div>

      {/* start race */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        {error && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-car-a)',
          }}>
            {error}
          </p>
        )}
        <button
          onClick={handleStart}
          disabled={!ready || submitting}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            background: ready ? 'var(--color-yellow)' : 'var(--color-surface-2)',
            color: ready ? '#0B0B0B' : 'var(--color-muted)',
            border: 'none',
            padding: '1rem 3.5rem',
            cursor: ready ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s, color 0.2s, opacity 0.15s',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Starting…' : 'Start Race →'}
        </button>
        {!ready && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            color: 'var(--color-muted)',
            margin: 0,
          }}>
            Select both cars to continue
          </p>
        )}
      </div>
    </div>
  )
}
