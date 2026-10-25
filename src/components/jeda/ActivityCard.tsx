import { Pause, Play, RotateCcw } from "lucide-react";
import type { CSSProperties } from "react";
import { useCountdown } from "@/hooks/use-countdown";
import type { Activity } from "@/lib/activities";

const RING_R = 24;
const RING_C = 2 * Math.PI * RING_R;

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ActivityCard({
  activity,
  index,
  style,
}: {
  activity: Activity;
  index: number;
  style?: CSSProperties;
}) {
  const total = activity.minutes * 60;
  const { remaining, running, done, start, pause, reset } = useCountdown(total);
  const progress = 1 - remaining / total;
  const Icon = activity.icon;
  const touched = remaining !== total;

  return (
    <article
      className="animate-rise group flex flex-col rounded-3xl border border-border bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift"
      style={style}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <span className="font-display text-lg text-muted-foreground">0{index + 1}</span>
      </div>

      <p className="eyebrow mt-8">
        {activity.category} · {activity.minutes} menit
      </p>
      <h3 className="mt-2 font-display text-3xl leading-tight text-foreground">{activity.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{activity.description}</p>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-4 border-t border-border pt-6">
          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 56 56" className="h-full w-full -rotate-90">
              <circle cx="28" cy="28" r={RING_R} fill="none" strokeWidth="2" className="stroke-track" />
              <circle
                cx="28"
                cy="28"
                r={RING_R}
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress)}
                className="stroke-seg-free"
                style={{ transition: "stroke-dashoffset 0.3s linear" }}
              />
            </svg>
            {running && (
              <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-seg-free">
                <span className="absolute inset-0 rounded-full bg-seg-free animate-breathe" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-display text-4xl leading-none tabular-nums text-foreground">
              {fmt(remaining)}
            </div>
            <div className="mt-1.5 text-xs text-muted-foreground">
              {done ? "Selesai. Kembali dengan tenang." : running ? "Sedang berjalan…" : touched ? "Dijeda" : "Siap dimulai"}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {touched && (
              <button
                type="button"
                onClick={reset}
                aria-label="Ulangi timer"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
            <button
              type="button"
              onClick={running ? pause : start}
              aria-label={running ? "Jeda timer" : "Mulai timer"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {running ? (
                <Pause className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Play className="ml-0.5 h-4 w-4" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
