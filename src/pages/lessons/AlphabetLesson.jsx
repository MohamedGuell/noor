import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Eye, EyeOff, Volume2 } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { alphabet } from '../../data/arabicLessons'

export default function AlphabetLesson() {
  const { isLessonCompleted, completeLesson, addCardsToSRS } = useProgress()
  const completed = isLessonCompleted('alphabet')
  const [selectedLetter, setSelectedLetter] = useState(alphabet[0])
  const [showExample, setShowExample] = useState(true)

  useEffect(() => {
    if (alphabet) {
      const cards = alphabet.map((letter, i) => ({
        id: `alphabet_${i}`,
        type: 'alphabet',
        front: letter.letter || letter.ar,
        back: letter.name || letter.fr,
        extra: letter.phonetic || letter.name
      }))
      addCardsToSRS(cards)
    }
  }, [addCardsToSRS])

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.8
      
      // Check if an Arabic voice is available (mobile browsers sometimes don't have it)
      const voices = window.speechSynthesis.getVoices()
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'))
      if (arabicVoice) {
        utterance.voice = arabicVoice
      }
      
      utterance.onerror = (e) => {
        console.warn('Erreur audio speechSynthesis:', e)
        alert("La synthèse vocale en arabe n'est pas supportée par votre navigateur.")
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      alert("Votre navigateur ne supporte pas l'audio.")
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/arabe"
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            L'Alphabet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Apprenez les 28 lettres de l'alphabet arabe.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
        {alphabet.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedLetter(item)}
            className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
              selectedLetter?.id === item.id
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            <span className="font-arabic text-2xl text-gray-900 dark:text-white mb-1">
              {item.letter}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              {item.phonetic}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Letter Detail */}
      {selectedLetter && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg animate-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const idx = alphabet.findIndex(l => l.id === selectedLetter.id)
                  if (idx > 0) setSelectedLetter(alphabet[idx - 1])
                }}
                disabled={selectedLetter.id === 1}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="text-center flex flex-col items-center">
                <span className="font-arabic text-6xl text-emerald-600 dark:text-emerald-400">
                  {selectedLetter.letter}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedLetter.name} <span className="text-gray-500 font-normal">[{selectedLetter.phonetic}]</span>
                  </p>
                  <button 
                    onClick={() => playAudio(selectedLetter.letter)}
                    className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                    title="Écouter"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  const idx = alphabet.findIndex(l => l.id === selectedLetter.id)
                  if (idx < alphabet.length - 1) setSelectedLetter(alphabet[idx + 1])
                }}
                disabled={selectedLetter.id === 28}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Letter Forms */}
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Formes de la lettre
          </h4>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Isolée', form: selectedLetter.isolated },
              { label: 'Début', form: selectedLetter.initial },
              { label: 'Milieu', form: selectedLetter.medial },
              { label: 'Fin', form: selectedLetter.final },
            ].map(({ label, form }) => (
              <div
                key={label}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center"
              >
                <span className="font-arabic text-3xl text-gray-900 dark:text-white block mb-1">
                  {form}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          {/* Example Word */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Exemple de mot
            </h4>
            <button
              onClick={() => setShowExample(!showExample)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showExample ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {showExample && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
              <span className="font-arabic text-3xl text-emerald-700 dark:text-emerald-400 block mb-2">
                {selectedLetter.example}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedLetter.examplePhonetic} — <strong>{selectedLetter.exampleFr}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/arabe/quiz/alphabet"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
        >
          🎯 Passer le Quiz
        </Link>
        {!completed && (
          <button
            onClick={() => completeLesson('alphabet')}
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
