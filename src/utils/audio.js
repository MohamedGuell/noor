export const playArabicAudio = async (text) => {
  try {
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ar&q=${encodeURIComponent(text)}`
    const audio = new Audio()
    audio.src = url
    
    // Play immediately without waiting for load to preserve user gesture
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      await playPromise
    }
  } catch (err) {
    console.warn("Google TTS failed, falling back to native TTS:", err)
    
    // Fallback natif
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA'
      
      // Essayer de trouver une voix arabe spécifique pour améliorer la compatibilité
      const voices = window.speechSynthesis.getVoices()
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'))
      if (arabicVoice) {
        utterance.voice = arabicVoice
      }
      
      window.speechSynthesis.speak(utterance)
    } catch (fallbackErr) {
      console.error(fallbackErr)
    }
  }
}
