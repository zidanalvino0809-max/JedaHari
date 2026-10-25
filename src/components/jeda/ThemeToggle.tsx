import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "jedahari-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={dark ? "Mode terang" : "Mode gelap"}
      className="group relative inline-flex h-10 w-[4.5rem] items-center rounded-full border border-border bg-card p-1 shadow-soft transition-colors"
    >
      <span
        className={`absolute top-1 h-8 w-8 rounded-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          dark ? "translate-x-8" : "translate-x-0"
        }`}
      />
      <span className="relative z-10 flex w-full justify-between px-[0.4rem]">
        <Sun
          className={`h-4 w-4 transition-colors ${dark ? "text-muted-foreground" : "text-primary-foreground"}`}
        />
        <Moon
          className={`h-4 w-4 transition-colors ${dark ? "text-primary-foreground" : "text-muted-foreground"}`}
        />
      </span>
    </button>
  );
}
