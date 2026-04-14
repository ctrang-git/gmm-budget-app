import { createContext, useContext, useState } from 'react'

const SheetContext = createContext(null)

export function SheetProvider({ children }) {
  const [txVersion, setTxVersion] = useState(0)
  const bumpTxVersion = () => setTxVersion(v => v + 1)

  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [detailSheet, setDetailSheet] = useState({ open: false, transaction: null })
  const [editSheet, setEditSheet] = useState({ open: false, transaction: null })

  const openAddSheet = () => setAddSheetOpen(true)
  const closeAddSheet = () => setAddSheetOpen(false)

  const openDetailSheet = (tx) => setDetailSheet({ open: true, transaction: tx })
  const closeDetailSheet = () => setDetailSheet({ open: false, transaction: null })

  const openEditSheet  = (tx) => setEditSheet({ open: true, transaction: tx })
  const closeEditSheet = ()   => setEditSheet({ open: false, transaction: null })

  return (
    <SheetContext.Provider
      value={{
        txVersion,
        bumpTxVersion,
        addSheetOpen,
        openAddSheet,
        closeAddSheet,
        detailSheet,
        openDetailSheet,
        closeDetailSheet,
        editSheet,
        openEditSheet,
        closeEditSheet,
      }}
    >
      {children}
    </SheetContext.Provider>
  )
}

export function useSheet() {
  return useContext(SheetContext)
}
