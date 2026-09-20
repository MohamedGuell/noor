import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Moon, Sun, Sparkles } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 md:hidden">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo (Mobile only) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-arabic text-sm font-bold">ن</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">
                Noor
              </h1>
            </div>
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Basculer le mode sombre"
          >
            {darkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-gray-600" />}
          </button>
        </div>
      </div>
    </header>
  )
}
