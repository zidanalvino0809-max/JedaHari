import { useEffect, useState } from "react";
import { formatNow, hourOfDay, type DayBalance, type Segment } from "@/lib/day-balance";

const SIZE = 340;
const C = SIZE / 2;
const R = 140;
const STROKE = 18;
const CIRC = 2 * Math.PI * R;
const GAP = STROKE + 6; // round caps add STROKE/2 each side

const strokeFor: Record<Segment["kind"], string> = {
  sleep: "stroke-seg-sleep",
  work: "stroke-seg-work",
  free: "stroke-seg-free",
};

function polar(hour: number, radius: number) {
  const a = (hour / 24) * 2 * Math.PI - Math.PI / 2;
  // Round so server and client render identical attributes (avoids hydration mismatch).
  const round = (n: number) => Math.round(n * 100) / 100;
  return { x: round(C + radius * Math.cos(a)), y: round(C + radius * Math.sin(a)) };
}

export function DayGauge({ day }: { day: DayBalance }) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    let timeout: number | undefined;

    // Tick on each real second boundary of the system clock so the dot never drifts.
    const tick = () => {
      const d = new Date();
      setNow(d);
      timeout = window.setTimeout(tick, 1000 - d.getMilliseconds() + 5);
    };
    // Re-sync immediately when the tab becomes visible again (timers are throttled in background).
    const resync = () => {
      if (document.visibilityState !== "visible") return;
      window.clearTimeout(timeout);
      tick();
    };

    tick();
    document.addEventListener("visibilitychange", resync);
    window.addEventListener("focus", resync);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      document.removeEventListener("visibilitychange", resync);
      window.removeEventListener("focus", resync);
    };
  }, []);

  const nowHour = now ? hourOfDay(now) : null;

  const freeH = Math.floor(day.free);
  const freeM = Math.round((day.free - freeH) * 60);
  const pct = Math.round((day.free / 24) * 100);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full overflow-visible"
        role="img"
        aria-label={`Diagram 24 jam: tidur ${day.sleep} jam, kerja atau sekolah ${day.work} jam, waktu bebas ${day.free} jam`}
      >
        {/* track */}
        <circle cx={C} cy={C} r={R} fill="none" strokeWidth={STROKE} className="stroke-track" />

        {/* hour ticks */}
        {Array.from({ length: 96 }).map((_, i) => {
          const hour = i / 4;
          const major = i % 24 === 0;
          const hourly = i % 4 === 0;
          const inner = polar(hour, R - STROKE / 2 - (major ? 16 : hourly ? 10 : 6));
          const outer = polar(hour, R - STROKE / 2 - 3);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              strokeLinecap="round"
              strokeWidth={major ? 1.5 : 1}
              className={major ? "stroke-foreground/50" : hourly ? "stroke-foreground/20" : "stroke-foreground/8"}
            />
          );
        })}

        {[0, 6, 12, 18].map((h) => {
          const p = polar(h, R - STROKE / 2 - 30);
          return (
            <text
              key={h}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground text-[10px] tracking-[0.2em]"
            >
              {String(h).padStart(2, "0")}
            </text>
          );
        })}

        {/* segments */}
        {day.segments.map((seg) => {
          const raw = (seg.duration / 24) * CIRC;
          const visible = mounted && seg.duration > 0.05;
          const len = visible ? Math.max(0.001, raw - GAP) : 0.001;
          const offsetDeg = (GAP / 2 / CIRC) * 360;
          const rot = (seg.start / 24) * 360 - 90 + (visible ? offsetDeg : 0);
          return (
            <circle
              key={seg.slot}
              cx={C}
              cy={C}
              r={R}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${len} ${CIRC}`}
              className={strokeFor[seg.kind]}
              style={{
                transform: `rotate(${rot}deg)`,
                transformOrigin: "50% 50%",
                opacity: visible && raw > GAP ? 1 : 0,
                transition:
                  "stroke-dasharray 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
              }}
            />
          );
        })}

        {/* now marker — positioned from the system clock, to the second */}
        {nowHour !== null &&
          (() => {
            const p = polar(nowHour, R + STROKE / 2 + 12);
            const tickIn = polar(nowHour, R + STROKE / 2 + 2);
            return (
              <g aria-label={`Sekarang pukul ${formatNow(now!)}`}>
                <line
                  x1={tickIn.x}
                  y1={tickIn.y}
                  x2={p.x}
                  y2={p.y}
                  strokeWidth={1}
                  strokeLinecap="round"
                  className="stroke-foreground/40"
                />
                <circle cx={p.x} cy={p.y} r={7} className="fill-seg-free/30 animate-breathe" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                <circle cx={p.x} cy={p.y} r={3.5} className="fill-foreground" />
              </g>
            );
          })()}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="eyebrow">Waktu Bebas</span>
        <div className="mt-2 flex items-baseline font-display leading-none text-foreground">
          <span className="text-7xl tabular-nums sm:text-8xl">{freeH}</span>
          <span className="ml-1 text-2xl text-muted-foreground">j</span>
          {freeM > 0 && (
            <>
              <span className="ml-3 text-5xl tabular-nums sm:text-6xl">{freeM}</span>
              <span className="ml-1 text-xl text-muted-foreground">m</span>
            </>
          )}
        </div>
        <span className="mt-3 text-xs text-muted-foreground">{pct}% dari harimu</span>
        <span
          className="mt-2 flex h-4 items-center gap-1.5 text-[11px] tabular-nums text-muted-foreground"
          aria-live="off"
        >
          {now && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              Sekarang {formatNow(now)}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
