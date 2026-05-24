import { useState, useEffect, useRef } from 'react'
import { getMakes, getModels, getYears, getTrims, getCar } from '../api'

const MONO = `'JetBrains Mono', monospace`
const TEXT = '#F5F5F0'
const DIM  = 'rgba(245,245,240,0.35)'

function TerminalSelect({ label, value, options, disabled, onChange, accentColor, getLabel }) {
  const [open, setOpen] = useState(false)
  const [hov,  setHov]  = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const isRed      = accentColor === '#DC2626'
  const dimBorder  = isRed ? 'rgba(220,38,38,0.3)' : 'rgba(245,245,240,0.3)'
  const fullBorder = isRed ? 'rgba(220,38,38,0.9)' : 'rgba(245,245,240,0.8)'
  const active     = open || hov

  const displayValue = value != null ? (getLabel ? getLabel(value) : String(value)) : null

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        opacity: disabled ? 0.28 : 1,
        transition: 'opacity 0.15s',
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <span style={{
        fontFamily: MONO, fontSize: 10,
        color: DIM, letterSpacing: '0.22em',
        textTransform: 'uppercase',
        display: 'block', marginBottom: 6,
        userSelect: 'none',
      }}>
        {label}
      </span>

      <div
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 0',
          borderBottom: `1px solid ${active ? fullBorder : dimBorder}`,
          transition: 'border-color 0.12s',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span style={{
          fontFamily: MONO, fontSize: 12,
          color: displayValue ? TEXT : DIM,
          letterSpacing: '0.06em',
          flex: 1,
          textTransform: 'uppercase',
        }}>
          {displayValue || '—'}
        </span>
        <span
          className={open ? 'blink' : ''}
          style={{
            fontFamily: MONO, fontSize: 12,
            color: accentColor,
            opacity: open ? 0.9 : 0.4,
          }}
        >
          _
        </span>
      </div>

      {open && options.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0, right: 0,
          background: '#060606',
          border: '0.5px solid rgba(245,245,240,0.18)',
          zIndex: 200,
          maxHeight: 180,
          overflowY: 'auto',
        }}>
          {options.map((opt, i) => {
            const label = getLabel ? getLabel(opt) : String(opt)
            const selected = getLabel
              ? (value != null && getLabel(value) === label)
              : opt === value
            return (
              <div
                key={i}
                onClick={() => { onChange(opt); setOpen(false) }}
                style={{
                  padding: '9px 14px',
                  fontFamily: MONO, fontSize: 11,
                  color: selected ? accentColor : TEXT,
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderBottom: i < options.length - 1
                    ? '1px solid rgba(245,245,240,0.05)'
                    : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,245,240,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Cascade({ onSelect, accentColor }) {
  const [makes,  setMakes]  = useState([])
  const [models, setModels] = useState([])
  const [years,  setYears]  = useState([])
  const [trims,  setTrims]  = useState([])

  const [make,  setMake]  = useState(null)
  const [model, setModel] = useState(null)
  const [year,  setYear]  = useState(null)
  const [trim,  setTrim]  = useState(null)

  useEffect(() => {
    getMakes().then(setMakes).catch(() => {})
  }, [])

  useEffect(() => {
    if (!make) { setModels([]); return }
    getModels(make).then(setModels).catch(() => {})
  }, [make])

  useEffect(() => {
    if (!make || !model) { setYears([]); return }
    getYears(make, model).then(setYears).catch(() => {})
  }, [make, model])

  useEffect(() => {
    if (!make || !model || year == null) { setTrims([]); return }
    getTrims(make, model, year).then(setTrims).catch(() => {})
  }, [make, model, year])

  useEffect(() => {
    if (!trim) return
    getCar(trim.id).then(car => onSelect(car)).catch(() => {})
  }, [trim])

  function handleMake(v)  { setMake(v);  setModel(null); setYear(null); setTrim(null) }
  function handleModel(v) { setModel(v); setYear(null);  setTrim(null) }
  function handleYear(v)  { setYear(v);  setTrim(null) }
  function handleTrim(v)  { setTrim(v) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <TerminalSelect
        label="MAKE"
        value={make}
        options={makes}
        disabled={false}
        onChange={handleMake}
        accentColor={accentColor}
      />
      <TerminalSelect
        label="MODEL"
        value={model}
        options={models}
        disabled={!make}
        onChange={handleModel}
        accentColor={accentColor}
      />
      <TerminalSelect
        label="YEAR"
        value={year}
        options={years}
        disabled={!model}
        onChange={handleYear}
        accentColor={accentColor}
      />
      <TerminalSelect
        label="TRIM"
        value={trim}
        options={trims}
        disabled={year == null}
        onChange={handleTrim}
        accentColor={accentColor}
        getLabel={t => t.trim}
      />
    </div>
  )
}
