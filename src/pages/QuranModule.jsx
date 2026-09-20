import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookMarked, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Eye, EyeOff } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { surahs, tajweedRules } from '../data/quranData'
import AudioPlayer from '../components/AudioPlayer'

export default function QuranModule() {
  const { isSurahMemorized, toggleSurahMemorized } = useProgress()
  const [expandedSurah, setExpandedSurah] = useState(null)
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)
  const [activeTab, setActiveTab] = useState('surahs') // 'surahs' or 'tajweed'
  const [expandedTajweed, setExpandedTajweed] = useState(null)

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Étudier le Coran
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Lisez, mémorisez et apprenez les règles du Tajweed.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('surahs')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'surahs'
              ? 'bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookMarked size={16} />
          Sourates
        </button>
        <button
          onClick={() => setActiveTab('tajweed')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'tajweed'
              ? 'bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpen size={16} />
          Tajweed
        </button>
      </div>

      {/* Surahs Tab */}
      {activeTab === 'surahs' && (
        <div className="space-y-6">
          {/* Display Toggles */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showTransliteration
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {showTransliteration ? <Eye size={12} /> : <EyeOff size={12} />}
              Translittération
            </button>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showTranslation
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {showTranslation ? <Eye size={12} /> : <EyeOff size={12} />}
              Traduction française
            </button>
          </div>

          {/* Surah List */}
          <div className="space-y-4">
            {surahs.map((surah) => {
              const isExpanded = expandedSurah === surah.number
              const memorized = isSurahMemorized(surah.number)

              return (
                <div
                  key={surah.number}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* Surah Header */}
                  <button
                    onClick={() => setExpandedSurah(isExpanded ? null : surah.number)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">
                        {surah.number}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {surah.nameFr}
                          </h3>
                          {memorized && (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-arabic">{surah.nameAr}</span>
                          <span>•</span>
                          <span>{surah.versesCount} versets</span>
                          <span>•</span>
                          <span>{surah.revelationType}</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </button>

                  {/* Expanded: Verses */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <div className="px-5">
                        <AudioPlayer surahNumber={surah.number} />
                      </div>
                      
                      {/* Bismillah ornament */}
                      {surah.number !== 1 && (
                        <div className="text-center pb-4 pt-2">
                          <p className="font-arabic text-xl text-amber-800 dark:text-amber-400">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </p>
                        </div>
                      )}

                      {/* Verses */}
                      <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {surah.verses.map((verse) => (
                          <div key={verse.number} className="p-5">
                            {/* Verse Number */}
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 mt-2">
                                {verse.number}
                              </span>
                              <div className="flex-1 space-y-2">
                                {/* Arabic Text */}
                                <p className="font-arabic text-2xl sm:text-3xl text-gray-900 dark:text-white text-right leading-[2.5] tracking-wide">
                                  {verse.ar}
                                </p>

                                {/* Transliteration */}
                                {showTransliteration && (
                                  <p className="text-sm text-amber-700 dark:text-amber-400 italic">
                                    {verse.transliteration}
                                  </p>
                                )}

                                {/* French Translation */}
                                {showTranslation && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {verse.fr}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Memorized Toggle */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/30 flex justify-center">
                        <button
                          onClick={() => toggleSurahMemorized(surah.number)}
                          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                            memorized
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20'
                          }`}
                        >
                          <CheckCircle2 size={16} />
                          {memorized ? 'Mémorisée ✓' : 'Marquer comme mémorisée'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tajweed Tab */}
      {activeTab === 'tajweed' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>📖 Le Tajweed</strong> (تجويد) est l'ensemble des règles qui régissent la prononciation
              correcte du Coran. Maîtriser ces règles permet de réciter le Coran avec précision et beauté.
            </p>
          </div>

          {tajweedRules.map((category) => {
            const isExpanded = expandedTajweed === category.id

            return (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTajweed(isExpanded ? null : category.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                    <span className="font-arabic text-sm text-gray-500 dark:text-gray-400">
                      {category.titleAr}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 p-5 space-y-4">
                    {category.rules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {rule.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {rule.description}
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                          <p className="font-arabic text-xl text-amber-700 dark:text-amber-400 text-right mb-1">
                            {rule.example}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {rule.exampleFr}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
