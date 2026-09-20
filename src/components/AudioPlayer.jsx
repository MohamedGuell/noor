import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

export default function AudioPlayer({ surahNumber }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  // API Alquran.cloud (CDN Islamic Network) pour la sourate complète
  // Utilise la récitation de Mishary Rashid Alafasy
  const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`

  useEffect(() => {
    // Si la sourate change, on reset le player
    setIsPlaying(false)
    setProgress(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
    }
  }, [surahNumber])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime
      setProgress(seekTime)
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 flex flex-col gap-3 my-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center text-white transition-colors shadow-md shadow-amber-500/20"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
        
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-xs text-amber-700 dark:text-amber-400 font-medium">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-amber-200 dark:bg-amber-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>
        
        <Volume2 size={20} className="text-amber-600 dark:text-amber-500" />
      </div>
    </div>
  )
}
