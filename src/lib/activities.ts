import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BedDouble,
  Cloud,
  Coffee,
  Feather,
  Footprints,
  Languages,
  Move,
  Music,
  PenLine,
  Pencil,
  PersonStanding,
  Shapes,
  Sprout,
  Wind,
} from "lucide-react";

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
  ],
};

export function pickActivities(mood: MoodId, count = 3): Activity[] {
  const pool = [...ACTIVITIES[mood]];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
