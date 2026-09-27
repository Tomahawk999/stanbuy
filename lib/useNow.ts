"use client";

import { useSyncExternalStore } from "react";

let cached = 0;

function subscribe(callback: () => void) {
  const interval = setInterval(() => {
    cached = Date.now();
    callback();
  }, 30000);
  return () => clearInterval(interval);
}

function getSnapshot(): number {
  if (cached === 0) cached = Date.now();
  return cached;
}

function getServerSnapshot(): null {
  return null;
}

// Returns null on the server and on first client render (avoiding an SSR
// hydration mismatch), then the current time, refreshed every 30s.
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
