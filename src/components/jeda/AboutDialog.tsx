import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const POINTS = [
  {
    title: "Decision Fatigue",
    body: "Energi mental yang habis membuat otak lelah memilih, sehingga butuh panduan jeda instan tanpa pusing berpikir",
    ref: "ulasan Vogue",
  },
  {
    title: "Sunday Neurosis & Kebosanan Eksistensial",
    body: "Kecemasan atau kehampaan yang sering muncul saat rutinitas mendadak berhenti",
    ref: "Sándor Ferenczi & studi ResearchGate",
  },
  {
    title: "Productivity Guilt",
    body: "Budaya yang memicu rasa bersalah saat beristirahat, padahal jeda adalah kebutuhan",
    ref: "ulasan Relax A Little",
  },
  {
    title: "Rutinitas Transisi",
    body: "Jeda singkat yang disengaja penting untuk menurunkan stres dan memindahkan mode otak dari kerja ke santai secara mulus",
    ref: "Headspace & Simply Psychology",
  },
];

export function AboutLink() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-border bg-card/90 px-4 py-2 text-xs text-muted-foreground shadow-soft backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Mengapa Web App ini dibuat?
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl border-border bg-card p-7 shadow-lift sm:rounded-2xl sm:p-8">
          <p className="eyebrow">Tentang JedaHari</p>
          <DialogTitle className="font-display text-3xl font-normal leading-tight text-foreground">
            Mengapa Web App ini dibuat?
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            JedaHari hadir berdasarkan temuan psikologi medis dan perilaku:
          </DialogDescription>
          <ul className="space-y-4">
            {POINTS.map((p) => (
              <li key={p.title} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-seg-free" />
                <span>
                  <strong className="font-medium text-foreground">{p.title}:</strong> {p.body}{" "}
                  <span className="text-muted-foreground">(ref: {p.ref}).</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end pt-2">
            <Button variant="hero" onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
