import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const endRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setRunning(false);
    };
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    const base = remaining === 0 ? totalSeconds : remaining;
    if (remaining === 0) setRemaining(totalSeconds);
    endRef.current = Date.now() + base * 1000;
    setRunning(true);
  }, [remaining, totalSeconds]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  return { remaining, running, done: remaining === 0, start, pause, reset };
}
