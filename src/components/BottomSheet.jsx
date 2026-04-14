import { motion, AnimatePresence } from 'framer-motion'

const snapHeights = {
  full: '95dvh',
  partial: '52vh',
}

export default function BottomSheet({ open, onClose, snapPoint = 'full', children }) {
  const height = snapHeights[snapPoint] || snapHeights.full

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              zIndex: 50,
            }}
          />

          {/* Centering wrapper — static, handles horizontal positioning */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 430,
              height,
              zIndex: 51,
              pointerEvents: 'none',
            }}
          >
            {/* Panel — Framer Motion only controls vertical */}
            <motion.div
              key="panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80) onClose()
              }}
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--surface)',
                borderRadius: '24px 24px 0 0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                pointerEvents: 'auto',
              }}
            >
              {/* Drag handle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: 12,
                  paddingBottom: 8,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--border)',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
