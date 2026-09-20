import { useState, useEffect } from 'react'

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('noor-dark-mode')
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('noor-dark-mode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return { darkMode, toggleDarkMode }
}
