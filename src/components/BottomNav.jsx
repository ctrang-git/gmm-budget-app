import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, History, BarChart3, User, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSheet } from '../context/SheetContext'

const tabs = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'History',   icon: History,         path: '/history' },
  null, // FAB slot
  { label: 'Summary',   icon: BarChart3,       path: '/summary' },
  { label: 'Profile',   icon: User,            path: '/profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { openAddSheet } = useSheet()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', height: 64 }}
    >
      <div className="flex items-center justify-around h-full px-2 pb-safe">
        {tabs.map((tab, i) => {
          // FAB slot
          if (tab === null) {
            return (
              <div key="fab" className="flex items-center justify-center flex-1">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={openAddSheet}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#FFC423',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 10px rgba(255,196,35,0.30)',
                  }}
                  aria-label="Add transaction"
                >
                  <Plus size={26} strokeWidth={2.8} style={{ color: '#4B2683' }} />
                </motion.button>
              </div>
            )
          }

          const active = location.pathname === tab.path
          const Icon = tab.icon

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 py-2 flex-1 relative transition-all"
              style={{ color: active ? 'var(--purple-interactive)' : 'var(--text-muted)' }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full"
                  style={{ background: 'var(--purple-interactive)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
