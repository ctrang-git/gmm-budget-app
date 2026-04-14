import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useMonth } from '../context/MonthContext'
import { useSheet } from '../context/SheetContext'
import { getSpendingByCategoryForMonth, mockIncome, CATEGORY_ICONS, CATEGORY_COLORS } from '../data/mockData'
import { useDark } from '../hooks/useDark'

const CHART_COLORS = ['#4B2683', '#6B3FA0', '#FFC423', '#2ECC71', '#E74C3C', '#9CA3AF']

const NOISE_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E"

function statusGradient(spent, budget) {
  if (spent >= budget)        return 'linear-gradient(90deg, #E74C3C, #FF6B6B)'
  if (spent >= budget * 0.9) return 'linear-gradient(90deg, #F39C12, #FFCF40)'
  return 'linear-gradient(90deg, #2ECC71, #55EFC4)'
}

function statusTextColor(spent, budget) {
  if (spent >= budget)        return '#E74C3C'
  if (spent >= budget * 0.9) return '#F39C12'
  return '#2ECC71'
}

function SpringCounter({ target, prefix = '$' }) {
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 80, damping: 20 })
  const [display, setDisplay] = useState(`${prefix}0`)

  useEffect(() => {
    mv.set(target)
    const unsub = spring.on('change', v => {
      setDisplay(`${prefix}${Math.round(Math.abs(v)).toLocaleString()}`)
    })
    return unsub
  }, [target])

  return <span>{display}</span>
}

export default function Dashboard() {
  const { monthKey } = useMonth()
  const { txVersion } = useSheet()
  void txVersion // subscribes this component to transaction updates
  const navigate = useNavigate()
  const dark = useDark()
  const data = getSpendingByCategoryForMonth(monthKey)

  const totalBudgeted = data.reduce((s, d) => s + d.budget, 0)
  const totalSpent    = data.reduce((s, d) => s + d.spent, 0)
  const remaining     = mockIncome - totalSpent
  const isPositive    = remaining >= 0
  const savingsRate   = Math.max(0, Math.round((remaining / mockIncome) * 100))

  const sorted = [...data].sort((a, b) => {
    const aOver = a.spent > a.budget
    const bOver = b.spent > b.budget
    if (aOver && !bOver) return -1
    if (!aOver && bOver) return 1
    return (b.spent / b.budget) - (a.spent / a.budget)
  })

  const chartCategories = [...data]
    .filter(d => d.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5)

  const iconAlpha = dark ? '30' : '18'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: 64, paddingBottom: 96 }}>

      {/* ── Hero Banner ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          margin: '12px 16px 6px',
          borderRadius: 28,
          background: 'linear-gradient(145deg, #3D1F72 0%, #5A2F9B 50%, #7B45B8 100%)',
          boxShadow: '0 8px 32px rgba(61,31,114,0.38)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Radial glow behind number */}
        <div style={{
          position: 'absolute',
          top: -40,
          left: '30%',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,196,35,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Noise grain */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${NOISE_URI}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px',
          opacity: 0.05,
          pointerEvents: 'none',
        }} />

        <div style={{ padding: '24px 22px 20px', position: 'relative' }}>
          {/* Top: number + donut */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                Remaining Budget
              </p>
              <p style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, color: isPositive ? '#FFC423' : '#FF6B6B', letterSpacing: '-1.5px' }}>
                {isPositive ? '' : '−'}<SpringCounter target={Math.abs(remaining)} />
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
                ${totalSpent.toFixed(0)} spent of ${mockIncome.toLocaleString()}
              </p>
            </div>

            {/* Donut */}
            <div style={{ width: 76, height: 76, flexShrink: 0, minWidth: 0, marginTop: 4 }}>
              {chartCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartCategories} cx="50%" cy="50%" innerRadius={22} outerRadius={34}
                      paddingAngle={3} dataKey="spent" animationBegin={400} animationDuration={900}
                    >
                      {chartCategories.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ width: 76, height: 76, borderRadius: '50%', border: '5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                </div>
              )}
            </div>
          </div>

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {[
              { label: 'Budget',    value: `$${totalBudgeted.toLocaleString()}` },
              { label: 'Savings',   value: `${savingsRate}%` },
              { label: 'Income',    value: `$${mockIncome.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                flex: 1,
                background: 'rgba(255,255,255,0.10)',
                borderRadius: 14,
                padding: '10px 8px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2, fontWeight: 500 }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Section header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 8px' }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Spending</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          {sorted.filter(d => d.spent > 0).length} active
        </p>
      </div>

      {/* ── Category Cards ──────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {sorted.map((row, i) => {
          const pct = row.budget > 0 ? Math.min((row.spent / row.budget) * 100, 100) : 0
          const isEmpty = row.spent === 0
          const color = CATEGORY_COLORS[row.category] || '#9CA3AF'
          const icon  = CATEGORY_ICONS[row.category]  || '📌'
          const isOver = row.spent > row.budget
          const textColor = statusTextColor(row.spent, row.budget)
          const gradient  = statusGradient(row.spent, row.budget)

          return (
            <motion.button
              key={row.category}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: i * 0.04 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate(`/history?category=${encodeURIComponent(row.category)}`)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'var(--surface)',
                borderRadius: 22,
                padding: '18px 18px 16px',
                boxShadow: isEmpty
                  ? `0 2px 8px var(--shadow-sm)`
                  : `0 4px 20px var(--shadow-lg)`,
                opacity: isEmpty ? 0.5 : 1,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {/* Top row: icon + info + amount */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Icon square */}
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  background: `${color}${iconAlpha}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                }}>
                  {icon}
                </div>

                {/* Label + subtext */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                    {row.category}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                    {isEmpty ? 'No spending yet' : `$${row.spent.toFixed(0)} of $${row.budget}`}
                  </p>
                </div>

                {/* Amount + over badge */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: isOver ? '#E74C3C' : 'var(--text)', letterSpacing: '-0.5px' }}>
                    ${row.spent.toFixed(0)}
                  </p>
                  {isOver && (
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#E74C3C', marginTop: 2 }}>
                      +${(row.spent - row.budget).toFixed(0)} over
                    </p>
                  )}
                  {!isOver && row.spent > 0 && (
                    <p style={{ fontSize: 10, fontWeight: 600, color: textColor, marginTop: 2 }}>
                      {Math.round(pct)}%
                    </p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 8, borderRadius: 8, background: 'var(--progress-track)', overflow: 'hidden' }}>
                <motion.div
                  style={{
                    height: '100%',
                    borderRadius: 8,
                    background: isEmpty ? 'var(--border)' : gradient,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${isEmpty ? 0 : pct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.04, type: 'spring', stiffness: 70, damping: 16 }}
                />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
