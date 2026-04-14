import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useMonth } from '../context/MonthContext'
import { useSheet } from '../context/SheetContext'
import { useDark } from '../hooks/useDark'
import { mockTransactions, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../data/mockData'

function groupByDate(txs) {
  const groups = {}
  txs.forEach(tx => {
    if (!groups[tx.date]) groups[tx.date] = []
    groups[tx.date].push(tx)
  })
  return Object.entries(groups).sort(([a], [b]) => new Date(b) - new Date(a))
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  if (dateStr === '2026-04-13') return 'Today'
  if (dateStr === '2026-04-12') return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

const REVEAL_WIDTH = 160 // total px revealed: 80 edit + 80 delete

function SwipeableRow({ tx, onEdit, onDelete, isFirst, isLast, iconAlpha }) {
  const x                   = useMotionValue(0)
  const actionsOpacity      = useTransform(x, [-REVEAL_WIDTH, -24], [1, 0])
  const actionsPointerEvents = useTransform(x, v => v < -8 ? 'auto' : 'none')

  const color = CATEGORY_COLORS[tx.category] || '#9CA3AF'
  const icon  = CATEGORY_ICONS[tx.category]  || '📌'

  function snapOpen()  { animate(x, -REVEAL_WIDTH, { type: 'spring', stiffness: 380, damping: 34 }) }
  function snapClose() { animate(x, 0,             { type: 'spring', stiffness: 380, damping: 34 }) }

  function handleDragEnd(_, info) {
    const fastSwipe = info.velocity.x < -500
    const farEnough = info.offset.x  < -REVEAL_WIDTH / 2
    fastSwipe || farEnough ? snapOpen() : snapClose()
  }

  function handleRowClick() {
    // If already open, tapping the row closes it
    if (x.get() < -8) snapClose()
  }

  const radius = {
    borderTopLeftRadius:    isFirst ? 22 : 0,
    borderTopRightRadius:   isFirst ? 22 : 0,
    borderBottomLeftRadius: isLast  ? 22 : 0,
    borderBottomRightRadius:isLast  ? 22 : 0,
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...radius }}>

      {/* ── Action buttons (revealed behind the row) ── */}
      <motion.div
        style={{
          opacity: actionsOpacity,
          pointerEvents: actionsPointerEvents,
          position: 'absolute',
          right: 0, top: 0, bottom: 0,
          width: REVEAL_WIDTH,
          display: 'flex',
        }}
      >
        {/* Edit */}
        <button
          onClick={() => { snapClose(); onEdit(tx) }}
          style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            background: '#4B2683',
            color: '#fff',
            border: 'none', cursor: 'pointer',
          }}
        >
          <Pencil size={17} strokeWidth={2.2} />
          <span style={{ fontSize: 11, fontWeight: 700 }}>Edit</span>
        </button>

        {/* Delete */}
        <button
          onClick={() => { snapClose(); onDelete(tx) }}
          style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            background: '#E74C3C',
            color: '#fff',
            border: 'none', cursor: 'pointer',
          }}
        >
          <Trash2 size={17} strokeWidth={2.2} />
          <span style={{ fontSize: 11, fontWeight: 700 }}>Delete</span>
        </button>
      </motion.div>

      {/* ── Swipeable row ──────────────────────────── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -REVEAL_WIDTH, right: 0 }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onClick={handleRowClick}
        style={{
          x,
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 16px',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: `${color}${iconAlpha}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>
          {icon}
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tx.payee}
          </p>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            color, background: `${color}${iconAlpha}`,
            padding: '2px 9px', borderRadius: 20,
          }}>
            {tx.category}
          </span>
        </div>

        {/* Amount */}
        <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', flexShrink: 0, letterSpacing: '-0.4px' }}>
          −${tx.amount.toFixed(2)}
        </p>
      </motion.div>
    </div>
  )
}

export default function History() {
  const { monthKey }                      = useMonth()
  const { openAddSheet, openEditSheet, txVersion } = useSheet()
  void txVersion // subscribes this component to transaction updates
  const [searchParams]                    = useSearchParams()
  const [filter, setFilter]               = useState('All')
  const [pendingDelete, setPendingDelete] = useState(null)
  const dark                              = useDark()

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && CATEGORIES.includes(cat)) setFilter(cat)
  }, [searchParams])

  const monthTxs = mockTransactions.filter(t => t.date.startsWith(monthKey))
  const filtered  = filter === 'All' ? monthTxs : monthTxs.filter(t => t.category === filter)
  const grouped   = groupByDate(filtered)
  const total     = filtered.reduce((s, t) => s + t.amount, 0)

  function handleDeleteConfirm() {
    const idx = mockTransactions.findIndex(t => t.id === pendingDelete.id)
    if (idx !== -1) mockTransactions.splice(idx, 1)
    setPendingDelete(null)
    setFilter(f => { setTimeout(() => setFilter(f), 0); return f })
  }

  const iconAlpha  = dark ? '30' : '18'
  const allChips   = ['All', ...CATEGORIES]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: "calc(64px + env(safe-area-inset-top))", paddingBottom: 96 }}>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {allChips.map(cat => {
          const active = filter === cat
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 100,
                fontSize: 12, fontWeight: 600,
                whiteSpace: 'nowrap', flexShrink: 0,
                border: 'none', cursor: 'pointer',
                background: active ? '#4B2683' : 'var(--surface)',
                color:      active ? '#fff'    : 'var(--purple-interactive)',
                boxShadow:  active ? '0 4px 12px rgba(75,38,131,0.28)' : `0 2px 8px var(--shadow-sm)`,
                transition: 'all 0.15s ease',
              }}
            >
              {cat !== 'All' && <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[cat]}</span>}
              {cat}
            </button>
          )
        })}
      </div>

      {/* Summary bar */}
      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </p>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--purple-interactive)' }}>
          ${total.toFixed(2)}
        </p>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 32px', textAlign: 'center' }}
        >
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 16, boxShadow: `0 4px 20px var(--shadow-lg)` }}>
            📭
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            {filter === 'All' ? 'No transactions yet' : `No ${filter} transactions`}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
            {filter === 'All' ? 'Log your first spend to get started.' : 'Try a different category.'}
          </p>
          {filter === 'All' && (
            <button
              onClick={openAddSheet}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 24px', borderRadius: 18,
                background: '#FFC423', color: '#4B2683',
                fontWeight: 700, fontSize: 14,
                boxShadow: '0 4px 16px rgba(255,196,35,0.4)',
                border: 'none', cursor: 'pointer',
              }}
            >
              <Plus size={16} strokeWidth={3} />
              Log your first transaction
            </button>
          )}
        </motion.div>
      )}

      {/* Transaction groups */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 16px' }}>
          {grouped.map(([date, txs], gi) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: gi * 0.05 }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
                {formatDate(date)}
              </p>
              <div style={{ background: 'var(--surface)', borderRadius: 22, overflow: 'hidden', boxShadow: `0 4px 20px var(--shadow-md)` }}>
                {txs.map((tx, i) => (
                  <div key={tx.id} style={{ borderTop: i === 0 ? 'none' : `1px solid var(--table-row-border)` }}>
                    <SwipeableRow
                      tx={tx}
                      onEdit={openEditSheet}
                      onDelete={tx => setPendingDelete(tx)}
                      isFirst={i === 0}
                      isLast={i === txs.length - 1}
                      iconAlpha={iconAlpha}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {pendingDelete && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px',
        }}>
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'var(--surface)', borderRadius: 24, padding: 28,
              width: '100%', maxWidth: 340,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              Delete transaction?
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
              "{pendingDelete.payee}" · ${pendingDelete.amount.toFixed(2)} will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setPendingDelete(null)}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 16, border: 'none',
                  background: 'var(--surface-elevated)', color: 'var(--text)',
                  fontWeight: 600, fontSize: 15, cursor: 'pointer',
                }}
              >Cancel</button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 16, border: 'none',
                  background: '#E74C3C', color: '#fff',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}
              >Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
