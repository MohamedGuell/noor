import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ProgressContext = createContext(null)

const STORAGE_KEY = 'noor-progress'

const defaultProgress = {
  completedLessons: [],    // e.g. ['alphabet', 'harakat', 'vocab-salutations']
  memorizedSurahs: [],     // e.g. [1, 112, 113, 114]
  quizScores: {},          // e.g. { 'alphabet': 85, 'harakat': 90 }
  currentLevel: 1,
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...defaultProgress, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error('Error loading progress:', e)
    }
    return defaultProgress
  })

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch (e) {
      console.error('Error saving progress:', e)
    }
  }, [progress])

  const completeLesson = useCallback((lessonId) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev
      const updated = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      }
      // Auto-advance level
      const levelLessons = {
        1: ['alphabet'],
        2: ['harakat'],
        3: ['vocab-salutations', 'vocab-famille', 'vocab-nombres'],
      }
      for (const [level, lessons] of Object.entries(levelLessons)) {
        const lvl = parseInt(level)
        if (lvl > updated.currentLevel && lessons.every(l => updated.completedLessons.includes(l))) {
          // Don't auto-advance past needed level
        }
        if (lvl === updated.currentLevel) {
          const allDone = lessons.every(l => updated.completedLessons.includes(l))
          if (allDone && lvl < 3) {
            updated.currentLevel = lvl + 1
          }
        }
      }
      return updated
    })
  }, [])

  const saveQuizScore = useCallback((lessonId, score) => {
    setProgress(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [lessonId]: score },
    }))
  }, [])

  const toggleSurahMemorized = useCallback((surahNumber) => {
    setProgress(prev => {
      const isMemorized = prev.memorizedSurahs.includes(surahNumber)
      return {
        ...prev,
        memorizedSurahs: isMemorized
          ? prev.memorizedSurahs.filter(s => s !== surahNumber)
          : [...prev.memorizedSurahs, surahNumber],
      }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress)
  }, [])

  const isLessonCompleted = useCallback((lessonId) => {
    return progress.completedLessons.includes(lessonId)
  }, [progress.completedLessons])

  const isSurahMemorized = useCallback((surahNumber) => {
    return progress.memorizedSurahs.includes(surahNumber)
  }, [progress.memorizedSurahs])

  const totalLessons = 5 // alphabet + harakat + 3 vocab
  const totalSurahs = 10
  const completedCount = progress.completedLessons.length
  const memorizedCount = progress.memorizedSurahs.length
  const overallProgress = Math.round(
    ((completedCount + memorizedCount) / (totalLessons + totalSurahs)) * 100
  )

  const value = {
    progress,
    completeLesson,
    saveQuizScore,
    toggleSurahMemorized,
    resetProgress,
    isLessonCompleted,
    isSurahMemorized,
    totalLessons,
    totalSurahs,
    completedCount,
    memorizedCount,
    overallProgress,
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
