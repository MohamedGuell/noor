import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, BookMarked, Star, TrendingUp, RotateCcw, Sparkles, Clock, MapPin, Target } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { getRandomHadith } from '../data/hadiths'

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
  const [hadith, setHadith] = useState(null)

  useEffect(() => {
    setHadith(getRandomHadith())
  }, [])

  return (
    <div className="space-y-10 pb-20 md:pb-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative text-center py-12 sm:py-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 shadow-2xl border border-slate-700/50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-gold/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-emerald-300 text-sm font-medium mb-6 border border-white/10">
            <Sparkles size={14} className="text-gold" />
            Bienvenue sur Noor
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Votre voyage vers <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              la maîtrise de l'arabe
            </span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-lg sm:text-xl font-light">
            Apprenez l'arabe et étudiez le Coran avec une méthode moderne, interactive et guidée.
          </p>
        </div>
      </section>

      {/* SRS Due Cards Widget */}
      {dueCards.length > 0 && (
        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <Target size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Révisions quotidiennes</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  <strong className="text-emerald-600 dark:text-emerald-400 text-lg">{dueCards.length}</strong> cartes mémoire en attente. Ne brisez pas votre chaîne !
                </p>
              </div>
            </div>
            <Link
              to="/revisions"
              className="whitespace-nowrap px-8 py-4 bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-emerald-400 rounded-2xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Lancer la session
            </Link>
          </div>
        </section>
      )}

      {/* Progress Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { icon: TrendingUp, label: "Progression globale", value: `${overallProgress}%`, color: "emerald", progress: overallProgress },
          { icon: BookOpen, label: "Leçons complétées", value: completedCount, sub: `/ ${totalLessons}`, color: "blue" },
          { icon: BookMarked, label: "Sourates mémorisées", value: memorizedCount, sub: `/ ${totalSurahs}`, color: "amber" }
        ].map((stat, i) => (
          <div key={i} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon size={20} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{stat.label}</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-2">
              {stat.value} {stat.sub && <span className="text-base font-normal text-slate-500">{stat.sub}</span>}
            </p>
            {stat.progress !== undefined && (
              <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Main Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { to: "/arabe", title: "Apprendre l'Arabe", desc: "L'alphabet, les voyelles, le vocabulaire.", icon: BookOpen, gradient: "from-emerald-500 to-emerald-700" },
          { to: "/coran", title: "Étudier le Coran", desc: "Lisez, mémorisez et apprenez le Tajweed.", icon: BookMarked, gradient: "from-amber-500 to-amber-700" },
          { to: "/prieres", title: "Heures de Prières", desc: "Consultez les horaires locaux.", icon: Clock, gradient: "from-blue-500 to-indigo-600" }
        ].map((card, i) => (
          <Link
            key={i}
            to={card.to}
            className={`group relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-[2rem] p-8 text-white card-hover shadow-xl`}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <card.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
              <p className="text-white/80 text-sm mb-6 line-clamp-2 leading-relaxed">
                {card.desc}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full hover:bg-white/30 transition-colors">
                Explorer →
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Hadith Widget */}
      {hadith && (
        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-800/50 text-center shadow-lg">
          <Star size={24} className="mx-auto text-gold mb-4" />
          <p className="font-arabic text-2xl sm:text-3xl text-slate-800 dark:text-slate-200 mb-6 leading-loose">
            {hadith.ar}
          </p>
          <p className="text-slate-600 dark:text-slate-400 italic mb-4 max-w-2xl mx-auto">
            « {hadith.fr} »
          </p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">
            {hadith.source}
          </p>
        </section>
      )}

      {/* Reset Button */}
      {(completedCount > 0 || memorizedCount > 0) && (
        <div className="text-center pt-8">
          <button
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ?')) {
                resetProgress()
              }
            }}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors font-medium"
          >
            <RotateCcw size={16} />
            Réinitialiser ma progression
          </button>
        </div>
      )}
    </div>
  )
}
