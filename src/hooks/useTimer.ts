import { useRef, useState, useCallback } from 'react';

export interface TimerControls {
  elapsedMs: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useTimer(): TimerControls {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const tick = useCallback(() => {
    if (!runningRef.current) return;
    const now = performance.now();
    setElapsedMs(accumulatedRef.current + (now - startTimeRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    accumulatedRef.current = 0;
    startTimeRef.current = performance.now();
    runningRef.current = true;
    setElapsedMs(0);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (!runningRef.current) return;
    runningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    accumulatedRef.current += performance.now() - startTimeRef.current;
  }, []);

  const resume = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return { elapsedMs, start, pause, resume, stop };
}
