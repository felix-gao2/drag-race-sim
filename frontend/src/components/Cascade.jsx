import { useState, useEffect, useRef } from 'react'
import { getMakes, getModels, getYears, getTrims, getCar } from '../api'

const MONO = `'JetBrains Mono', monospace`
const TEXT = '#F5F5F0'
const DIM  = 'rgba(245,245,240,0.35)'

function TerminalSelect({ label, value, options, disabled, onChange, accentColor, getLabel }) {
  const [open,        setOpen]        = useState(false)
  const [hov,         setHov]         = useState(false)
  const [query,       setQuery]       = useState('')
  const [highlighted, setHighlighted] = useState(-1)
  const ref       = useRef(null)
  const searchRef = useRef(null)
  const listRef   = useRef(null)

  const isRed           = accentColor === '#DC2626'
  const dimBorder       = isRed ? 'rgba(220,38,38,0.5)'  : 'rgba(245,245,240,0.5)'
  const fullBorder      = isRed ? '#DC2626'               : '#F5F5F0'
  const hoverBg         = isRed ? 'rgba(220,38,38,0.15)' : 'rgba(245,245,240,0.08)'
  const searchUnderline = isRed ? 'rgba(220,38,38,0.4)'  : 'rgba(245,245,240,0.4)'
  const active          = open || hov

  const displayValue = value != null ? (getLabel ? getLabel(value) : String(value)) : null

  const filtered = options.filter(opt => {
    const lbl = getLabel ? getLabel(opt) : String(opt)
    return lbl.toLowerCase().includes(query.toLowerCase())
  })

  // autofocus search on open
  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus()
  }, [open])

  // click-outside: close + clear filter, keep prior value
  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
        setHighlighted(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // reset highlight when query changes
  useEffect(() => { setHighlighted(-1) }, [query])

  // scroll highlighted row into view
  useEffect(() => {
    if (highlighted < 0 || !listRef.current) return
    const rows = listRef.current.querySelectorAll('[data-opt]')
    rows[highlighted]?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  function handleToggle() {
    if (!open) { setQuery(''); setHighlighted(-1) }
    setOpen(o => !o)
  }

  function selectOpt(opt) {
    onChange(opt)
    setOpen(false)
    setQuery('')
    setHighlighted(-1)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false); setQuery(''); setHighlighted(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && filtered[highlighted] != null) selectOpt(filtered[highlighted])
    }
  }

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
        fontFamily: MONO, fontSize: 12,
        color: DIM, letterSpacing: '0.22em',
        textTransform: 'uppercase',
        display: 'block', marginBottom: 6,
        userSelect: 'none',
      }}>
        {label}
      </span>

      <div
        onClick={handleToggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 0',
          borderBottom: `1.5px solid ${active ? fullBorder : dimBorder}`,
          transition: 'border-color 0.12s',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span style={{
          fontFamily: MONO, fontSize: 18,
          color: displayValue ? '#F5F5F0' : DIM,
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
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 360,
        }}>
          {/* search input pinned at top */}
          <div style={{
            flexShrink: 0,
            borderBottom: `1px solid ${searchUnderline}`,
            padding: '0 14px',
          }}>
            <input
              ref={searchRef}
              className="ts-search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="SEARCH_"
              style={{
                display: 'block',
                width: '100%',
                background: 'transparent',
                border: 'none',
                fontFamily: MONO,
                fontSize: 14,
                color: '#F5F5F0',
                letterSpacing: '0.08em',
                padding: '10px 0',
                caretColor: accentColor,
              }}
            />
          </div>

          {/* scrollable option list */}
          <div ref={listRef} style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: '12px 14px',
                fontFamily: MONO, fontSize: 13,
                color: 'rgba(245,245,240,0.3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                userSelect: 'none',
              }}>
                NO MATCH
              </div>
            ) : filtered.map((opt, i) => {
              const lbl      = getLabel ? getLabel(opt) : String(opt)
              const selected = getLabel
                ? (value != null && getLabel(value) === lbl)
                : opt === value
              const isHigh   = i === highlighted
              return (
                <div
                  key={i}
                  data-opt
                  onClick={() => selectOpt(opt)}
                  onMouseEnter={() => setHighlighted(i)}
                  style={{
                    padding: '12px 14px',
                    fontFamily: MONO, fontSize: 14,
                    color: selected ? accentColor : TEXT,
                    cursor: 'pointer',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: isHigh ? hoverBg : 'transparent',
                    borderBottom: i < filtered.length - 1
                      ? '1px solid rgba(245,245,240,0.05)'
                      : 'none',
                  }}
                >
                  {lbl}
                </div>
              )
            })}
          </div>
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px' }}>
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
