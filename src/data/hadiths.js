// src/data/hadiths.js

// Échantillon qualitatif de hadiths authentiques (Sahih Bukhari & Muslim)
// pour éviter de charger des mégaoctets de données sur l'application cliente.

export const dailyHadiths = [
  {
    ar: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    fr: "Les actes ne valent que par les intentions.",
    source: "Sahih al-Bukhari 1"
  },
  {
    ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    fr: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
    source: "Sahih al-Bukhari 5027"
  },
  {
    ar: "الكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    fr: "La bonne parole est une aumône (sadaqah).",
    source: "Sahih al-Bukhari 2989"
  },
  {
    ar: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    fr: "Aucun de vous n'est véritablement croyant tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Sahih al-Bukhari 13"
  },
  {
    ar: "يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا",
    fr: "Rendez les choses faciles et non difficiles, annoncez de bonnes nouvelles et ne rebutez pas les gens.",
    source: "Sahih al-Bukhari 69"
  },
  {
    ar: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    fr: "Celui à qui Allah veut du bien, Il lui accorde la compréhension de la religion.",
    source: "Sahih al-Bukhari 71"
  },
  {
    ar: "إِنَّ الدِّينَ يُسْرٌ",
    fr: "La religion est certes une facilité.",
    source: "Sahih al-Bukhari 39"
  },
  {
    ar: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    fr: "Le vrai musulman est celui dont les autres musulmans sont à l'abri de sa langue et de sa main.",
    source: "Sahih al-Bukhari 10"
  },
  {
    ar: "اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ",
    fr: "Protégez-vous de l'Enfer, ne serait-ce qu'avec la moitié d'une datte (donnée en aumône).",
    source: "Sahih al-Bukhari 1417"
  },
  {
    ar: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    fr: "Le meilleur des hommes est le plus utile aux hommes.",
    source: "Al-Mu'jam al-Awsat"
  }
]

export const getRandomHadith = () => {
  // On utilise la date du jour comme graine pour que le hadith change chaque jour,
  // ou on prend un aléatoire pur si on préfère.
  // Pour un "Hadith du jour", on base l'index sur le jour de l'année.
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
  const index = dayOfYear % dailyHadiths.length
  
  return dailyHadiths[index]
}
