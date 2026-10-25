export type SegmentSlot = "sleep" | "morning" | "work" | "evening";

export interface Segment {
  slot: SegmentSlot;
  kind: "sleep" | "work" | "free";
  start: number; // hour of day, 0–24
  duration: number; // hours
}

export interface DayBalance {
  sleep: number;
  work: number;
  free: number;
  bedtime: number;
  wake: number;
  workStart: number;
  workEnd: number;
  segments: Segment[];
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const wrap = (h: number) => ((h % 24) + 24) % 24;

/**
 * Lays out a 24-hour day: sleep from bedtime, a short morning buffer (max 1h),
 * then work/school, with the remainder as free time. Free = 24 − sleep − work.
 */
export function computeDay(input: {
  workHours: number;
  sleepHours: number;
  bedtime: number;
}): DayBalance {
  const sleep = clamp(input.sleepHours, 0, 24);
  const work = clamp(input.workHours, 0, 24 - sleep);
  const free = 24 - sleep - work;
  const bedtime = wrap(input.bedtime);
  const wake = wrap(bedtime + sleep);
  const buffer = Math.min(1, free);
  const workStart = wrap(wake + buffer);
  const workEnd = wrap(workStart + work);

  return {
    sleep,
    work,
    free,
    bedtime,
    wake,
    workStart,
    workEnd,
    segments: [
      { slot: "sleep", kind: "sleep", start: bedtime, duration: sleep },
      { slot: "morning", kind: "free", start: wake, duration: buffer },
      { slot: "work", kind: "work", start: workStart, duration: work },
      { slot: "evening", kind: "free", start: workEnd, duration: free - buffer },
    ],
  };
}

export function formatDuration(hours: number): string {
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} mnt`;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} mnt`;
}

export function formatClock(hour: number): string {
  const totalMin = Math.round(wrap(hour) * 60) % (24 * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
}
