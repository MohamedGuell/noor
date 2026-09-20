import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { harakat } from '../../data/arabicLessons'

export default function HarakatLesson() {
  const { isLessonCompleted, completeLesson } = useProgress()
  const [activeHaraka, setActiveHaraka] = useState(harakat[0])
  const completed = isLessonCompleted('harakat')

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/arabe"
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Les Voyelles (Harakat)
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">الحركات</p>
          </div>
        </div>
        {completed && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
            <CheckCircle2 size={14} />
            Terminée
          </span>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>📖 Les Harakat</strong> sont les signes diacritiques placés sur ou sous les lettres arabes
          pour indiquer les voyelles courtes. Elles sont essentielles pour lire correctement l'arabe.
        </p>
      </div>

      {/* Harakat Tabs */}
      <div className="flex flex-wrap gap-2">
        {harakat.map((h) => (
          <button
            key={h.id}
            onClick={() => setActiveHaraka(h)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeHaraka.id === h.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="font-arabic text-lg">{h.symbol}</span>
            {h.name}
          </button>
        ))}
      </div>

      {/* Active Haraka Detail */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <span className="font-arabic text-7xl text-blue-600 dark:text-blue-400 block mb-2">
            {activeHaraka.nameAr}
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{activeHaraka.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Son : <strong className="text-blue-600 dark:text-blue-400">{activeHaraka.sound}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            {activeHaraka.description}
          </p>
        </div>

        {/* Examples Grid */}
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
          Exemples de syllabes
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {activeHaraka.examples.map((ex, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <span className="font-arabic text-4xl text-gray-900 dark:text-white block mb-2">
                {ex.letter}
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block">
                {ex.phonetic}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {ex.meaning}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/arabe/quiz/harakat"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
        >
          🎯 Passer le Quiz
        </Link>
        {!completed && (
          <button
            onClick={() => completeLesson('harakat')}
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            <CheckCircle2 size={18} />
            Marquer comme terminée
          </button>
        )}
      </div>
    </div>
  )
}
