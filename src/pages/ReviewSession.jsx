import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Brain, Target } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import Flashcard from '../components/Flashcard'

export default function ReviewSession() {
  const { getDueCards, updateCardProgress } = useProgress()
  const navigate = useNavigate()
  
  const dueCards = useMemo(() => getDueCards(), [getDueCards])
  
  const [queue, setQueue] = useState(dueCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, failed: 0 })
  const [isFinished, setIsFinished] = useState(false)

  if (dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500">
          <CheckCircle size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tout est à jour !
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Vous n'avez plus de cartes à réviser pour le moment. Revenez plus tard pour consolider votre mémoire.
          </p>
        </div>
        <Link 
          to="/"
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  const currentCard = queue[currentIndex]

  const handleGrade = (grade) => {
    // Enregistrer la note dans le SRS
    updateCardProgress(currentCard.id, grade)

    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      failed: grade === 1 ? prev.failed + 1 : prev.failed
    }))

    // Si on a mis 1 (Fail), on remet la carte à la fin de la file pour la revoir aujourd'hui
    if (grade === 1) {
      setQueue(prev => [...prev, currentCard])
    }

    // Passer à la carte suivante
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 relative z-10">
            <Brain size={64} />
          </div>
          <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 dark:opacity-10 rounded-full" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Session terminée ! 🎉
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Excellente session d'apprentissage.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
            <Target size={24} className="text-emerald-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {sessionStats.reviewed}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Révisions</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
            <Brain size={24} className="text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(((sessionStats.reviewed - sessionStats.failed) / sessionStats.reviewed) * 100)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Rétention</span>
          </div>
        </div>

        <Link 
          to="/"
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
        >
          Retour au Dashboard
        </Link>
      </div>
    )
  }

  const progressPct = Math.round((currentIndex / queue.length) * 100)

  return (
    <div className="space-y-8 pb-20 md:pb-0 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <span className="font-medium text-gray-500 dark:text-gray-400">
          Carte {currentIndex + 1} sur {queue.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Flashcard Area */}
      <div className="py-4">
        {currentCard && (
          <Flashcard 
            key={`${currentCard.id}-${currentIndex}`} // Force re-render if it's the same card pushed to back
            card={currentCard} 
            onGrade={handleGrade} 
          />
        )}
      </div>
    </div>
  )
}
