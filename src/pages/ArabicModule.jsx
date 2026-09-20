import { Link } from 'react-router-dom'
import { BookOpen, Languages, MessageSquare, ChevronRight, CheckCircle2, Lock, ArrowLeft } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { arabicLevels } from '../data/arabicLessons'

const iconMap = {
  BookOpen,
  Languages,
  MessageSquare,
}

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
    progress: 'from-emerald-500 to-emerald-600',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
    progress: 'from-blue-500 to-blue-600',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    progress: 'from-amber-500 to-amber-600',
  },
}

export default function ArabicModule() {
  const { progress, isLessonCompleted } = useProgress()

  const getLessonLink = (lesson) => {
    if (lesson.type === 'alphabet') return '/arabe/alphabet'
    if (lesson.type === 'harakat') return '/arabe/harakat'
    if (lesson.type === 'vocabulary') return `/arabe/vocabulaire/${lesson.category}`
    return '#'
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Apprendre l'Arabe
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Progressez étape par étape à travers les niveaux.
          </p>
        </div>
      </div>

      {/* Levels */}
      <div className="space-y-6">
        {arabicLevels.map((level) => {
          const colors = colorMap[level.color]
          const Icon = iconMap[level.icon]
          const isLocked = level.id > progress.currentLevel
          const completedInLevel = level.lessons.filter(l => isLessonCompleted(l.id)).length
          const levelProgress = Math.round((completedInLevel / level.totalLessons) * 100)
          const isComplete = completedInLevel === level.totalLessons

          return (
            <div
              key={level.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isLocked
                  ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
                  : `bg-white dark:bg-gray-800 ${colors.border}`
              }`}
            >
              {/* Level Header */}
              <div className={`p-6 ${!isLocked ? colors.bg : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isLocked ? 'bg-gray-200 dark:bg-gray-700' : colors.badge}`}>
                    {isLocked ? (
                      <Lock size={24} className="text-gray-400" />
                    ) : isComplete ? (
                      <CheckCircle2 size={24} className={colors.icon} />
                    ) : (
                      <Icon size={24} className={colors.icon} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Niveau {level.id} : {level.title}
                      </h3>
                      <span className="font-arabic text-base text-gray-500 dark:text-gray-400">
                        {level.titleAr}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {level.description}
                    </p>

                    {/* Progress bar */}
                    {!isLocked && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors.progress} rounded-full transition-all duration-500`}
                            style={{ width: `${levelProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {completedInLevel}/{level.totalLessons}
                        </span>
                      </div>
                    )}

                    {isLocked && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                        🔒 Complétez le niveau précédent pour débloquer
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              {!isLocked && (
                <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                  {level.lessons.map((lesson) => {
                    const completed = isLessonCompleted(lesson.id)

                    return (
                      <Link
                        key={lesson.id}
                        to={getLessonLink(lesson)}
                        className="flex items-center justify-between p-4 px-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          {completed ? (
                            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {lesson.title}
                            </span>
                            <span className="font-arabic text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {lesson.titleAr}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
