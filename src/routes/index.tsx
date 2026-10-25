import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Shuffle } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { ActivityCard } from "@/components/jeda/ActivityCard";
import { DayGauge } from "@/components/jeda/DayGauge";
import { ThemeToggle } from "@/components/jeda/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MOODS, pickActivities, type Activity, type MoodId } from "@/lib/activities";
import { computeDay, formatClock, formatDuration } from "@/lib/day-balance";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JedaHari — Temukan ruang di sela rutinitasmu" },
      {
        name: "description",
        content:
          "Lihat keseimbangan 24 jammu, pilih suasana hati, dan dapatkan tiga jeda mikro lengkap dengan timer.",
      },
      { property: "og:title", content: "JedaHari — Temukan ruang di sela rutinitasmu" },
      {
        property: "og:description",
        content: "Rancang jeda kecil yang pas dengan waktu bebas dan suasana hatimu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

interface Plan {
  key: number;
  mood: MoodId;
  items: Activity[];
}

function Index() {
  const [work, setWork] = useState(8);
  const [sleep, setSleep] = useState(7.5);
  const [bedtime, setBedtime] = useState(22.5);
  const [mood, setMood] = useState<MoodId | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const day = useMemo(
    () => computeDay({ workHours: work, sleepHours: sleep, bedtime }),
    [work, sleep, bedtime],
  );

  const design = () => {
    if (!mood) return;
    setPlan((p) => ({ key: (p?.key ?? 0) + 1, mood, items: pickActivities(mood) }));
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const planMood = plan ? MOODS.find((m) => m.id === plan.mood) : null;
  const planMinutes = plan?.items.reduce((s, a) => s + a.minutes, 0) ?? 0;

  return (
    <div className="min-h-screen bg-ambient">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Header */}
        <header className="flex items-start justify-between gap-6 pt-8 sm:pt-12">
          <div>
            <h1 className="font-display text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
              Jeda<span className="italic text-seg-free">Hari</span>
            </h1>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground sm:text-base">
              Temukan ruang di sela rutinitasmu.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main>
          {/* 01 — Gauge */}
          <section className="pt-16 sm:pt-24" aria-labelledby="ritme">
            <SectionLabel n="01" title="Ritme Harimu" id="ritme" />
            <div className="mt-10 grid items-center gap-14 md:grid-cols-[1.1fr_1fr] md:gap-20">
              <DayGauge day={day} />

              <div className="space-y-10">
                <p className="font-display text-3xl leading-snug text-foreground sm:text-4xl">
                  Dari 24 jam, ada{" "}
                  <span className="italic text-seg-free">{formatDuration(day.free)}</span> yang
                  sepenuhnya milikmu.
                </p>

                <div className="space-y-8">
                  <Control
                    label="Jam Kerja / Sekolah"
                    dot="bg-seg-work"
                    range="bg-seg-work"
                    value={work}
                    display={formatDuration(day.work)}
                    hint={`${formatClock(day.workStart)} – ${formatClock(day.workEnd)}`}
                    min={0}
                    max={14}
                    onChange={setWork}
                  />
                  <Control
                    label="Jam Tidur"
                    dot="bg-seg-sleep"
                    range="bg-seg-sleep"
                    value={sleep}
                    display={formatDuration(day.sleep)}
                    hint={`${formatClock(day.bedtime)} – ${formatClock(day.wake)}`}
                    min={4}
                    max={12}
                    onChange={setSleep}
                  />
                  <Control
                    label="Mulai Tidur"
                    dot="bg-foreground/40"
                    range="bg-foreground/40"
                    value={bedtime}
                    display={formatClock(bedtime)}
                    hint="Geser untuk menyesuaikan jam tidurmu"
                    min={19}
                    max={26}
                    onChange={setBedtime}
                  />
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-xs text-muted-foreground">
                  <Legend className="bg-seg-sleep" label="Tidur" />
                  <Legend className="bg-seg-work" label="Kerja / Sekolah" />
                  <Legend className="bg-seg-free" label="Waktu Bebas" />
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-foreground" /> Sekarang
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 02 — Mood */}
          <section className="pt-24 sm:pt-32" aria-labelledby="suasana">
            <SectionLabel n="02" title="Bagaimana Rasamu Sekarang?" id="suasana" />
            <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5" role="radiogroup" aria-label="Pilih suasana hati">
              {MOODS.map((m) => {
                const active = mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMood(m.id)}
                    className={cn(
                      "relative rounded-3xl border bg-card p-6 text-left transition-all duration-500 ease-out sm:p-7",
                      "hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "border-foreground/70 shadow-lift" : "border-border shadow-soft",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent",
                      )}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="block text-4xl" aria-hidden>
                      {m.emoji}
                    </span>
                    <span className="mt-6 block font-display text-2xl text-foreground">{m.label}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                      {m.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-14 flex flex-col items-center gap-4">
              <Button variant="hero" size="xl" onClick={design} disabled={!mood}>
                Rancang Jeda Hari
                <ArrowRight />
              </Button>
              <p className="text-xs text-muted-foreground">
                {mood ? "Tiga jeda kecil akan disiapkan untukmu." : "Pilih suasana hatimu terlebih dahulu."}
              </p>
            </div>
          </section>

          {/* 03 — Results */}
          {plan && planMood && (
            <section
              ref={resultsRef}
              key={plan.key}
              className="scroll-mt-8 pt-24 sm:pt-32"
              aria-labelledby="jeda"
            >
              <div className="animate-rise flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionLabel n="03" title="Jeda Untukmu" id="jeda" />
                  <h2 className="mt-6 max-w-xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
                    {planMood.headline}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {day.free * 60 >= planMinutes
                      ? `Total ${planMinutes} menit — hanya sebagian kecil dari ${formatDuration(day.free)} waktu bebasmu.`
                      : `Waktumu sempit hari ini. Cukup curi satu jeda saja, itu sudah berarti.`}
                  </p>
                </div>
                <Button variant="soft" size="lg" onClick={design} className="self-start rounded-full sm:self-auto">
                  <Shuffle /> Acak Ulang
                </Button>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {plan.items.map((a, i) => (
                  <ActivityCard
                    key={a.id}
                    activity={a}
                    index={i}
                    style={{ animationDelay: `${150 + i * 130}ms` }}
                  />
                ))}
              </div>
            </section>
          )}
        </main>

        <footer className="mt-32 flex flex-col items-center justify-between gap-2 border-t border-border py-10 text-xs text-muted-foreground sm:flex-row">
          <span className="font-display text-base text-foreground">JedaHari</span>
          <span>Berhenti sejenak bukan berarti tertinggal.</span>
        </footer>
      </div>
    </div>
  );
}

function SectionLabel({ n, title, id }: { n: string; title: string; id: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="eyebrow tabular-nums">{n}</span>
      <span className="h-px w-10 bg-border" />
      <span id={id} className="eyebrow text-foreground">
        {title}
      </span>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", className)} /> {label}
    </span>
  );
}

function Control(props: {
  label: string;
  dot: string;
  range: string;
  value: number;
  display: string;
  hint: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex items-center gap-2.5 text-sm text-foreground">
          <span className={cn("h-2 w-2 rounded-full", props.dot)} />
          {props.label}
        </span>
        <span className="font-display text-xl tabular-nums text-foreground">{props.display}</span>
      </div>
      <Slider
        className="mt-3"
        rangeClassName={props.range}
        thumbLabel={props.label}
        value={[props.value]}
        min={props.min}
        max={props.max}
        step={0.5}
        onValueChange={([v]) => props.onChange(v)}
      />
      <p className="mt-1.5 text-xs text-muted-foreground">{props.hint}</p>
    </div>
  );
}
