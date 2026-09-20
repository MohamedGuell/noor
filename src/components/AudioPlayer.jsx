import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, ArrowRightLeft, Settings2 } from 'lucide-react'

export default function VerseAudioPlayer({ verses, onVerseChange, activeVerseNumber }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Modes: 'surah', 'verse', 'loop-verse', 'range'
  const [playScope, setPlayScope] = useState('surah') // 'surah', 'verse', 'range'
  
  // Repeats
  const [verseRepeatCount, setVerseRepeatCount] = useState(1)
  const [currentVerseRepeats, setCurrentVerseRepeats] = useState(0)
  const [scopeRepeatCount, setScopeRepeatCount] = useState(1)
  const [currentScopeRepeats, setCurrentScopeRepeats] = useState(0)
  
  const [showSettings, setShowSettings] = useState(false)
  
  // Range selection
  const [rangeStart, setRangeStart] = useState(verses[0]?.number || 1)
  const [rangeEnd, setRangeEnd] = useState(verses[verses.length - 1]?.number || verses.length)

  const audioRef = useRef(null)
  
  // Synchroniser avec la sélection externe
  useEffect(() => {
    if (activeVerseNumber) {
      const index = verses.findIndex(v => v.number === activeVerseNumber)
      if (index !== -1 && index !== currentIndex) {
        setCurrentVerseRepeats(0)
        setCurrentScopeRepeats(0)
        playVerseByIndex(index)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVerseNumber, verses])

  // Gérer la lecture automatique si isPlaying change
  useEffect(() => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      if (!audioRef.current.src && verses[currentIndex]) {
         audioRef.current.src = verses[currentIndex].audioUrl
      }
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => {
          console.log('Autoplay bloqué:', e)
          setIsPlaying(false)
        })
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentIndex, verses])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const playVerseByIndex = (index) => {
    if (!verses[index] || !audioRef.current) return
    
    audioRef.current.src = verses[index].audioUrl
    
    if (isPlaying) {
      audioRef.current.play().catch(e => {
        console.log('Autoplay bloqué:', e)
        setIsPlaying(false)
      })
    }
    
    setCurrentIndex(index)
    if (onVerseChange) onVerseChange(verses[index].number)
  }

  const playNext = () => {
    setCurrentVerseRepeats(0)
    let isScopeEnd = false
    let nextIndex = currentIndex + 1
    let startIndex = 0

    if (playScope === 'verse') {
      isScopeEnd = true
      startIndex = currentIndex
    } else if (playScope === 'range') {
      const endIndex = verses.findIndex(v => v.number === rangeEnd)
      startIndex = Math.max(0, verses.findIndex(v => v.number === rangeStart))
      if (currentIndex >= endIndex) isScopeEnd = true
    } else {
      if (currentIndex >= verses.length - 1) isScopeEnd = true
    }

    if (isScopeEnd) {
      if (scopeRepeatCount === 'infinite' || currentScopeRepeats < scopeRepeatCount - 1) {
        setCurrentScopeRepeats(prev => prev + 1)
        playVerseByIndex(startIndex)
      } else {
        setCurrentScopeRepeats(0)
        setIsPlaying(false)
        setCurrentIndex(startIndex)
        if (audioRef.current && verses[startIndex]) {
          audioRef.current.src = verses[startIndex].audioUrl
        }
      }
    } else {
      if (nextIndex < verses.length) playVerseByIndex(nextIndex)
    }
  }

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentVerseRepeats(0)
      playVerseByIndex(currentIndex - 1)
    }
  }

  const handleEnded = () => {
    // 1. Check verse repeat
    if (verseRepeatCount === 'infinite' || currentVerseRepeats < verseRepeatCount - 1) {
      setCurrentVerseRepeats(prev => prev + 1)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(console.error)
      }
      return
    }

    // 2. Move to next step in scope
    playNext()
  }

  const handlePause = () => {
    if (audioRef.current && !audioRef.current.ended) {
      setIsPlaying(false)
    }
  }

  if (!verses || verses.length === 0) return null

  const repeatOptions = [1, 2, 3, 5, 10, 'infinite']

  return (
    <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col gap-4 my-6 sticky top-4 z-40 border border-emerald-100 dark:border-emerald-900/40 shadow-xl shadow-emerald-900/5 transition-all">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onPause={handlePause}
        onPlay={() => setIsPlaying(true)}
      />
      
      {/* Main Controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">
              Verset {verses[currentIndex]?.number}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              {playScope === 'surah' && 'Sourate complète'}
              {playScope === 'verse' && 'Verset unique'}
              {playScope === 'range' && `Plage: ${rangeStart}-${rangeEnd}`}
              
              {(verseRepeatCount !== 1 || scopeRepeatCount !== 1) && (
                <span className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] uppercase tracking-wider">
                  <Repeat1 size={10} /> 
                  {verseRepeatCount !== 1 && `Verset ${verseRepeatCount === 'infinite' ? '∞' : verseRepeatCount + 'x'}`}
                  {verseRepeatCount !== 1 && scopeRepeatCount !== 1 && ' • '}
                  {scopeRepeatCount !== 1 && `Sélection ${scopeRepeatCount === 'infinite' ? '∞' : scopeRepeatCount + 'x'}`}
                </span>
              )}
            </span>
          </div>
          <p className="text-sm font-arabic text-gray-800 dark:text-gray-200 truncate pr-4">
            {verses[currentIndex]?.ar}
          </p>
        </div>

        <div className="flex items-center gap-3 self-center sm:self-end">
          <button
            onClick={playPrevious}
            disabled={currentIndex === 0}
            className="p-2.5 text-emerald-700 dark:text-emerald-400 disabled:opacity-30 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-full transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 flex items-center justify-center text-white transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <button
            onClick={() => {
              setCurrentVerseRepeats(0)
              let nextIndex = currentIndex + 1
              if (playScope === 'range') {
                const endIndex = verses.findIndex(v => v.number === rangeEnd)
                if (currentIndex >= endIndex) {
                  nextIndex = verses.findIndex(v => v.number === rangeStart)
                }
              }
              if (nextIndex < verses.length) playVerseByIndex(nextIndex)
            }}
            disabled={playScope === 'surah' && currentIndex === verses.length - 1}
            className="p-2.5 text-emerald-700 dark:text-emerald-400 disabled:opacity-30 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-full transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Toggle Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`ml-2 p-2.5 rounded-full transition-colors ${
              showSettings 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Settings2 size={20} />
          </button>
        </div>
      </div>

      {/* Advanced Settings Panel */}
      {showSettings && (
        <div className="pt-5 mt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2">
          
          {/* Column 1: Scope */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRightLeft size={14} /> Étendue de lecture
              </label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setPlayScope('surah')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${playScope === 'surah' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Sourate
                </button>
                <button 
                  onClick={() => setPlayScope('range')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${playScope === 'range' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Plage
                </button>
                <button 
                  onClick={() => setPlayScope('verse')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${playScope === 'verse' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  1 Verset
                </button>
              </div>
            </div>

            {playScope === 'range' && (
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Sélectionner les versets
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <span className="px-3 text-xs text-gray-400">De</span>
                    <select 
                      value={rangeStart} 
                      onChange={e => setRangeStart(Number(e.target.value))}
                      className="flex-1 bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 py-1.5 focus:ring-0 cursor-pointer"
                    >
                      {verses.map(v => (
                        <option key={v.number} value={v.number}>{v.number}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <span className="px-3 text-xs text-gray-400">À</span>
                    <select 
                      value={rangeEnd} 
                      onChange={e => setRangeEnd(Number(e.target.value))}
                      className="flex-1 bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 py-1.5 focus:ring-0 cursor-pointer"
                    >
                      {verses.filter(v => v.number >= rangeStart).map(v => (
                        <option key={v.number} value={v.number}>{v.number}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Repeats */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat1 size={14} /> Répéter chaque verset
              </label>
              <div className="flex flex-wrap gap-1.5">
                {repeatOptions.map(count => (
                  <button
                    key={`v-${count}`}
                    onClick={() => {
                      setVerseRepeatCount(count)
                      setCurrentVerseRepeats(0)
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors border flex items-center justify-center ${verseRepeatCount === count ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {count === 'infinite' ? '∞' : `${count}x`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat1 size={14} /> Répéter la sélection
              </label>
              <div className="flex flex-wrap gap-1.5">
                {repeatOptions.map(count => (
                  <button
                    key={`s-${count}`}
                    onClick={() => {
                      setScopeRepeatCount(count)
                      setCurrentScopeRepeats(0)
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors border flex items-center justify-center ${scopeRepeatCount === count ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {count === 'infinite' ? '∞' : `${count}x`}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 pt-1 leading-tight">
                Idéal pour la mémorisation : Jouez chaque verset 3x, et répétez toute la plage 5x.
              </p>
            </div>
          </div>
          
        </div>
      )}
    </div>
  )
}
