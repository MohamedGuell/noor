import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Noor</span>
            <span className="font-arabic text-base">نور</span>
            <span>— La lumière du savoir</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <span>Fait avec</span>
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span>pour l'apprentissage de l'arabe et du Coran</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
