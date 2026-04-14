import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MonthProvider } from './context/MonthContext'
import { SheetProvider } from './context/SheetContext'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import AddTransactionSheet from './components/AddTransactionSheet'
import TransactionDetailSheet from './components/TransactionDetailSheet'
import Dashboard from './screens/Dashboard'
import History from './screens/History'
import Summary from './screens/Summary'
import Profile from './screens/Profile'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in:      { opacity: 1, y: 0 },
  out:     { opacity: 0, y: -8 },
}
const pageTransition = { duration: 0.18, ease: 'easeInOut' }

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ height: '100%' }}
      >
        <Routes location={location}>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppContent() {
  return (
    <>
      <Header />
      <AnimatedRoutes />
      <BottomNav />
      <AddTransactionSheet />
      <TransactionDetailSheet />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MonthProvider>
        <SheetProvider>
          <AppContent />
        </SheetProvider>
      </MonthProvider>
    </BrowserRouter>
  )
}
