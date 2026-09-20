export const playArabicAudio = async (text) => {
  try {
    // client=gtx est crucial ici : il permet d'éviter les erreurs 403 (Referer) et ne nécessite pas CORS
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ar&q=${encodeURIComponent(text)}`
    
    // On utilise directement l'objet Audio du navigateur.
    // Cela contourne la politique CORS (contrairement à fetch)
    const audio = new Audio(url)
    
    await new Promise((resolve, reject) => {
      audio.onended = resolve
      audio.onerror = reject
      audio.play().catch(reject)
    })
    
  } catch (err) {
    console.error("Audio play failed, trying fallback:", err)
    
    // Fallback natif au cas où
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA'
      window.speechSynthesis.speak(utterance)
    } catch (fallbackErr) {
      console.error(fallbackErr)
      alert("Impossible de lire l'audio. Vérifiez votre connexion.")
    }
  }
}
