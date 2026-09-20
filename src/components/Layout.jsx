import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MobileNav from './MobileNav'

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Background patterns */}
      <div className="fixed inset-0 z-[-1] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-emerald-500/5 via-transparent to-gold/5 pointer-events-none"></div>

      {/* Sidebar (Desktop only) */}
      <div className="hidden md:block shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden relative">
        <div className="md:hidden sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
          <Header />
        </div>
        
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <Outlet />
        </main>
        
        <Footer />
        
        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 pb-safe">
          <MobileNav />
        </div>
      </div>
    </div>
  )
}
