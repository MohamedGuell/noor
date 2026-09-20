import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, BookMarked } from 'lucide-react'

export default function MobileNav() {
  const location = useLocation()

  const navItems = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/arabe', label: 'Arabe', icon: BookOpen },
    { to: '/coran', label: 'Coran', icon: BookMarked },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
