import { useState } from 'react'

export default function Flashcard({ card, onGrade }) {
  const [flipped, setFlipped] = useState(false)

  // Grade: 1 (À revoir), 3 (Difficile), 4 (Correct), 5 (Facile)

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 h-96">
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div 
          onClick={() => !flipped && setFlipped(true)}
          className={`absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-emerald-100 dark:border-emerald-900/30 shadow-xl cursor-pointer hover:border-emerald-300 transition-colors`}
        >
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
            {card.type === 'vocab' ? 'Vocabulaire' : 'Alphabet'}
          </span>
          <h2 className="font-arabic text-6xl sm:text-7xl text-gray-900 dark:text-white leading-tight">
            {card.front}
          </h2>
          <p className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
            Appuyez pour retourner la carte
          </p>
        </div>

        {/* Back */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-emerald-500 shadow-xl shadow-emerald-500/10`}
        >
          <h2 className="font-arabic text-4xl text-gray-900 dark:text-white mb-2">
            {card.front}
          </h2>
          {card.extra && (
            <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-4">
              [{card.extra}]
            </p>
          )}
          <p className="text-2xl text-gray-700 dark:text-gray-200 mb-8 font-semibold">
            {card.back}
          </p>

          <div className="w-full grid grid-cols-3 gap-2 mt-auto">
            <button
              onClick={() => {
                setFlipped(false)
                onGrade(1) // Fail
              }}
              className="flex flex-col items-center justify-center py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-colors"
            >
              <span className="font-bold">À revoir</span>
              <span className="text-xs opacity-70">&lt; 1 min</span>
            </button>
            <button
              onClick={() => {
                setFlipped(false)
                onGrade(4) // Good
              }}
              className="flex flex-col items-center justify-center py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors"
            >
              <span className="font-bold">Correct</span>
              <span className="text-xs opacity-70">~ 1 j</span>
            </button>
            <button
              onClick={() => {
                setFlipped(false)
                onGrade(5) // Easy
              }}
              className="flex flex-col items-center justify-center py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl transition-colors"
            >
              <span className="font-bold">Facile</span>
              <span className="text-xs opacity-70">~ 4 j</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
