import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookMarked, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { tajweedRules } from '../data/quranData'
import VerseAudioPlayer from '../components/AudioPlayer'
import { fetchSurahsList, fetchSurah } from '../services/api'

export default function QuranModule() {
  const { isSurahMemorized, toggleSurahMemorized } = useProgress()
  const [surahsList, setSurahsList] = useState([])
  const [expandedSurah, setExpandedSurah] = useState(null)
  const [surahDetails, setSurahDetails] = useState({}) // Cache pour les sourates téléchargées
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isLoadingSurah, setIsLoadingSurah] = useState(false)
  const [activeVerse, setActiveVerse] = useState(null) // Pour tracker le verset en lecture continue
  
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)
  const [activeTab, setActiveTab] = useState('surahs')
  const [expandedTajweed, setExpandedTajweed] = useState(null)

  // Charger la liste des 114 sourates au montage
  useEffect(() => {
    const loadSurahs = async () => {
      const list = await fetchSurahsList()
      setSurahsList(list)
      setIsLoadingList(false)
    }
    loadSurahs()
  }, [])

  // Gérer l'ouverture d'une sourate
  const handleToggleSurah = async (surahNumber) => {
    if (expandedSurah === surahNumber) {
      setExpandedSurah(null)
      return
    }
    
    setExpandedSurah(surahNumber)
    
    // Si pas encore en cache, on la fetch
    if (!surahDetails[surahNumber]) {
      setIsLoadingSurah(true)
      const data = await fetchSurah(surahNumber)
      if (data) {
        setSurahDetails(prev => ({ ...prev, [surahNumber]: data }))
      }
      setIsLoadingSurah(false)
    }
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50 transition-all"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Étudier le Coran
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Lisez, écoutez et mémorisez les 114 sourates.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <button
          onClick={() => setActiveTab('surahs')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'surahs'
              ? 'bg-gradient-to-r from-gold to-gold-light text-slate-900 shadow-md scale-[1.02]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <BookMarked size={18} />
          Sourates
        </button>
        <button
          onClick={() => setActiveTab('tajweed')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'tajweed'
              ? 'bg-gradient-to-r from-gold to-gold-light text-slate-900 shadow-md scale-[1.02]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <BookOpen size={18} />
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                showTransliteration
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {showTransliteration ? <Eye size={14} /> : <EyeOff size={14} />}
              Translittération
            </button>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                showTranslation
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {showTranslation ? <Eye size={14} /> : <EyeOff size={14} />}
              Traduction française
            </button>
          </div>

          {/* Loading State */}
          {isLoadingList ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
          ) : (
            <div className="space-y-4">
              {surahsList.map((surahListInfo) => {
                const isExpanded = expandedSurah === surahListInfo.number
                const memorized = isSurahMemorized(surahListInfo.number)
                const fullSurah = surahDetails[surahListInfo.number]

                return (
                  <div
                    key={surahListInfo.number}
                    className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-emerald-500/50 shadow-xl shadow-emerald-900/10' : 'border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/30'}`}
                  >
                    {/* Surah Header */}
                    <button
                      onClick={() => handleToggleSurah(surahListInfo.number)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm shrink-0">
                          {surahListInfo.number}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {surahListInfo.englishNameTranslation}
                            </h3>
                            {memorized && (
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-arabic">{surahListInfo.name}</span>
                            <span>•</span>
                            <span>{surahListInfo.numberOfAyahs} versets</span>
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400 shrink-0" />
                      )}
                    </button>

                    {/* Expanded: Verses */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-gray-700">
                        {isLoadingSurah && !fullSurah ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-amber-500" size={24} />
                          </div>
                        ) : fullSurah ? (
                          <>
                            <div className="px-5">
                              <VerseAudioPlayer 
                                verses={fullSurah.verses} 
                                activeVerseNumber={activeVerse}
                                onVerseChange={(num) => setActiveVerse(num)}
                              />
                            </div>
                            
                            {/* Bismillah ornament */}
                            {surahListInfo.number !== 1 && (
                              <div className="text-center pb-4 pt-2">
                                <p className="font-arabic text-xl text-amber-800 dark:text-amber-400">
                                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                </p>
                              </div>
                            )}

                            {/* Verses */}
                            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                              {fullSurah.verses.map((verse) => (
                                <div 
                                  key={verse.number} 
                                  id={`verse-${verse.number}`}
                                  onClick={() => setActiveVerse(verse.number)}
                                  className={`p-5 cursor-pointer transition-colors ${
                                    activeVerse === verse.number 
                                      ? 'bg-amber-50/50 dark:bg-amber-900/10' 
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                  }`}
                                >
                                  {/* Verse Number */}
                                  <div className="flex items-start gap-3">
                                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-2 transition-colors ${
                                      activeVerse === verse.number
                                        ? 'bg-amber-500 text-white shadow-md'
                                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                    }`}>
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
                                onClick={() => toggleSurahMemorized(surahListInfo.number)}
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
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
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
