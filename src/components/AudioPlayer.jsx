import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react'

export default function VerseAudioPlayer({ verses, onVerseChange, activeVerseNumber }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const audioRef = useRef(null)

  // Synchroniser avec la sélection externe (si l'utilisateur clique sur un verset)
  useEffect(() => {
    if (activeVerseNumber) {
      const index = verses.findIndex(v => v.number === activeVerseNumber)
      if (index !== -1 && index !== currentIndex) {
        setCurrentIndex(index)
      }
    }
  }, [activeVerseNumber, verses])

  // Charger le nouveau verset quand l'index change
  useEffect(() => {
    if (audioRef.current && verses[currentIndex]) {
      audioRef.current.src = verses[currentIndex].audioUrl
      audioRef.current.load()
      
      // Notifier le parent
      if (onVerseChange) onVerseChange(verses[currentIndex].number)
      
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay empêché:', e))
      }
    }
  }, [currentIndex])

  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(e => console.log('Autoplay bloqué:', e))
      setIsPlaying(true)
    }
  }

  const playNext = () => {
    if (currentIndex < verses.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsPlaying(false) // Fin de la sourate
    }
  }

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  // Auto-play suivant
  const handleEnded = () => {
    playNext()
  }

  if (!verses || verses.length === 0) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4 flex flex-col gap-3 my-4 sticky top-4 z-10 border border-amber-200 dark:border-amber-800/50 shadow-md">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Lecture continue (Verset {verses[currentIndex]?.number})
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500 font-arabic mt-1 truncate">
            {verses[currentIndex]?.ar}
          </p>
        </div>

        <div className="flex items-center gap-4 self-center">
          <button
            onClick={playPrevious}
            disabled={currentIndex === 0}
            className="p-2 text-amber-700 dark:text-amber-400 disabled:opacity-30 hover:bg-amber-200 dark:hover:bg-amber-800/50 rounded-full transition-colors"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center text-white transition-colors shadow-lg shadow-amber-500/30"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <button
            onClick={playNext}
            disabled={currentIndex === verses.length - 1}
            className="p-2 text-amber-700 dark:text-amber-400 disabled:opacity-30 hover:bg-amber-200 dark:hover:bg-amber-800/50 rounded-full transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
