import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, BookMarked, Star, TrendingUp, RotateCcw, Sparkles, Clock } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'

export default function Dashboard() {
  const {
    overallProgress,
    completedCount,
    memorizedCount,
    totalLessons,
    totalSurahs,
    resetProgress,
    getDueCards,
  } = useProgress()

  const dueCards = getDueCards()

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6">
          <Star size={14} className="fill-current" />
          Bienvenue sur Noor
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Votre voyage vers
          <span className="block bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
            la maîtrise de l'arabe
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg">
          Apprenez l'arabe et étudiez le Coran à votre rythme, étape par étape.
        </p>
      </section>

      {/* Progress Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progression globale</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallProgress}%</p>
          <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Leçons complétées</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedCount} <span className="text-sm font-normal text-gray-500">/ {totalLessons}</span>
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <BookMarked size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sourates mémorisées</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {memorizedCount} <span className="text-sm font-normal text-gray-500">/ 114</span>
          </p>
        </div>
      </section>

      {/* SRS Due Cards Widget */}
      {dueCards.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold mb-2">Révisions quotidiennes</h3>
              <p className="text-blue-100 text-sm max-w-md">
                Vous avez <strong className="text-white text-lg">{dueCards.length}</strong> cartes mémoire en attente. Ne brisez pas votre chaîne d'apprentissage !
              </p>
            </div>
            <Link
              to="/revisions"
              className="whitespace-nowrap px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Lancer la session
            </Link>
          </div>
        </section>
      )}

      {/* Main Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/arabe"
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 text-white card-hover shadow-lg shadow-emerald-500/20"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Apprendre l'Arabe</h3>
            <p className="text-emerald-100 text-sm mb-4 line-clamp-2">
              L'alphabet, les voyelles, le vocabulaire.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 px-4 py-2 rounded-full">
              Commencer →
            </span>
          </div>
        </Link>

        <Link
          to="/coran"
          className="group relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl p-6 text-white card-hover shadow-lg shadow-amber-500/20"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookMarked size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Étudier le Coran</h3>
            <p className="text-amber-100 text-sm mb-4 line-clamp-2">
              Lisez, mémorisez et apprenez le Tajweed.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 px-4 py-2 rounded-full">
              Commencer →
            </span>
          </div>
        </Link>
        
        <Link
          to="/prieres"
          className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white card-hover shadow-lg shadow-blue-500/20"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Heures de Prières</h3>
            <p className="text-blue-100 text-sm mb-4 line-clamp-2">
              Consultez les horaires locaux.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 px-4 py-2 rounded-full">
              Consulter →
            </span>
          </div>
        </Link>
      </section>

      {/* Motivational Quote */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 text-center">
        <p className="font-arabic text-2xl sm:text-3xl text-emerald-700 dark:text-emerald-400 mb-3 leading-relaxed">
          اطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm italic">
          « Recherchez le savoir du berceau jusqu'à la tombe »
        </p>
      </section>

      {/* Reset Button */}
      {(completedCount > 0 || memorizedCount > 0) && (
        <div className="text-center">
          <button
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ?')) {
                resetProgress()
              }
            }}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={14} />
            Réinitialiser ma progression
          </button>
        </div>
      )}
    </div>
  )
}
