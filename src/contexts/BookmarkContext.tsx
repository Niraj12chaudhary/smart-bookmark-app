'use client'
import { createContext, useContext, useState } from 'react'

interface BookmarkContextType {
  refreshTrigger: number
  triggerRefresh: () => void
}

const BookmarkContext = createContext<BookmarkContextType>({
  refreshTrigger: 0,
  triggerRefresh: () => {}
})

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <BookmarkContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export const useBookmark = () => {
  const context = useContext(BookmarkContext)
  if (context === undefined) {
    throw new Error('useBookmark must be used within a BookmarkProvider')
  }
  return context
}
