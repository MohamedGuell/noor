// src/utils/srsAlgorithm.js

/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm
 * 
 * @param {number} grade - Grade from 0 to 5 (we will use 1 for Fail, 3 for Hard, 4 for Good, 5 for Easy)
 * @param {number} prevEaseFactor - The previous ease factor (default 2.5)
 * @param {number} prevInterval - The previous interval in days
 * @param {number} prevRepetitions - The number of successful consecutive repetitions
 * @returns {Object} { easeFactor, interval, repetitions, nextReviewDate }
 */
export const calculateNextReview = (grade, prevEaseFactor = 2.5, prevInterval = 0, prevRepetitions = 0) => {
  let easeFactor = prevEaseFactor
  let interval = prevInterval
  let repetitions = prevRepetitions

  if (grade >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    // Incorrect response (Fail / À revoir)
    repetitions = 0
    interval = 1
  }

  // Update Ease Factor
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  if (easeFactor < 1.3) {
    easeFactor = 1.3 // Minimum ease factor
  }

  // Calculate Next Review Date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString()
  }
}
