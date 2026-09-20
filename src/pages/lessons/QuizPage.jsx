import { useMemo } from 'react'
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import Quiz from '../../components/Quiz'
import { generateAlphabetQuiz, generateHarakatQuiz, generateVocabularyQuiz } from '../../data/quizData'

const quizConfig = {
  alphabet: {
    title: 'Quiz : L\'Alphabet',
    titleAr: 'اختبار الحروف',
    generator: () => generateAlphabetQuiz(10),
    lessonId: 'alphabet',
    backLink: '/arabe/alphabet',
    color: 'emerald',
  },
  harakat: {
    title: 'Quiz : Les Voyelles',
    titleAr: 'اختبار الحركات',
    generator: () => generateHarakatQuiz(10),
    lessonId: 'harakat',
    backLink: '/arabe/harakat',
    color: 'blue',
  },
  'vocab-salutations': {
    title: 'Quiz : Salutations',
    titleAr: 'اختبار التحيات',
    generator: () => generateVocabularyQuiz('salutations', 10),
    lessonId: 'vocab-salutations',
    backLink: '/arabe/vocabulaire/salutations',
    color: 'amber',
  },
  'vocab-famille': {
    title: 'Quiz : La Famille',
    titleAr: 'اختبار العائلة',
    generator: () => generateVocabularyQuiz('famille', 10),
    lessonId: 'vocab-famille',
    backLink: '/arabe/vocabulaire/famille',
    color: 'amber',
  },
  'vocab-nombres': {
    title: 'Quiz : Les Nombres',
    titleAr: 'اختبار الأعداد',
    generator: () => generateVocabularyQuiz('nombres', 10),
    lessonId: 'vocab-nombres',
    backLink: '/arabe/vocabulaire/nombres',
    color: 'amber',
  },
}

export default function QuizPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { completeLesson, saveQuizScore } = useProgress()

  const config = quizConfig[lessonId]
  
  // Appeler le hook avant toute condition de retour
  const questions = useMemo(() => config ? config.generator() : [], [config])

  if (!config) return <Navigate to="/arabe" replace />

  const handleComplete = (score) => {
    saveQuizScore(config.lessonId, score)
    if (score >= 70) {
      completeLesson(config.lessonId)
    }
    navigate('/arabe')
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={config.backLink}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {config.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">{config.titleAr}</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🎯 Obtenez au moins <strong className="text-emerald-600 dark:text-emerald-400">70%</strong> de bonnes réponses pour valider cette leçon.
        </p>
      </div>

      {/* Quiz Component */}
      <Quiz
        questions={questions}
        onComplete={handleComplete}
        lessonTitle={config.title}
      />
    </div>
  )
}
