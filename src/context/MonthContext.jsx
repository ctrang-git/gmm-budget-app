import { createContext, useContext, useState } from 'react'

const MonthContext = createContext(null)

export function MonthProvider({ children }) {
  // Default to April 2026 for the demo
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1))

  const goToPrev = () =>
    setCurrentMonth(m => {
      const d = new Date(m)
      d.setMonth(d.getMonth() - 1)
      return d
    })

  const goToNext = () =>
    setCurrentMonth(m => {
      const d = new Date(m)
      d.setMonth(d.getMonth() + 1)
      return d
    })

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const monthKey = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, '0')}`

  // April 2026 is the "current" demo month
  const isCurrentMonth =
    currentMonth.getFullYear() === 2026 && currentMonth.getMonth() === 3

  return (
    <MonthContext.Provider
      value={{ currentMonth, goToPrev, goToNext, monthLabel, monthKey, isCurrentMonth }}
    >
      {children}
    </MonthContext.Provider>
  )
}

export function useMonth() {
  return useContext(MonthContext)
}
