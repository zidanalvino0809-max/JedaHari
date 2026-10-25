import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Armchair,
  BedDouble,
  BookOpen,
  Camera,
  Cloud,
  Coffee,
  Droplets,
  Eye,
  Feather,
  Flower2,
  Footprints,
  GlassWater,
  Hand,
  Languages,
  Leaf,
  Lightbulb,
  ListChecks,
  MessageCircleHeart,
  Move,
  Music,
  Music2,
  NotebookPen,
  Apple,
  PenLine,
  Pencil,
  PersonStanding,
  Shapes,
  Smartphone,
  Sparkles,
  Sprout,
  Sun,
  Waves,
  Wind,
} from "lucide-react";

import type { LifeStage, Profile, Status } from "./profile";
import { lifeStage } from "./profile";

export type MoodId = "bertenaga" | "rehat" | "penat";

export interface Mood {
  id: MoodId;
  emoji: string;
  label: string;
  description: string;
  headline: string;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  description: string;
  minutes: number;
  icon: LucideIcon;
  /** Restricts who sees this activity. Omitted = everyone. */
  for?: { status?: Status[]; stages?: LifeStage[] };
}

export const MOODS: Mood[] = [
  {
    id: "bertenaga",
    emoji: "🔋",
    label: "Masih Bertenaga",
    description: "Energi masih tersisa, saatnya mencipta hal kecil.",
    headline: "Untuk energi yang ingin berkarya.",
  },
  {
    id: "rehat",
    emoji: "🪫",
    label: "Butuh Rehat",
    description: "Tubuh minta pelan, beri ia jeda yang lembut.",
    headline: "Untuk tubuh yang ingin melambat.",
  },
  {
    id: "penat",
    emoji: "🤯",
    label: "Penat Pikiran",
    description: "Kepala terasa penuh, mari urai satu per satu.",
    headline: "Untuk pikiran yang perlu diurai.",
  },
];

const NOT_KIDS: LifeStage[] = ["remaja", "muda", "dewasa", "matang"];

export const ACTIVITIES: Record<MoodId, Activity[]> = {
  penat: [
    {
      id: "box-breathing",
      title: "Napas Kotak",
      category: "Pernapasan",
      description: "Tarik napas 4 detik, tahan 4, hembuskan 4, tahan 4. Ulangi perlahan hingga dada terasa lapang.",
      minutes: 5,
      icon: Wind,
    },
    {
      id: "brain-dump",
      title: "Tulis Lepas",
      category: "Menulis",
      description: "Tuangkan semua yang mengganjal ke selembar kertas, tanpa disunting, tanpa dihakimi.",
      minutes: 7,
      icon: PenLine,
    },
    {
      id: "walk",
      title: "Langkah Tanpa Layar",
      category: "Gerak Ringan",
      description: "Berjalan pelan di sekitar rumah tanpa ponsel. Dengarkan suara, rasakan cahaya.",
      minutes: 10,
      icon: Footprints,
    },
    {
      id: "body-scan",
      title: "Pindai Tubuh",
      category: "Kesadaran",
      description: "Pejamkan mata, telusuri tubuh dari ujung kepala hingga kaki, lepaskan tegang yang tersisa.",
      minutes: 6,
      icon: PersonStanding,
    },
    {
      id: "mindful-tea",
      title: "Secangkir Teh Sadar",
      category: "Ritual",
      description: "Seduh teh hangat, hirup aromanya, nikmati setiap tegukan tanpa terburu-buru.",
      minutes: 8,
      icon: Coffee,
      for: { stages: NOT_KIDS },
    },
    {
      id: "water-sips",
      title: "Lima Teguk Air",
      category: "Hidrasi",
      description: "Tuang segelas air putih, minum perlahan dalam lima teguk. Rasakan segarnya mengalir.",
      minutes: 3,
      icon: GlassWater,
    },
    {
      id: "five-senses",
      title: "Lima Indra, Satu Ruang",
      category: "Kesadaran Luring",
      description: "Sebutkan 5 hal yang kamu lihat, 4 yang bisa disentuh, 3 yang terdengar, 2 aroma, dan 1 rasa.",
      minutes: 4,
      icon: Eye,
    },
    {
      id: "clear-desk",
      title: "Meja Lapang, Kepala Lega",
      category: "Beberes Minimalis",
      description: "Singkirkan semua dari meja kecuali tiga benda. Ruang yang lapang membantu pikiran ikut lapang.",
      minutes: 5,
      icon: Sparkles,
    },
    {
      id: "three-lines",
      title: "Jurnal Tiga Baris",
      category: "Jurnal Singkat",
      description: "Tulis satu hal yang berat, satu yang kamu syukuri, dan satu langkah kecil untuk besok.",
      minutes: 5,
      icon: NotebookPen,
    },
    {
      id: "warm-palms",
      title: "Telapak Hangat",
      category: "Relaksasi",
      description: "Gosok kedua telapak tangan hingga hangat, lalu tangkupkan di mata yang lelah. Diam sejenak.",
      minutes: 3,
      icon: Hand,
    },
    {
      id: "close-books",
      title: "Tutup Buku Sejenak",
      category: "Jeda Belajar",
      description: "Tutup semua buku dan tab pelajaran. Pejamkan mata, hitung mundur dari 50 dengan napas pelan.",
      minutes: 5,
      icon: BookOpen,
      for: { status: ["sekolah"] },
    },
    {
      id: "three-priorities",
      title: "Tiga Prioritas Saja",
      category: "Menata Pikiran",
      description: "Dari semua tugas yang berputar di kepala, pilih tiga terpenting untuk besok. Sisanya boleh menunggu.",
      minutes: 6,
      icon: ListChecks,
      for: { status: ["kerja"], stages: NOT_KIDS },
    },
    {
      id: "phone-down",
      title: "Ponsel Telungkup",
      category: "Detoks Digital",
      description: "Telungkupkan ponsel, matikan notifikasi, dan duduk diam tanpa melakukan apa pun.",
      minutes: 5,
      icon: Smartphone,
    },
  ],
  rehat: [
    {
      id: "acoustic",
      title: "Daftar Putar Akustik",
      category: "Musik",
      description: "Putar lagu akustik yang lembut, pejamkan mata, dan biarkan bahu turun perlahan.",
      minutes: 15,
      icon: Music,
    },
    {
      id: "power-nap",
      title: "Tidur Siang Kilat",
      category: "Istirahat",
      description: "Rebahkan tubuh dan pasang alarm. Cukup singkat agar bangun terasa segar, bukan berat.",
      minutes: 20,
      icon: BedDouble,
    },
    {
      id: "stretch",
      title: "Regang Leher & Bahu",
      category: "Peregangan",
      description: "Putar bahu, miringkan kepala perlahan ke kiri dan kanan. Tarik napas di setiap gerakan.",
      minutes: 5,
      icon: Move,
    },
    {
      id: "sky",
      title: "Menatap Langit",
      category: "Jeda Mata",
      description: "Berdiri di dekat jendela, tatap langit dan awan. Istirahatkan mata dari layar.",
      minutes: 5,
      icon: Cloud,
    },
    {
      id: "warm-water",
      title: "Air Hangat, Napas Pelan",
      category: "Hidrasi",
      description: "Genggam segelas air hangat dengan kedua tangan. Minum sedikit demi sedikit di antara napas panjang.",
      minutes: 4,
      icon: Droplets,
    },
    {
      id: "chair-stretch",
      title: "Regang di Kursi Kerja",
      category: "Peregangan",
      description: "Tautkan jari, dorong lengan ke depan lalu ke atas. Putar pergelangan dan lenturkan punggung bawah.",
      minutes: 5,
      icon: Armchair,
      for: { status: ["kerja"] },
    },
    {
      id: "legs-up",
      title: "Kaki di Dinding",
      category: "Pemulihan",
      description: "Berbaring dan sandarkan kaki lurus ke dinding. Biarkan aliran darah dan napas melambat.",
      minutes: 8,
      icon: Waves,
      for: { stages: ["anak", "remaja", "muda", "dewasa"] },
    },
    {
      id: "porch-sit",
      title: "Duduk Santai di Teras",
      category: "Jeda Hening",
      description: "Duduk di teras atau dekat jendela, dengarkan suara sekitar, dan biarkan waktu berjalan pelan.",
      minutes: 10,
      icon: Leaf,
      for: { stages: ["dewasa", "matang"] },
    },
    {
      id: "eye-massage",
      title: "Pijat Mata & Pelipis",
      category: "Jeda Mata",
      description: "Pijat lembut pelipis dengan gerakan memutar, lalu tekan perlahan pangkal hidung. Pejamkan mata.",
      minutes: 4,
      icon: Eye,
    },
    {
      id: "sunlight",
      title: "Mandi Cahaya",
      category: "Sinar Matahari",
      description: "Duduk di dekat jendela atau teras, biarkan cahaya menyentuh wajah sambil bernapas pelan.",
      minutes: 7,
      icon: Sun,
    },
    {
      id: "childs-pose",
      title: "Pose Anak",
      category: "Peregangan",
      description: "Berlutut, duduk di atas tumit, lalu rebahkan dada ke depan dengan lengan terulur. Bernapas ke punggung.",
      minutes: 4,
      icon: PersonStanding,
      for: { stages: ["anak", "remaja", "muda", "dewasa"] },
    },
    {
      id: "favorite-song",
      title: "Satu Lagu Favorit",
      category: "Jeda Belajar",
      description: "Putar satu-dua lagu kesukaanmu dan ikut bersenandung pelan. Tugas bisa menunggu sebentar.",
      minutes: 8,
      icon: Music2,
      for: { status: ["sekolah"] },
    },
    {
      id: "screenless-rest",
      title: "Rebah Tanpa Layar",
      category: "Istirahat",
      description: "Letakkan ponsel jauh-jauh, berbaring, dan hitung sepuluh napas panjang sebelum bangun.",
      minutes: 10,
      icon: Smartphone,
    },
  ],
  bertenaga: [
    {
      id: "sketch",
      title: "Sketsa Satu Benda",
      category: "Hobi Mikro",
      description: "Pilih satu benda di mejamu dan gambar dengan garis sederhana. Bukan soal bagus, tapi hadir.",
      minutes: 10,
      icon: Pencil,
    },
    {
      id: "haiku",
      title: "Menulis Haiku",
      category: "Puisi",
      description: "Tangkap momen hari ini dalam tiga baris: lima, tujuh, lima suku kata.",
      minutes: 5,
      icon: Feather,
      for: { stages: NOT_KIDS },
    },
    {
      id: "plant",
      title: "Merawat Tanaman",
      category: "Berkebun",
      description: "Siram, bersihkan daun kering, dan putar potnya menghadap cahaya.",
      minutes: 7,
      icon: Sprout,
    },
    {
      id: "word",
      title: "Satu Kosakata Baru",
      category: "Belajar",
      description: "Pelajari satu kata dari bahasa asing, ucapkan lantang, lalu buat satu kalimat.",
      minutes: 5,
      icon: Languages,
    },
    {
      id: "drawer",
      title: "Rapikan Satu Laci",
      category: "Beberes",
      description: "Satu laci saja. Buang yang tak perlu, susun sisanya. Rasakan lega yang kecil.",
      minutes: 10,
      icon: Archive,
    },
    {
      id: "origami",
      title: "Origami Sederhana",
      category: "Kerajinan",
      description: "Lipat seekor burung bangau dari selembar kertas. Fokus pada setiap lipatan.",
      minutes: 12,
      icon: Shapes,
    },
    {
      id: "one-song-dance",
      title: "Menari Satu Lagu",
      category: "Gerak Bebas",
      description: "Putar lagu yang ceria dan bergeraklah sesukamu. Tidak ada yang menilai, cukup nikmati.",
      minutes: 4,
      icon: Music2,
      for: { stages: ["anak", "remaja", "muda", "dewasa"] },
    },
    {
      id: "five-things",
      title: "Kembalikan Lima Benda",
      category: "Beberes Minimalis",
      description: "Kembalikan lima benda yang tercecer ke tempatnya. Kecil, cepat, dan langsung terasa rapi.",
      minutes: 5,
      icon: Sparkles,
    },
    {
      id: "thank-you",
      title: "Pesan Terima Kasih",
      category: "Koneksi",
      description: "Kirim pesan singkat kepada seseorang yang membantumu belakangan ini. Sebutkan hal spesifiknya.",
      minutes: 6,
      icon: MessageCircleHeart,
    },
    {
      id: "mind-map",
      title: "Catatan Bergambar",
      category: "Belajar Kreatif",
      description: "Ubah satu materi pelajaran hari ini menjadi peta pikiran berwarna dengan ikon kecil.",
      minutes: 10,
      icon: BookOpen,
      for: { status: ["sekolah"] },
    },
    {
      id: "side-idea",
      title: "Satu Ide di Luar Kerja",
      category: "Ide Kreatif",
      description: "Tulis satu gagasan pribadi yang membuatmu bersemangat, lalu catat langkah pertamanya.",
      minutes: 8,
      icon: Lightbulb,
      for: { status: ["kerja"] },
    },
    {
      id: "photo-hunt",
      title: "Berburu Detail Kecil",
      category: "Fotografi",
      description: "Potret tiga detail di sekitarmu: bayangan, tekstur, atau warna yang jarang kamu perhatikan.",
      minutes: 10,
      icon: Camera,
    },
    {
      id: "fruit-snack",
      title: "Camilan Buah Kilat",
      category: "Dapur",
      description: "Siapkan sepiring buah potong dan tata dengan cantik. Nikmati warnanya sebelum rasanya.",
      minutes: 8,
      icon: Apple,
    },
    {
      id: "flower-press",
      title: "Mengeringkan Bunga",
      category: "Kerajinan",
      description: "Petik satu daun atau bunga kecil, selipkan di antara halaman buku tebal untuk kenangan.",
      minutes: 5,
      icon: Flower2,
    },
  ],
};

/** Whether an activity is suitable for this profile (no profile = everything). */
export function fitsProfile(activity: Activity, profile: Pick<Profile, "status" | "age"> | null): boolean {
  if (!profile || !activity.for) return true;
  const { status, stages } = activity.for;
  if (status && !status.includes(profile.status)) return false;
  if (stages && !stages.includes(lifeStage(profile.age))) return false;
  return true;
}

function shuffle<T>(list: T[], random: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

/**
 * Picks `count` activities for a mood, filtered for the profile. Activities in
 * `exclude` (e.g. the current set on "Acak Ulang") are only reused when the
 * pool has nothing fresh left.
 */
export function pickActivities(
  mood: MoodId,
  options: {
    profile?: Pick<Profile, "status" | "age"> | null;
    exclude?: string[];
    count?: number;
    random?: () => number;
  } = {},
): Activity[] {
  const { profile = null, exclude = [], count = 3, random = Math.random } = options;
  const pool = ACTIVITIES[mood].filter((a) => fitsProfile(a, profile));
  const fresh = shuffle(pool.filter((a) => !exclude.includes(a.id)), random);
  const used = shuffle(pool.filter((a) => exclude.includes(a.id)), random);
  return [...fresh, ...used].slice(0, count);
}
