import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, Loader2, Compass } from 'lucide-react'
import { fetchPrayerTimes } from '../services/api'

export default function PrayersModule() {
  const [prayers, setPrayers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationName, setLocationName] = useState('Paris, France') // Par défaut
  const [error, setError] = useState(null)

  useEffect(() => {
    const getPrayers = async (lat, lng) => {
      setLoading(true)
      const data = await fetchPrayerTimes(lat, lng)
      if (data) {
        setPrayers(data)
      } else {
        setError("Impossible de récupérer les heures de prières.")
      }
      setLoading(false)
    }

    // Demander la localisation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationName('Votre position locale')
          getPrayers(position.coords.latitude, position.coords.longitude)
        },
        (err) => {
          console.log('Géolocalisation refusée ou erreur', err)
          // Fallback sur Paris
          getPrayers(null, null)
        },
        { timeout: 5000 }
      )
    } else {
      getPrayers(null, null)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="text-gray-500 dark:text-gray-400">Calcul des heures de prières...</p>
      </div>
    )
  }

  const prayerNames = {
    Fajr: 'Al-Fajr (Aube)',
    Sunrise: 'Chourouq (Lever du soleil)',
    Dhuhr: 'Ad-Dhuhr (Midi)',
    Asr: 'Al-Asr (Après-midi)',
    Maghrib: 'Al-Maghrib (Coucher du soleil)',
    Isha: 'Al-Isha (Soir)'
  }

  const orderedPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

  return (
    <div className="space-y-8 pb-20 md:pb-0 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Horaires de Prières
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <MapPin size={14} />
            <span>{locationName}</span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl">
          {error}
        </div>
      ) : (
        <>
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {prayers.date.gregorian.date}
                </span>
                <span className="font-arabic text-lg text-emerald-700 dark:text-emerald-400">
                  {prayers.date.hijri.day} {prayers.date.hijri.month.ar} {prayers.date.hijri.year}
                </span>
              </div>
              <Compass className="text-emerald-500/20" size={48} />
            </div>

            <div className="space-y-3">
              {orderedPrayers.map((key) => {
                const time = prayers.time[key] // L'API renvoie "05:30 (CET)", on nettoie
                const cleanTime = prayers[key] || (prayers[key] ? prayers[key] : Object.keys(prayers).length > 0 ? Object.entries(prayers).find(([k]) => k === key) : null)
                // L'objet renvoyé par Aladhan dans timings contient { Fajr: "05:30", Dhuhr: "13:45", etc }
                const prayerTime = prayers[key]?.split(' ')[0]

                if (!prayerTime) return null

                // Mettre en évidence la prochaine prière pourrait être ajouté ici
                return (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {prayerNames[key]}
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-emerald-500" />
                      <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                        {prayerTime}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
