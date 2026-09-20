// src/services/api.js

const QURAN_API_BASE = 'https://api.alquran.cloud/v1'
const ALADHAN_API_BASE = 'http://api.aladhan.com/v1'

// --- CORAN API ---
// Récupère une sourate complète avec texte arabe, traduction FR (hamedullah), translittération, et audio (alafasy)
export const fetchSurah = async (surahNumber) => {
  try {
    const response = await fetch(`${QURAN_API_BASE}/surah/${surahNumber}/editions/quran-uthmani,fr.hamedullah,en.transliteration,ar.alafasy`)
    if (!response.ok) throw new Error('Erreur réseau')
    const data = await response.json()
    
    // Le retour contient un tableau avec les 4 éditions.
    const [arabic, french, transliteration, audio] = data.data

    // On reformate les versets
    const verses = arabic.ayahs.map((ayah, index) => ({
      number: ayah.numberInSurah,
      globalNumber: ayah.number,
      ar: ayah.text,
      fr: french.ayahs[index].text,
      transliteration: transliteration.ayahs[index].text,
      audioUrl: audio.ayahs[index].audio
    }))

    return {
      number: arabic.number,
      nameAr: arabic.name,
      nameFr: arabic.englishNameTranslation, // on garde la trad anglaise ou on map
      revelationType: arabic.revelationType,
      versesCount: arabic.numberOfAyahs,
      verses
    }
  } catch (error) {
    console.error('Erreur fetchSurah:', error)
    return null
  }
}

// Récupère la liste basique des 114 sourates
export const fetchSurahsList = async () => {
  try {
    const response = await fetch(`${QURAN_API_BASE}/surah`)
    if (!response.ok) throw new Error('Erreur réseau')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Erreur fetchSurahsList:', error)
    return []
  }
}

// --- PRIÈRES API ---
export const fetchPrayerTimes = async (latitude, longitude) => {
  try {
    // Utilisation de method=2 (Islamic Society of North America) ou 3 (Muslim World League)
    // method=12 (UOIF France) est souvent utilisé en France
    const url = latitude && longitude 
      ? `${ALADHAN_API_BASE}/timings?latitude=${latitude}&longitude=${longitude}&method=12`
      : `${ALADHAN_API_BASE}/timingsByCity?city=Paris&country=France&method=12`
      
    const response = await fetch(url)
    if (!response.ok) throw new Error('Erreur réseau')
    const data = await response.json()
    return data.data.timings
  } catch (error) {
    console.error('Erreur fetchPrayerTimes:', error)
    return null
  }
}
