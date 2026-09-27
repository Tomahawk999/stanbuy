"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStanStore } from "@/lib/store";

export default function StoreHydrator() {
  const hydrate = useStanStore((s) => s.hydrate);
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    hydrate();
  }, [hydrate, status]);

  return null;
}
