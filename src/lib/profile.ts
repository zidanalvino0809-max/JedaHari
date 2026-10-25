export type Status = "sekolah" | "kerja";
export type LifeStage = "anak" | "remaja" | "muda" | "dewasa" | "matang";

export interface Profile {
  name: string;
  status: Status;
  age: number;
}

export interface Schedule {
  work: number;
  sleep: number;
  bedtime: number; // hour, may exceed 24 (e.g. 23.5)
}

export const PROFILE_STORAGE_KEY = "jedahari-profile";
export const MIN_AGE = 6;
export const MAX_AGE = 90;

export const STATUS_OPTIONS: { id: Status; label: string; hint: string }[] = [
  { id: "sekolah", label: "Bersekolah", hint: "Pelajar atau mahasiswa" },
  { id: "kerja", label: "Bekerja", hint: "Karyawan, wirausaha, atau lepas" },
];

export function lifeStage(age: number): LifeStage {
  if (age <= 12) return "anak";
  if (age <= 17) return "remaja";
  if (age <= 25) return "muda";
  if (age <= 54) return "dewasa";
  return "matang";
}

/** Pre-filled day sliders, chosen from status and age. */
export function defaultSchedule({ status, age }: Pick<Profile, "status" | "age">): Schedule {
  const stage = lifeStage(age);
  if (status === "sekolah") {
    if (stage === "anak") return { work: 6, sleep: 10, bedtime: 20.5 };
    if (stage === "remaja") return { work: 7, sleep: 9, bedtime: 21.5 };
    return { work: 6, sleep: 8, bedtime: 23 }; // kuliah / belajar di usia dewasa
  }
  if (stage === "anak" || stage === "remaja") return { work: 5, sleep: 9, bedtime: 22 }; // paruh waktu
  if (stage === "matang") return { work: 7, sleep: 7.5, bedtime: 21.5 };
  return { work: 8, sleep: 7.5, bedtime: 22.5 };
}

/** Label for the work/school slider. */
export function workLabel(profile: Pick<Profile, "status" | "age"> | null): string {
  if (!profile) return "Jam Kerja / Sekolah";
  if (profile.status === "kerja") return "Jam Kerja";
  return profile.age >= 18 ? "Jam Kuliah" : "Jam Sekolah";
}

export function greeting(name: string, hour: number): string {
  const part = hour < 11 ? "pagi" : hour < 15 ? "siang" : hour < 18 ? "sore" : "malam";
  const first = name.trim().split(/\s+/)[0];
  return first ? `Selamat ${part}, ${first}.` : `Selamat ${part}.`;
}

/** A short line whose tone fits the user's age and status. */
export function introLine({ status, age }: Pick<Profile, "status" | "age">): string {
  const stage = lifeStage(age);
  if (stage === "anak") return "Habis belajar, waktunya main sebentar. Yuk, pilih jeda yang seru!";
  if (stage === "matang") return "Pelan-pelan saja. Jeda yang tenang adalah bagian dari hari yang baik.";
  if (status === "sekolah") {
    if (stage === "remaja") return "Di sela pelajaran dan tugas, ambil napas dulu, ya. Kamu sudah berusaha.";
    if (stage === "muda") return "Di antara kuliah dan tenggat tugas, sisihkan ruang kecil untuk dirimu.";
    return "Belajar di usia berapa pun butuh jeda yang menenangkan.";
  }
  if (stage === "remaja") return "Bekerja sambil bertumbuh itu hebat. Jangan lupa beri dirimu jeda.";
  if (stage === "muda") return "Di antara rapat dan tenggat, ada ruang kecil yang layak kamu rayakan.";
  return "Setelah hari yang padat, izinkan dirimu melambat sejenak.";
}

/** Closing note under the results, tuned to status. */
export function resultNote(
  profile: Pick<Profile, "status" | "age"> | null,
  planMinutes: number,
  freeLabel: string,
  enoughTime: boolean,
): string {
  if (!enoughTime) {
    return profile?.status === "sekolah"
      ? "Waktumu sempit hari ini. Cukup curi satu jeda di sela belajar, itu sudah berarti."
      : "Waktumu sempit hari ini. Cukup curi satu jeda saja, itu sudah berarti.";
  }
  const base = `Total ${planMinutes} menit — hanya sebagian kecil dari ${freeLabel} waktu bebasmu.`;
  if (!profile) return base;
  if (lifeStage(profile.age) === "anak") return `${base} Ajak orang tua atau kakak kalau mau!`;
  return profile.status === "sekolah"
    ? `${base} Lebih singkat dari satu jam pelajaran.`
    : `${base} Lebih singkat dari satu rapat.`;
}

export function profileSummary({ status, age }: Pick<Profile, "status" | "age">): string {
  const who = status === "sekolah" ? (age >= 18 ? "mahasiswa" : "pelajar") : "pekerja";
  return `Disesuaikan untuk ${who} usia ${age} tahun`;
}

/** Validates a stored value; returns null for anything malformed. */
export function parseProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<Profile>;
    if (
      typeof v.name === "string" &&
      v.name.trim().length > 0 &&
      (v.status === "sekolah" || v.status === "kerja") &&
      typeof v.age === "number" &&
      Number.isInteger(v.age) &&
      v.age >= MIN_AGE &&
      v.age <= MAX_AGE
    ) {
      return { name: v.name.trim(), status: v.status, age: v.age };
    }
  } catch {
    /* fall through */
  }
  return null;
}
