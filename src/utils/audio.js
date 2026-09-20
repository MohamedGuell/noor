export const playArabicAudio = async (text) => {
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob`
    
    // On doit utiliser fetch avec no-referrer car Google bloque les requêtes
    // provenant de sites tiers (CORS/Referer) pour cette API non officielle.
    const response = await fetch(url, {
      referrerPolicy: "no-referrer"
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    
    const audio = new Audio(blobUrl)
    
    audio.onended = () => {
      URL.revokeObjectURL(blobUrl) // Libérer la mémoire
    }
    
    await audio.play()
    
  } catch (err) {
    console.error("Audio play failed:", err)
    
    // Fallback natif au cas où
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA'
      window.speechSynthesis.speak(utterance)
    } catch (fallbackErr) {
      alert("Impossible de lire l'audio. Veuillez vérifier votre connexion ou votre navigateur.")
    }
  }
}
