import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, ArrowRightLeft, Settings2 } from 'lucide-react'

export default function VerseAudioPlayer({ verses, onVerseChange, activeVerseNumber }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Modes: 'surah', 'verse', 'loop-verse', 'range'
  const [mode, setMode] = useState('surah') 
  const [verseRepeatCount, setVerseRepeatCount] = useState(1)
  const [currentVerseRepeats, setCurrentVerseRepeats] = useState(0)
  
  const [showSettings, setShowSettings] = useState(false)
  
  // Range selection
  const [rangeStart, setRangeStart] = useState(verses[0]?.number || 1)
  const [rangeEnd, setRangeEnd] = useState(verses[verses.length - 1]?.number || verses.length)

  const audioRef = useRef(null)

  // Synchroniser avec la sélection externe (quand l'utilisateur clique sur un verset)
  useEffect(() => {
    if (activeVerseNumber) {
      const index = verses.findIndex(v => v.number === activeVerseNumber)
      if (index !== -1 && index !== currentIndex) {
        setCurrentVerseRepeats(0)
        playVerseByIndex(index)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVerseNumber, verses])

  // Gérer la lecture automatique lors de l'appui sur Play (si isPlaying change via le bouton togglePlay)
  useEffect(() => {
    if (isPlaying && audioRef.current && audioRef.current.paused) {
      // S'assurer que la source est chargée si ce n'est pas déjà le cas
      if (!audioRef.current.src && verses[currentIndex]) {
         audioRef.current.src = verses[currentIndex].audioUrl
         audioRef.current.load()
      }
      
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log('Autoplay bloqué:', e)
          setIsPlaying(false)
        })
      }
    } else if (!isPlaying && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
    }
  }, [isPlaying, currentIndex, verses])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const playVerseByIndex = (index) => {
    if (!audioRef.current || !verses[index]) return
    
    // Set src and play immediately to bypass strict browser autoplay policies
    audioRef.current.src = verses[index].audioUrl
    audioRef.current.load()
    
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
    if (currentIndex < verses.length - 1) {
      setCurrentVerseRepeats(0)
      playVerseByIndex(currentIndex + 1)
    } else {
      if (mode === 'surah') {
        setCurrentIndex(0)
        setIsPlaying(false)
        if (audioRef.current && verses[0]) {
          audioRef.current.src = verses[0].audioUrl
        }
      }
    }
  }

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentVerseRepeats(0)
      playVerseByIndex(currentIndex - 1)
    }
  }

  const handleEnded = () => {
    const currentVerseNum = verses[currentIndex].number

    if (mode === 'verse') {
      setIsPlaying(false)
      return
    }

    if (mode === 'loop-verse') {
      if (verseRepeatCount === 'infinite' || currentVerseRepeats < verseRepeatCount - 1) {
        setCurrentVerseRepeats(prev => prev + 1)
        audioRef.current.play().catch(console.error)
      } else {
        setCurrentVerseRepeats(0)
        playNext()
      }
      return
    }

    if (mode === 'range') {
      if (currentVerseNum < rangeEnd) {
        playNext()
      } else {
        const startIndex = verses.findIndex(v => v.number === rangeStart)
        if (startIndex !== -1) {
          setCurrentVerseRepeats(0)
          playVerseByIndex(startIndex)
        } else {
          setIsPlaying(false)
        }
      }
      return
    }

    // Default mode: 'surah'
    playNext()
  }

  if (!verses || verses.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col gap-4 my-6 sticky top-4 z-40 border border-emerald-100 dark:border-emerald-900/40 shadow-xl shadow-emerald-900/5">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      {/* Main Controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">
              Verset {verses[currentIndex]?.number}
            </span>
            <span className="text-xs text-gray-400">
              {mode === 'surah' && 'Sourate complète'}
              {mode === 'verse' && '1 Verset'}
              {mode === 'loop-verse' && 'Boucle'}
              {mode === 'range' && `Plage: ${rangeStart}-${rangeEnd}`}
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
            onClick={playNext}
            disabled={currentIndex === verses.length - 1}
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
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Mode de lecture
            </label>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setMode('surah')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'surah' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Continue
              </button>
              <button 
                onClick={() => setMode('verse')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'verse' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                1 Verset
              </button>
              <button 
                onClick={() => setMode('loop-verse')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors ${mode === 'loop-verse' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Repeat1 size={14} /> Répéter
              </button>
              <button 
                onClick={() => setMode('range')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors ${mode === 'range' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <ArrowRightLeft size={14} /> Plage
              </button>
            </div>
          </div>

          {/* Contextual Options based on Mode */}
          <div className="space-y-2">
            {mode === 'loop-verse' && (
              <>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Répétitions du verset
                </label>
                <div className="flex gap-2">
                  {[2, 3, 5, 10, 'infinite'].map(count => (
                    <button
                      key={count}
                      onClick={() => setVerseRepeatCount(count)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${verseRepeatCount === count ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      {count === 'infinite' ? '∞' : `${count}x`}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mode === 'range' && (
              <>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sélectionner la plage (versets)
                </label>
                <div className="flex items-center gap-2">
                  <select 
                    value={rangeStart} 
                    onChange={e => setRangeStart(Number(e.target.value))}
                    className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    {verses.map(v => (
                      <option key={v.number} value={v.number}>{v.number}</option>
                    ))}
                  </select>
                  <span className="text-gray-400">à</span>
                  <select 
                    value={rangeEnd} 
                    onChange={e => setRangeEnd(Number(e.target.value))}
                    className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    {verses.filter(v => v.number >= rangeStart).map(v => (
                      <option key={v.number} value={v.number}>{v.number}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
