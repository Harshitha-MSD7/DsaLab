import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'algoviz_progress'

const initialProgress = {
  sorting: { bubble: false, merge: false, quick: false, heap: false, radix: false },
  trees: { bst: false, avl: false, heap: false },
  graphs: { bfs: false, dfs: false, dijkstra: false, bellmanFord: false },
  linkedList: { singly: false, doubly: false },
  stackQueue: { stack: false, queue: false },
  hashMap: { hashMap: false },
  search: { binary: false },
  dp: { fibonacci: false, lcs: false, knapsack: false },
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('algoviz_theme') || 'dark'
  })

  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...initialProgress, ...JSON.parse(saved) } : initialProgress
    } catch {
      return initialProgress
    }
  })

  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('algoviz_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  const markComplete = useCallback((category, algorithm) => {
    setProgress(prev => ({
      ...prev,
      [category]: { ...prev[category], [algorithm]: true }
    }))
  }, [])

  const getTotalProgress = useCallback(() => {
    const all = Object.values(progress).flatMap(cat => Object.values(cat))
    const done = all.filter(Boolean).length
    return { done, total: all.length, pct: Math.round((done / all.length) * 100) }
  }, [progress])

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      progress, markComplete, getTotalProgress,
      sidebarOpen, setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
