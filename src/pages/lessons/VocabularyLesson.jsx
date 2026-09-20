import { useState, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Volume2 } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { vocabulary } from '../../data/arabicLessons'

export default function VocabularyLesson() {
  const { category } = useParams()
  const { isLessonCompleted, completeLesson, addCardsToSRS } = useProgress()
  const [revealedWords, setRevealedWords] = useState(new Set())

  const vocabData = vocabulary[category]

  useEffect(() => {
    if (vocabData && vocabData.words) {
      const cards = vocabData.words.map((word, i) => ({
        id: `vocab_${category}_${i}`,
        type: 'vocab',
        front: word.ar,
        back: word.fr,
        extra: word.phonetic
      }))
      addCardsToSRS(cards)
    }
  }, [vocabData, category, addCardsToSRS])
  
  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.8
      const voices = window.speechSynthesis.getVoices()
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'))
      if (arabicVoice) utterance.voice = arabicVoice
      
      utterance.onerror = () => {
        alert("La synthèse vocale en arabe n'est pas supportée.")
      }
      window.speechSynthesis.speak(utterance)
    }
  }

  if (!vocabData) return <Navigate to="/arabe" replace />

  const lessonId = `vocab-${category}`
  const completed = isLessonCompleted(lessonId)

  const toggleReveal = (index) => {
    setRevealedWords((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const revealAll = () => {
    if (revealedWords.size === vocabData.words.length) {
      setRevealedWords(new Set())
    } else {
      setRevealedWords(new Set(vocabData.words.map((_, i) => i)))
    }
  }

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
              {vocabData.icon} {vocabData.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">{vocabData.titleAr}</p>
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
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>📖 Astuce :</strong> Cliquez sur l'icône œil pour révéler/masquer la traduction de chaque mot.
          Essayez de deviner la signification avant de la révéler !
        </p>
      </div>

      {/* Reveal All Toggle */}
      <div className="flex justify-end">
        <button
          onClick={revealAll}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {revealedWords.size === vocabData.words.length ? <EyeOff size={14} /> : <Eye size={14} />}
          {revealedWords.size === vocabData.words.length ? 'Tout masquer' : 'Tout révéler'}
        </button>
      </div>

      {/* Word List */}
      <div className="space-y-3">
        {vocabData.words.map((word, idx) => {
          const isRevealed = revealedWords.has(idx)

          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-arabic text-2xl text-gray-900 dark:text-white leading-relaxed">
                      {word.ar}
                    </span>
                    <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                      [{word.phonetic}]
                    </span>
                    <button 
                      onClick={() => playAudio(word.ar)}
                      className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors ml-2"
                      title="Écouter"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                  {isRevealed && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 animate-in">
                      → {word.fr}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleReveal(idx)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                >
                  {isRevealed ? (
                    <EyeOff size={16} className="text-gray-400" />
                  ) : (
                    <Eye size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to={`/arabe/quiz/${lessonId}`}
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
        >
          🎯 Passer le Quiz
        </Link>
        {!completed && (
          <button
            onClick={() => completeLesson(lessonId)}
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
