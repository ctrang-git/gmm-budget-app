import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, DollarSign } from 'lucide-react'
import { CATEGORIES, CATEGORY_ICONS } from '../data/mockData'

export default function AddTransaction() {
  const [amount, setAmount]       = useState('')
  const [payee, setPayee]         = useState('')
  const [category, setCategory]   = useState(null)
  const [saved, setSaved]         = useState(false)

  function handleSave() {
    if (!amount || !category) return
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setAmount('')
      setPayee('')
      setCategory(null)
    }, 1800)
  }

  const canSave = amount.length > 0 && category !== null

  return (
    <div className="pt-16 pb-28 px-4">

      {/* Amount input — hero card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl p-5 mb-4 text-center"
        style={{ background: '#4B2683' }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
          AMOUNT
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-light" style={{ color: '#FFC423' }}>$</span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="text-4xl font-bold text-center bg-transparent border-none outline-none w-40"
            style={{ color: '#fff' }}
          />
        </div>
      </motion.div>

      {/* Payee input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-2xl p-4 mb-4"
        style={{ background: '#fff', boxShadow: '0 1px 8px rgba(75,38,131,0.08)' }}
      >
        <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: '#6B7280' }}>
          Payee
        </label>
        <input
          type="text"
          placeholder="Where did you spend?"
          value={payee}
          onChange={e => setPayee(e.target.value)}
          className="w-full text-base font-medium bg-transparent border-none outline-none"
          style={{ color: '#1A1A2E' }}
        />
      </motion.div>

      {/* Category grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-2xl p-4 mb-6"
        style={{ background: '#fff', boxShadow: '0 1px 8px rgba(75,38,131,0.08)' }}
      >
        <label className="text-xs font-semibold uppercase tracking-wide block mb-3" style={{ color: '#6B7280' }}>
          Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map(cat => {
            const isSelected = category === cat
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.94 }}
                onClick={() => setCategory(cat)}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center transition-all"
                style={{
                  background: isSelected ? '#4B2683' : '#F7F5FB',
                  border: isSelected ? '2px solid #4B2683' : '2px solid transparent',
                }}
              >
                <span className="text-xl">{CATEGORY_ICONS[cat] || '📌'}</span>
                <span
                  className="text-[11px] font-medium leading-tight"
                  style={{ color: isSelected ? '#fff' : '#4B2683' }}
                >
                  {cat}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Save button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={!canSave}
        className="w-full py-4 rounded-2xl font-bold text-base transition-all relative overflow-hidden"
        style={{
          background: canSave ? '#4B2683' : '#E5E0F0',
          color: canSave ? '#fff' : '#9CA3AF',
        }}
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div
              key="saved"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Check size={20} />
              <span>Transaction Saved!</span>
            </motion.div>
          ) : (
            <motion.span
              key="save"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Save Transaction
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
