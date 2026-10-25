import { Pause, Play, RotateCcw, Share2, Timer } from "lucide-react";
import type { CSSProperties } from "react";
import { toast } from "sonner";
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

  const share = async () => {
    const text = `Baru saja menyelesaikan jeda hari ini di JedaHari 🌿✨ — "${activity.title}" (${activity.minutes} menit) buat diriku lebih tenang. Coba di jedahari.app`;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: "JedaHari", text });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Pesan jeda tersalin", {
        description: "Tempelkan ke WhatsApp, Telegram, atau aplikasi mana pun.",
      });
    } catch {
      toast.error("Tidak dapat menyalin. Salin pesan secara manual ya.");
    }
  };

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

      <p className="eyebrow mt-8">{activity.category}</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h3 className="font-display text-3xl leading-tight text-foreground">{activity.title}</h3>
        <span
          className="mt-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium tabular-nums text-foreground"
          aria-label={`Durasi ${activity.minutes} menit`}
        >
          <Timer className="h-3.5 w-3.5 text-seg-free" strokeWidth={2} aria-hidden />
          {activity.minutes} Menit
        </span>
      </div>
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

        {done && (
          <button
            type="button"
            onClick={share}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-sm font-medium text-foreground shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Share2 className="h-4 w-4" strokeWidth={1.75} />
            Bagikan Jeda
          </button>
        )}
      </div>
    </article>
  );
}
