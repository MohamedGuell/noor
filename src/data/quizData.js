// Quiz data generators for each lesson type
import { alphabet, harakat, vocabulary } from './arabicLessons'

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function pickRandom(arr, count, exclude = null) {
  const filtered = exclude ? arr.filter(item => item !== exclude) : [...arr]
  return shuffleArray(filtered).slice(0, count)
}

export function generateAlphabetQuiz(questionCount = 10) {
  const questions = []
  const letters = shuffleArray(alphabet).slice(0, questionCount)

  letters.forEach((letter, idx) => {
    // Alternate between different question types
    const type = idx % 3

    if (type === 0) {
      // "Quelle lettre est-ce ?" — Show letter, pick name
      const wrongOptions = pickRandom(alphabet, 3, letter).map(l => l.name)
      const options = shuffleArray([letter.name, ...wrongOptions])
      questions.push({
        id: idx,
        type: 'identify-letter',
        question: 'Quel est le nom de cette lettre ?',
        display: letter.letter,
        displayClass: 'font-arabic text-6xl',
        options,
        correctAnswer: letter.name,
      })
    } else if (type === 1) {
      // "Trouvez la lettre" — Show name, pick letter
      const wrongOptions = pickRandom(alphabet, 3, letter).map(l => l.letter)
      const options = shuffleArray([letter.letter, ...wrongOptions])
      questions.push({
        id: idx,
        type: 'find-letter',
        question: `Trouvez la lettre "${letter.name}" (${letter.phonetic}) :`,
        display: null,
        options,
        optionClass: 'font-arabic text-2xl',
        correctAnswer: letter.letter,
      })
    } else {
      // "Quel mot utilise cette lettre ?" — Show letter, pick example word
      const wrongOptions = pickRandom(alphabet, 3, letter).map(l => l.exampleFr)
      const options = shuffleArray([letter.exampleFr, ...wrongOptions])
      questions.push({
        id: idx,
        type: 'word-meaning',
        question: `Quel mot contient la lettre ${letter.name} ?`,
        display: letter.letter,
        displayClass: 'font-arabic text-5xl',
        options,
        correctAnswer: letter.exampleFr,
      })
    }
  })

  return questions
}

export function generateHarakatQuiz(questionCount = 10) {
  const questions = []
  const allExamples = harakat.flatMap(h =>
    h.examples.map(ex => ({ ...ex, harakaName: h.name, harakaSound: h.sound }))
  )

  const selected = shuffleArray(allExamples).slice(0, questionCount)

  selected.forEach((item, idx) => {
    if (idx % 2 === 0) {
      // "Quel son produit cette syllabe ?"
      const wrongOptions = pickRandom(
        allExamples.map(e => e.phonetic),
        3,
        item.phonetic
      ).filter((v, i, arr) => arr.indexOf(v) === i)
      // Ensure we have 3 wrong + 1 correct
      while (wrongOptions.length < 3) {
        wrongOptions.push(shuffleArray(allExamples.map(e => e.phonetic))[0])
      }
      const options = shuffleArray([item.phonetic, ...wrongOptions.slice(0, 3)])
      questions.push({
        id: idx,
        type: 'haraka-sound',
        question: 'Comment se prononce cette syllabe ?',
        display: item.letter,
        displayClass: 'font-arabic text-6xl',
        options,
        correctAnswer: item.phonetic,
      })
    } else {
      // "Quelle haraka est utilisée ?"
      const harakaNames = [...new Set(harakat.map(h => h.name))]
      const wrongOptions = harakaNames.filter(n => n !== item.harakaName).slice(0, 3)
      const options = shuffleArray([item.harakaName, ...wrongOptions])
      questions.push({
        id: idx,
        type: 'identify-haraka',
        question: 'Quelle voyelle (haraka) est utilisée ici ?',
        display: item.letter,
        displayClass: 'font-arabic text-6xl',
        options,
        correctAnswer: item.harakaName,
      })
    }
  })

  return questions
}

export function generateVocabularyQuiz(category, questionCount = 10) {
  const vocabData = vocabulary[category]
  if (!vocabData) return []

  const questions = []
  const words = shuffleArray(vocabData.words).slice(0, Math.min(questionCount, vocabData.words.length))

  words.forEach((word, idx) => {
    if (idx % 2 === 0) {
      // "Que signifie ce mot ?"
      const wrongOptions = pickRandom(vocabData.words, 3, word).map(w => w.fr)
      const options = shuffleArray([word.fr, ...wrongOptions])
      questions.push({
        id: idx,
        type: 'translate-word',
        question: 'Que signifie ce mot ?',
        display: word.ar,
        displayClass: 'font-arabic text-4xl',
        options,
        correctAnswer: word.fr,
      })
    } else {
      // "Quel est le mot arabe pour ... ?"
      const wrongOptions = pickRandom(vocabData.words, 3, word).map(w => w.ar)
      const options = shuffleArray([word.ar, ...wrongOptions])
      questions.push({
        id: idx,
        type: 'find-arabic',
        question: `Comment dit-on « ${word.fr} » en arabe ?`,
        display: null,
        options,
        optionClass: 'font-arabic text-xl',
        correctAnswer: word.ar,
      })
    }
  })

  return questions
}
