import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react'
import { useMonth } from '../context/MonthContext'
import { useDark } from '../hooks/useDark'

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? '' : 'dark'
  if (next) document.documentElement.setAttribute('data-theme', 'dark')
  else document.documentElement.removeAttribute('data-theme')
  try { localStorage.setItem('theme', next || 'light') } catch(e) {}
}

export default function Header() {
  const { monthLabel, goToPrev, goToNext, isCurrentMonth } = useMonth()
  const dark = useDark()

  return (
    <header
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 flex items-center justify-between px-4"
      style={{ background: '#4B2683', paddingTop: 'env(safe-area-inset-top)', height: 'calc(56px + env(safe-area-inset-top))' }}
    >
      {/* Logo mark */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: '#FFC423', color: '#4B2683' }}
        >
          G
        </div>
        <span className="text-sm font-semibold" style={{ color: '#FFC423' }}>
          GMM
        </span>
      </div>

      {/* Month navigation — always visible on all tabs */}
      <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        <button
          onClick={goToPrev}
          className="p-1.5 rounded-full transition-opacity active:opacity-60"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          aria-label="Previous month"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-semibold px-1 min-w-[110px] text-center" style={{ color: '#fff' }}>
          {monthLabel}
        </span>
        <button
          onClick={goToNext}
          className="p-1.5 rounded-full transition-opacity active:opacity-60"
          style={{
            color: isCurrentMonth ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)',
            pointerEvents: isCurrentMonth ? 'none' : 'auto',
          }}
          aria-label="Next month"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="flex items-center justify-center rounded-full active:opacity-60 transition-opacity"
        style={{ color: 'rgba(255,255,255,0.75)' }}
      >
        {dark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
      </button>
    </header>
  )
}
