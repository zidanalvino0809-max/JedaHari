import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  MAX_AGE,
  MIN_AGE,
  STATUS_OPTIONS,
  defaultSchedule,
  workLabel,
  type Profile,
  type Status,
} from "@/lib/profile";
import { formatClock, formatDuration } from "@/lib/day-balance";
import { cn } from "@/lib/utils";

export function OnboardingDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial: Profile | null;
  onSave: (p: Profile) => void;
  /** Absent on first run: the user must finish onboarding. */
  onClose?: () => void;
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [age, setAge] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setStatus(initial?.status ?? null);
    setAge(initial ? String(initial.age) : "");
    setTouched(false);
  }, [open, initial]);

  const ageNum = Number(age);
  const ageValid = age !== "" && Number.isInteger(ageNum) && ageNum >= MIN_AGE && ageNum <= MAX_AGE;
  const valid = name.trim().length > 0 && status !== null && ageValid;
  const preview = status && ageValid ? defaultSchedule({ status, age: ageNum }) : null;
  const editing = Boolean(onClose);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid || !status) return;
    onSave({ name: name.trim().slice(0, 40), status, age: ageNum });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose?.()}>
      <DialogContent
        hideClose={!editing}
        onEscapeKeyDown={(e) => !editing && e.preventDefault()}
        onPointerDownOutside={(e) => !editing && e.preventDefault()}
        className="max-h-[92vh] max-w-md overflow-y-auto rounded-3xl border-border bg-card p-7 shadow-lift sm:rounded-3xl sm:p-9"
      >
        <form onSubmit={submit} className="space-y-7">
          <div>
            <p className="eyebrow">{editing ? "Ubah Profil" : "Selamat Datang"}</p>
            <DialogTitle className="mt-3 font-display text-4xl font-normal leading-tight tracking-normal text-foreground">
              {editing ? (
                "Sesuaikan dirimu."
              ) : (
                <>
                  Kenalan dulu, <span className="italic text-seg-free">yuk.</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tiga hal kecil agar JedaHari bisa menyesuaikan ritme dan jeda untukmu.
            </DialogDescription>
          </div>

          <Field n="1" label="Nama panggilan" htmlFor="ob-name">
            <input
              id="ob-name"
              autoFocus
              autoComplete="given-name"
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misalnya, Dinda"
              className={inputCls}
            />
            {touched && !name.trim() && <ErrorText>Nama belum diisi.</ErrorText>}
          </Field>

          <Field n="2" label="Kesibukan utama">
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Kesibukan utama">
              {STATUS_OPTIONS.map((o) => {
                const active = status === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setStatus(o.id)}
                    className={cn(
                      "relative rounded-2xl border p-4 text-left transition-all duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "border-foreground/70 bg-background shadow-soft" : "border-border hover:bg-muted/60",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent",
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    <span className="block font-display text-xl text-foreground">{o.label}</span>
                    <span className="mt-1 block text-xs leading-snug text-muted-foreground">{o.hint}</span>
                  </button>
                );
              })}
            </div>
            {touched && !status && <ErrorText>Pilih salah satu.</ErrorText>}
          </Field>

          <Field n="3" label="Usia" htmlFor="ob-age">
            <div className="relative">
              <input
                id="ob-age"
                type="number"
                inputMode="numeric"
                min={MIN_AGE}
                max={MAX_AGE}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="20"
                className={cn(inputCls, "pr-16 tabular-nums")}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                tahun
              </span>
            </div>
            {touched && !ageValid && (
              <ErrorText>
                Masukkan usia antara {MIN_AGE} dan {MAX_AGE} tahun.
              </ErrorText>
            )}
          </Field>

          <div
            className={cn(
              "rounded-2xl border border-dashed border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground transition-opacity duration-300",
              preview ? "opacity-100" : "opacity-60",
            )}
            aria-live="polite"
          >
            {preview && status ? (
              <>
                Kami siapkan: {workLabel({ status, age: ageNum }).toLowerCase()}{" "}
                <span className="text-foreground">{formatDuration(preview.work)}</span>, tidur{" "}
                <span className="text-foreground">{formatDuration(preview.sleep)}</span> mulai pukul{" "}
                <span className="text-foreground">{formatClock(preview.bedtime)}</span>. Bisa kamu geser kapan saja.
              </>
            ) : (
              "Jam harianmu akan terisi otomatis sesuai kesibukan dan usiamu."
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {editing && (
              <Button type="button" variant="soft" size="lg" onClick={onClose}>
                Batal
              </Button>
            )}
            <Button type="submit" variant="hero" size="lg" className="h-12">
              {editing ? "Simpan Perubahan" : "Mulai JedaHari"}
              <ArrowRight />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const inputCls =
  "h-12 w-full rounded-2xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function Field({
  n,
  label,
  htmlFor,
  children,
}: {
  n: string;
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2.5 flex items-center gap-3 text-sm text-foreground">
        <span className="font-display text-base text-muted-foreground tabular-nums">0{n}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-destructive">{children}</p>;
}
