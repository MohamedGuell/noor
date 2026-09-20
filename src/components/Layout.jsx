import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
      {/* Sidebar (Desktop only) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        <Header />
        
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
        
        <Footer />
        <MobileNav />
      </div>
    </div>
  )
}
