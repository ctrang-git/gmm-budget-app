import { motion } from 'framer-motion'
import { getSpendingByCategoryForMonth, mockIncome } from '../data/mockData'
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useMonth } from '../context/MonthContext'
import { useDark } from '../hooks/useDark'
import { TrendingUp, TrendingDown } from 'lucide-react'

function statusColor(spent, budget) {
  if (spent >= budget)        return '#E74C3C'
  if (spent >= budget * 0.9) return '#F39C12'
  return '#2ECC71'
}

function generateInsight(data, totalSpent, totalBudget) {
  const overBudget  = data.filter(d => d.spent > d.budget)
  const topCategory = [...data].filter(d => d.spent > 0).sort((a, b) => b.spent - a.spent)[0]
  const remaining   = totalBudget - totalSpent

  if (remaining >= 0) {
    const topPct = topCategory ? Math.round((topCategory.spent / totalSpent) * 100) : 0
    return {
      type: 'positive',
      icon: TrendingUp,
      title: "You're on track",
      text: topCategory
        ? `$${remaining.toFixed(0)} under budget. ${topCategory.category} makes up ${topPct}% of spending.`
        : `$${remaining.toFixed(0)} remaining in your budget.`,
    }
  }

  const worst = overBudget.sort((a, b) => (b.spent - b.budget) - (a.spent - a.budget))[0]
  return {
    type: 'warning',
    icon: TrendingDown,
    title: 'Over budget',
    text: worst
      ? `$${Math.abs(remaining).toFixed(0)} over total budget. ${worst.category} is the main driver.`
      : `$${Math.abs(remaining).toFixed(0)} over your total budget this month.`,
  }
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.32 } } }

export default function Summary() {
  const { monthKey, monthLabel } = useMonth()
  const dark = useDark()
  const data = getSpendingByCategoryForMonth(monthKey)

  const totalSpent  = data.reduce((s, d) => s + d.spent, 0)
  const totalBudget = data.reduce((s, d) => s + d.budget, 0)
  const insight     = generateInsight(data, totalSpent, totalBudget)
  const InsightIcon = insight.icon
  const isPositive  = insight.type === 'positive'

  const chartData = data
    .filter(d => d.spent > 0 || d.budget > 0)
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 7)
    .map(d => ({
      name: d.category.split(' ')[0],
      budget: d.budget,
      spent: parseFloat(d.spent.toFixed(2)),
    }))

  const chartBudgetColor = dark ? '#2A2440' : '#EDE8F7'

  const CARD = {
    background: 'var(--surface)',
    borderRadius: 22,
    boxShadow: `0 4px 20px var(--shadow-md)`,
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: "calc(64px + env(safe-area-inset-top))", paddingBottom: 96 }}>
      <motion.div variants={container} initial="hidden" animate="show" style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Insight card */}
        <motion.div variants={item} style={{
          ...CARD,
          background: isPositive ? 'var(--success-bg)' : 'var(--warning-bg)',
          padding: 20,
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
          borderLeft: `4px solid ${isPositive ? '#2ECC71' : '#F39C12'}`,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: isPositive ? 'var(--success-icon-bg)' : 'var(--warning-icon-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <InsightIcon size={20} style={{ color: isPositive ? '#2ECC71' : '#F39C12' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: isPositive ? '#27AE60' : '#E67E22', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
              {monthLabel} · {insight.title}
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5 }}>
              {insight.text}
            </p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Monthly Income',  value: `$${mockIncome.toLocaleString()}`, color: 'var(--purple-interactive)', sub: 'This month' },
            { label: 'Total Spent',     value: `$${totalSpent.toFixed(0)}`,        color: totalSpent > totalBudget ? '#E74C3C' : '#2ECC71', sub: `of $${totalBudget} budgeted` },
          ].map(({ label, value, color, sub }) => (
            <div key={label} style={{ ...CARD, padding: 18 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.04em' }}>{label.toUpperCase()}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: '-0.8px', marginBottom: 2 }}>{value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Bar chart */}
        <motion.div variants={item} style={{ ...CARD, padding: '20px 16px 16px' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Spent vs. Budget</p>
          <div style={{ width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barGap={3} barCategoryGap="28%">
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val, name) => [`$${val}`, name === 'budget' ? 'Budget' : 'Spent']}
                  contentStyle={{ borderRadius: 14, border: 'none', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', background: 'var(--surface)', color: 'var(--text)' }}
                />
                <Bar dataKey="budget" fill={chartBudgetColor} radius={[6, 6, 0, 0]} />
                <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={statusColor(entry.spent, entry.budget)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
            {[{ color: chartBudgetColor, label: 'Budget' }, { color: '#4B2683', label: 'Spent' }].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category table */}
        <motion.div variants={item} style={{ ...CARD, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 60px 60px 56px',
            padding: '12px 18px',
            background: 'var(--table-header-bg)',
            borderBottom: '1px solid var(--table-header-border)',
          }}>
            {['Category', 'Budget', 'Spent', 'Var'].map(h => (
              <p key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textAlign: h === 'Category' ? 'left' : 'right', letterSpacing: '0.04em' }}>
                {h.toUpperCase()}
              </p>
            ))}
          </div>

          {data.map((row, i) => {
            const variance = row.budget - row.spent
            const color = statusColor(row.spent, row.budget)
            return (
              <div
                key={row.category}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 60px 60px 56px',
                  padding: '13px 18px',
                  alignItems: 'center',
                  borderBottom: i === data.length - 1 ? 'none' : `1px solid var(--table-row-border)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.category}
                  </span>
                </div>
                <p style={{ fontSize: 13, textAlign: 'right', color: 'var(--text-muted)' }}>${row.budget}</p>
                <p style={{ fontSize: 13, fontWeight: 600, textAlign: 'right', color: 'var(--text)' }}>
                  ${row.spent.toFixed(0)}
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', color: variance >= 0 ? '#2ECC71' : '#E74C3C' }}>
                  {variance >= 0 ? '+' : ''}{variance.toFixed(0)}
                </p>
              </div>
            )
          })}

          {/* Total */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 60px 60px 56px',
            padding: '13px 18px',
            alignItems: 'center',
            borderTop: `2px solid var(--table-header-border)`,
            background: 'var(--table-header-bg)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Total</p>
            <p style={{ fontSize: 14, fontWeight: 700, textAlign: 'right', color: 'var(--purple-interactive)' }}>${totalBudget}</p>
            <p style={{ fontSize: 14, fontWeight: 700, textAlign: 'right', color: 'var(--text)' }}>${totalSpent.toFixed(0)}</p>
            <p style={{ fontSize: 14, fontWeight: 800, textAlign: 'right', color: totalBudget - totalSpent >= 0 ? '#2ECC71' : '#E74C3C' }}>
              {totalBudget - totalSpent >= 0 ? '+' : ''}{(totalBudget - totalSpent).toFixed(0)}
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
