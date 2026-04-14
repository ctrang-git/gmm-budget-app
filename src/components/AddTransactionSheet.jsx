import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, CalendarDays } from 'lucide-react'
import BottomSheet from './BottomSheet'
import { useSheet } from '../context/SheetContext'
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS, mockTransactions } from '../data/mockData'
import { useDark } from '../hooks/useDark'

function getMostUsed() {
  const counts = {}
  mockTransactions.forEach(t => {
    counts[t.category] = (counts[t.category] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null
}

const mostUsed = getMostUsed()

function formatDateDisplay(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AddTransactionSheet() {
  const { addSheetOpen, closeAddSheet, editSheet, closeEditSheet, bumpTxVersion } = useSheet()
  const dark = useDark()
  const dateInputRef = useRef(null)

  const isEditMode = editSheet.open
  const editTx     = editSheet.transaction
  const isOpen     = addSheetOpen || editSheet.open

  const today = new Date().toISOString().split('T')[0]

  const [amount, setAmount]     = useState('')
  const [payee, setPayee]       = useState('')
  const [category, setCategory] = useState(null)
  const [date, setDate]         = useState(today)
  const [saved, setSaved]       = useState(false)

  // Pre-fill form when edit mode opens
  useEffect(() => {
    if (editSheet.open && editTx) {
      setAmount(String(editTx.amount))
      setPayee(editTx.payee)
      setCategory(editTx.category)
      setDate(editTx.date)
      setSaved(false)
    }
  }, [editSheet.open, editTx?.id])

  // Reset form when add mode opens
  useEffect(() => {
    if (addSheetOpen) {
      setAmount('')
      setPayee('')
      setCategory(null)
      setDate(today)
      setSaved(false)
    }
  }, [addSheetOpen])

  function handleClose() {
    isEditMode ? closeEditSheet() : closeAddSheet()
  }

  const canSave = amount.length > 0 && category !== null

  function handleSave() {
    if (!canSave) return
    if (isEditMode) {
      const idx = mockTransactions.findIndex(t => t.id === editTx.id)
      if (idx !== -1) mockTransactions[idx] = {
        ...mockTransactions[idx],
        amount: parseFloat(amount),
        payee: payee || 'Unknown',
        category,
        date,
      }
    } else {
      mockTransactions.unshift({
        id: Date.now(),
        date,
        payee: payee || 'Unknown',
        category,
        amount: parseFloat(amount),
      })
    }
    bumpTxVersion()
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      if (isEditMode) {
        closeEditSheet()
      } else {
        setAmount('')
        setPayee('')
        setCategory(null)
        setDate(today)
      }
    }, 1600)
  }

  const categoryList = mostUsed
    ? [mostUsed, ...CATEGORIES.filter(c => c !== mostUsed)]
    : CATEGORIES

  return (
    <BottomSheet open={isOpen} onClose={handleClose} snapPoint="full">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 32 }}>

        {/* ── Sheet header ───────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button
            onClick={handleClose}
            style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: 'var(--surface-elevated)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* ── Amount hero ────────────────────────────── */}
        <div style={{ padding: '0 16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              borderRadius: 24,
              padding: '22px 20px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4B2683 0%, #6B3FA0 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '8px 0' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FFC423', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={26} strokeWidth={3} style={{ color: '#4B2683' }} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#FFC423' }}>{isEditMode ? 'Updated!' : 'Saved!'}</p>
                </motion.div>
              ) : (
                <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: 10 }}>
                    AMOUNT
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span style={{ fontSize: 32, fontWeight: 300, color: '#FFC423', lineHeight: 1 }}>$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      autoFocus
                      style={{
                        fontSize: 44,
                        fontWeight: 800,
                        color: '#fff',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: 160,
                        textAlign: 'center',
                        letterSpacing: '-1px',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Payee + Date ───────────────────────────── */}
        <div style={{ padding: '0 16px' }}>
          <div
            style={{
              borderRadius: 22,
              background: 'var(--surface)',
              boxShadow: '0 2px 12px var(--shadow-sm)',
              overflow: 'hidden',
            }}
          >
            {/* Payee row */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--surface-subtle)' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>
                Payee
              </p>
              <input
                type="text"
                placeholder="Where did you spend?"
                value={payee}
                onChange={e => setPayee(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: 16,
                  fontWeight: 500,
                  color: 'var(--text)',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                }}
              />
            </div>

            {/* Date row */}
            <div
              style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => dateInputRef.current?.showPicker?.()}
            >
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Date
                </p>
                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>
                  {formatDateDisplay(date)}
                </p>
              </div>
              <CalendarDays size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              {/* Hidden native date input */}
              <input
                ref={dateInputRef}
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
              />
            </div>
          </div>
        </div>

        {/* ── Category scroll row ────────────────────── */}
        <div>
          <p style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
            letterSpacing: '0.07em', textTransform: 'uppercase',
            padding: '0 20px', marginBottom: 10,
          }}>
            Category — scroll to see all
          </p>

          {/* Outer wrapper: clips the scroll + holds the right-edge fade */}
          <div style={{ position: 'relative' }}>
            <div style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ display: 'flex', gap: 10, padding: '4px 16px 8px' }}>
                {categoryList.map((cat) => {
                  const isSelected = category === cat
                  const catColor   = CATEGORY_COLORS[cat] || '#9CA3AF'

                  return (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setCategory(cat)}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 7,
                        padding: '14px 14px',
                        borderRadius: 20,
                        border: isSelected ? '2px solid #4B2683' : '2px solid var(--border)',
                        cursor: 'pointer',
                        minWidth: 82,
                        background: isSelected ? '#4B2683' : 'var(--surface-elevated)',
                        boxShadow: isSelected
                          ? '0 4px 16px rgba(75,38,131,0.30)'
                          : '0 2px 8px var(--shadow-sm)',
                        transition: 'background 0.15s, box-shadow 0.15s, border-color 0.15s',
                      }}
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: isSelected ? 'rgba(255,255,255,0.15)' : `${catColor}${dark ? '30' : '22'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                      }}>
                        {CATEGORY_ICONS[cat] || '📌'}
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: isSelected ? '#fff' : 'var(--text)',
                        textAlign: 'center',
                        lineHeight: 1.25,
                        maxWidth: 64,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      }}>
                        {cat}
                      </span>
                    </motion.button>
                  )
                })}
                {/* Trailing spacer so last chip clears the right fade */}
                <div style={{ flexShrink: 0, width: 48 }} />
              </div>
            </div>

            {/* Right-edge fade — signals more chips to scroll to */}
            <div style={{
              position: 'absolute',
              top: 0, right: 0, bottom: 0,
              width: 56,
              background: 'linear-gradient(to right, transparent, var(--surface))',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* ── Save button ────────────────────────────── */}
        <div style={{ padding: '0 16px' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={!canSave || saved}
            style={{
              width: '100%',
              padding: '17px 0',
              borderRadius: 22,
              border: 'none',
              cursor: canSave && !saved ? 'pointer' : 'default',
              fontWeight: 700,
              fontSize: 16,
              background: canSave && !saved ? '#FFC423' : 'var(--disabled-bg)',
              color:      canSave && !saved ? '#4B2683' : 'var(--disabled-text)',
              boxShadow:  canSave && !saved ? '0 4px 16px rgba(255,196,35,0.40)' : 'none',
              transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
            }}
          >
            {isEditMode ? 'Update Transaction' : 'Save Transaction'}
          </motion.button>
        </div>

      </div>
    </BottomSheet>
  )
}
