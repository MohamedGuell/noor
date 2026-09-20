import { Link, useLocation } from 'react-router-dom'
import { Sparkles, BookOpen, BookMarked, Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Sidebar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useTheme()

  const navLinks = [
    { to: '/', label: 'Accueil', icon: Sparkles },
    { to: '/arabe', label: 'Apprendre l\'Arabe', icon: BookOpen },
    { to: '/coran', label: 'Étudier le Coran', icon: BookMarked },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
      {/* Logo Sidebar & Dark mode */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-emerald-500/40 transition-shadow">
            <span className="text-white font-arabic text-sm font-bold">ن</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">
              Noor
            </h1>
          </div>
        </Link>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Basculer le mode sombre"
        >
          {darkMode ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-gray-600" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
          Menu Principal
        </p>
        {navLinks.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic mb-1">
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </p>
          <p className="text-[10px] text-gray-400">
            "Et dis : Ô mon Seigneur, accroît mes connaissances !"
          </p>
        </div>
      </div>
    </aside>
  )
}
