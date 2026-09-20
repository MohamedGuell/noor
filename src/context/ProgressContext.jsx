import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { calculateNextReview } from '../utils/srsAlgorithm'

const ProgressContext = createContext(null)

const STORAGE_KEY = 'noor-progress'
const SRS_STORAGE_KEY = 'noor_srs_data'

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

  const [srsData, setSrsData] = useState(() => {
    try {
      const saved = localStorage.getItem(SRS_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Error loading SRS data:', e)
    }
    return {}
  })

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch (e) {
      console.error('Error saving progress:', e)
    }
  }, [progress])

  useEffect(() => {
    try {
      localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(srsData))
    } catch (e) {
      console.error('Error saving SRS data:', e)
    }
  }, [srsData])

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
        if (lvl === updated.currentLevel) {
          const allDone = lessons.every(l => updated.completedLessons.includes(l))
          if (allDone) {
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
    setSrsData({})
    localStorage.removeItem('noor_srs_data')
  }, [])

  const isLessonCompleted = useCallback((lessonId) => {
    return progress.completedLessons.includes(lessonId)
  }, [progress.completedLessons])

  const isSurahMemorized = useCallback((surahNumber) => {
    return progress.memorizedSurahs.includes(surahNumber)
  }, [progress.memorizedSurahs])

  // SRS Methods
  const addCardsToSRS = (cards) => {
    setSrsData(prev => {
      const newData = { ...prev }
      let added = false
      cards.forEach(card => {
        if (!newData[card.id]) {
          newData[card.id] = {
            ...card,
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReviewDate: new Date().toISOString()
          }
          added = true
        }
      })
      return added ? newData : prev
    })
  }

  const updateCardProgress = (cardId, grade) => {
    setSrsData(prev => {
      const card = prev[cardId]
      if (!card) return prev
      
      const newStats = calculateNextReview(
        grade,
        card.easeFactor,
        card.interval,
        card.repetitions
      )
      
      return {
        ...prev,
        [cardId]: {
          ...card,
          ...newStats
        }
      }
    })
  }

  const getDueCards = () => {
    const now = new Date()
    return Object.values(srsData).filter(card => {
      const reviewDate = new Date(card.nextReviewDate)
      return reviewDate <= now
    })
  }

  const totalLessons = 6
  const totalSurahs = 114
  const completedCount = progress.completedLessons.length
  const memorizedCount = progress.memorizedSurahs.length
  const overallProgress = Math.round(
    ((completedCount + memorizedCount) / (totalLessons + totalSurahs)) * 100
  )
  const currentLevel = Math.floor(overallProgress / 20) + 1

  const value = {
    // Legacy mapping for backwards compatibility (especially Dashboard)
    completedLessons: progress.completedLessons,
    memorizedSurahs: progress.memorizedSurahs,
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
    currentLevel,
    // SRS Methods
    srsData,
    addCardsToSRS,
    updateCardProgress,
    getDueCards,
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
