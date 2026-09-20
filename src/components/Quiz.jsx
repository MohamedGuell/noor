import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Target } from 'lucide-react'

export default function Quiz({ questions: questionsProp, onComplete, lessonTitle }) {
  const questions = useMemo(() => questionsProp, [questionsProp])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const current = questions[currentIndex]
  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100

  const handleAnswer = (answer) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)
    if (answer === current.correctAnswer) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsFinished(true)
      const finalScore = Math.round(((score + (selectedAnswer === current.correctAnswer ? 0 : 0)) / questions.length) * 100)
      // Score is already counted in handleAnswer
    }
  }

  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setIsFinished(false)
  }

  const finalPercentage = Math.round((score / questions.length) * 100)

  if (isFinished) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
          finalPercentage >= 70
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-amber-100 dark:bg-amber-900/30'
        }`}>
          {finalPercentage >= 70 ? (
            <Trophy size={36} className="text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Target size={36} className="text-amber-600 dark:text-amber-400" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {finalPercentage >= 70 ? 'Excellent travail ! 🎉' : 'Continuez à apprendre ! 💪'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Vous avez obtenu <strong className="text-emerald-600 dark:text-emerald-400">{score}/{questions.length}</strong> bonnes réponses ({finalPercentage}%)
        </p>

        {/* Score bar */}
        <div className="max-w-xs mx-auto mb-8">
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                finalPercentage >= 70
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600'
              }`}
              style={{ width: `${finalPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors"
          >
            <RotateCcw size={16} />
            Recommencer
          </button>
          {finalPercentage >= 70 && onComplete && (
            <button
              onClick={() => onComplete(finalPercentage)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 size={16} />
              Valider et continuer
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {currentIndex + 1}/{questions.length}
        </span>
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
          {score} ✓
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {current.question}
        </h3>

        {/* Display (letter/word shown) */}
        {current.display && (
          <div className="text-center py-6 mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <span className={`${current.displayClass || 'text-4xl'} text-gray-900 dark:text-white`}>
              {current.display}
            </span>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {current.options.map((option, idx) => {
            let style = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'

            if (isAnswered) {
              if (option === current.correctAnswer) {
                style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500/20'
              } else if (option === selectedAnswer && option !== current.correctAnswer) {
                style = 'border-red-500 bg-red-50 dark:bg-red-900/30 ring-2 ring-red-500/20'
              } else {
                style = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-50'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${style} ${
                  !isAnswered ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span className={`${current.optionClass || 'text-sm'} font-medium text-gray-900 dark:text-white`}>
                  {option}
                </span>
                {isAnswered && option === current.correctAnswer && (
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                )}
                {isAnswered && option === selectedAnswer && option !== current.correctAnswer && (
                  <XCircle size={18} className="text-red-500 flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Feedback + Next */}
        {isAnswered && (
          <div className="mt-6 flex items-center justify-between">
            <p className={`text-sm font-medium ${
              selectedAnswer === current.correctAnswer
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {selectedAnswer === current.correctAnswer
                ? '✅ Bonne réponse !'
                : `❌ La bonne réponse était : ${current.correctAnswer}`
              }
            </p>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
            >
              {currentIndex < questions.length - 1 ? 'Suivant' : 'Voir les résultats'}
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
