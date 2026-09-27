"use client";

import { useEffect, useState } from "react";

export default function CountdownLabel({ expiresAt }: { expiresAt: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = Math.max(0, expiresAt - now);
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const label = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return <>{label}</>;
}
