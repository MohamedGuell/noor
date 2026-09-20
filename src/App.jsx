import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ArabicModule from './pages/ArabicModule'
import AlphabetLesson from './pages/lessons/AlphabetLesson'
import HarakatLesson from './pages/lessons/HarakatLesson'
import VocabularyLesson from './pages/lessons/VocabularyLesson'
import QuizPage from './pages/lessons/QuizPage'
import QuranModule from './pages/QuranModule'
import PrayersModule from './pages/PrayersModule'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="arabe" element={<ArabicModule />} />
        <Route path="arabe/alphabet" element={<AlphabetLesson />} />
        <Route path="arabe/harakat" element={<HarakatLesson />} />
        <Route path="arabe/vocabulaire/:category" element={<VocabularyLesson />} />
        <Route path="arabe/quiz/:lessonId" element={<QuizPage />} />
        <Route path="coran" element={<QuranModule />} />
        <Route path="prieres" element={<PrayersModule />} />
      </Route>
    </Routes>
  )
}

export default App
