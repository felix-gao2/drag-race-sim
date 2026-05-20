import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const COLOR_A = '#FF3333'
const COLOR_B = '#3399FF'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1C1C1C',
      border: '1px solid #2A2A2A',
      padding: '0.5rem 0.75rem',
      fontFamily: '"DM Mono", monospace',
      fontSize: '0.75rem',
    }}>
      <p style={{ color: '#6B6B6B', margin: '0 0 0.35rem', letterSpacing: '0.08em' }}>
        {Number(label).toFixed(2)} s
      </p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, margin: '0.15rem 0' }}>
          {p.name}: {Number(p.value).toFixed(1)} mph
        </p>
      ))}
    </div>
  )
}

export default function TelemetryChart({ telemetry, labelA, labelB }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      padding: '1.25rem 0.5rem 0.75rem 0',
    }}>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={telemetry} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="#2A2A2A" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time_s"
            tickFormatter={v => `${Number(v).toFixed(1)}s`}
            tick={{ fill: '#6B6B6B', fontSize: 11, fontFamily: '"DM Mono", monospace' }}
            axisLine={{ stroke: '#2A2A2A' }}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis
            tickFormatter={v => `${v}`}
            tick={{ fill: '#6B6B6B', fontSize: 11, fontFamily: '"DM Mono", monospace' }}
            axisLine={false}
            tickLine={false}
            width={42}
            unit=" mph"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.7rem', color: '#6B6B6B', letterSpacing: '0.05em' }}>
                {value}
              </span>
            )}
            wrapperStyle={{ paddingTop: '0.75rem' }}
          />
          <Line
            type="monotone"
            dataKey="speed_a_mph"
            name={labelA}
            stroke={COLOR_A}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: COLOR_A }}
          />
          <Line
            type="monotone"
            dataKey="speed_b_mph"
            name={labelB}
            stroke={COLOR_B}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: COLOR_B }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
