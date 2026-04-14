import { motion } from 'framer-motion'
import { Trash2, Pencil } from 'lucide-react'
import BottomSheet from './BottomSheet'
import { useSheet } from '../context/SheetContext'
import { CATEGORY_ICONS, CATEGORY_COLORS, mockTransactions } from '../data/mockData'
import { useDark } from '../hooks/useDark'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export default function TransactionDetailSheet() {
  const { detailSheet, closeDetailSheet } = useSheet()
  const { open, transaction: tx } = detailSheet
  const dark = useDark()

  function handleDelete() {
    if (!tx) return
    const idx = mockTransactions.findIndex(t => t.id === tx.id)
    if (idx !== -1) mockTransactions.splice(idx, 1)
    closeDetailSheet()
  }

  if (!tx) return <BottomSheet open={false} onClose={closeDetailSheet} snapPoint="partial" />

  const color = CATEGORY_COLORS[tx.category] || '#9CA3AF'
  const icon  = CATEGORY_ICONS[tx.category]  || '📌'
  const iconAlpha = dark ? '30' : '18'

  return (
    <BottomSheet open={open} onClose={closeDetailSheet} snapPoint="partial">
      <div className="px-5 pb-6">
        {/* Category icon */}
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3"
            style={{ background: `${color}${iconAlpha}` }}
          >
            {icon}
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            −${tx.amount.toFixed(2)}
          </p>
          <p className="text-base font-semibold mt-0.5" style={{ color: 'var(--text)' }}>
            {tx.payee}
          </p>
          <span
            className="text-xs font-medium px-3 py-1 rounded-full mt-2"
            style={{ background: `${color}${iconAlpha}`, color }}
          >
            {tx.category}
          </span>
        </div>

        {/* Date */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'var(--surface-elevated)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Date</p>
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{formatDate(tx.date)}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: 'var(--surface-elevated)', color: 'var(--purple-interactive)', border: '1.5px solid var(--border)' }}
          >
            <Pencil size={16} />
            Edit
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleDelete}
            className="py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: 'var(--danger-soft-bg)', color: '#E74C3C', border: '1.5px solid var(--danger-soft-border)' }}
          >
            <Trash2 size={16} />
            Delete
          </motion.button>
        </div>
      </div>
    </BottomSheet>
  )
}
