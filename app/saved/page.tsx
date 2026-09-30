"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStanStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_IMAGES } from "@/lib/data";
import PageShell from "@/components/PageShell";

const INK = "#0B0B0C";
const MUTED = "#63666A";
const ORANGE = "#0B0B0C";

export default function SavedPage() {
  const router = useRouter();
  const items = useStanStore((s) => s.items);
  const savedIds = useStanStore((s) => s.savedIds);
  const toggleSave = useStanStore((s) => s.toggleSave);
  const currentUser = useStanStore((s) => s.currentUser);
  const loading = useStanStore((s) => s.loading);

  useEffect(() => {
    if (!loading && !currentUser) router.replace("/auth?next=/saved");
  }, [loading, currentUser, router]);

  const saved = items.filter((i) => savedIds.includes(i.id));

  if (!currentUser) {
    return (
      <PageShell>
        <div style={{ padding: "80px 0", textAlign: "center", fontSize: 14, color: MUTED }}>
          {loading ? "Loading…" : "Redirecting to sign in…"}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-2 flex items-center justify-between" style={{ padding: "0 8px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: INK, margin: 0 }}>Saved</h1>
        <span style={{ fontSize: 13, color: MUTED }}>
          {saved.length} {saved.length === 1 ? "listing" : "listings"}
        </span>
      </div>

      {saved.length === 0 ? (
        <div className="text-center" style={{ padding: "56px 16px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: INK }}>Nothing saved yet</div>
          <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>
            Tap the heart on a listing to keep track of it here.
          </div>
          <Link
            href="/browse"
            className="rd-pill mt-4 inline-flex items-center"
            style={{ height: 40, borderRadius: 12, padding: "0 18px", background: "#E5E5E6", fontSize: 14, fontWeight: 600, color: INK }}
          >
            Browse nearby
          </Link>
        </div>
      ) : (
        <div style={{ paddingBottom: 20 }}>
          {saved.map((item) => {
            const claimed = item.status !== "available";
            return (
              <div key={item.id}>
                <Link href={`/item/${item.id}`} className="rd-post flex items-center" style={{ gap: 14, borderRadius: 16, padding: "12px 8px" }}>
                  <div className="relative flex-none overflow-hidden" style={{ width: 96, height: 96, borderRadius: 16 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image ?? CATEGORY_IMAGES[item.category]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSave(item.id);
                      }}
                      aria-label="Remove from saved"
                      className="absolute flex cursor-pointer items-center justify-center border-none"
                      style={{ top: 6, right: 6, width: 26, height: 26, borderRadius: 999, background: "#ffffff" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={ORANGE} stroke={ORANGE} strokeWidth="2">
                        <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.2C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.3 12 21 12 21Z" />
                      </svg>
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start" style={{ gap: 8 }}>
                      <div className="min-w-0 flex-1" style={{ fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1.3 }}>
                        {item.title}
                      </div>
                      <span className="flex flex-none items-center" style={{ gap: 3, fontSize: 13, marginTop: 1 }}>
                        <span style={{ color: "#0B0B0C" }}>★</span>
                        <span style={{ fontWeight: 600, color: INK }}>{(item.sellerScore / 20).toFixed(1)}</span>
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                      {CATEGORIES.find((c) => c.id === item.category)?.label ?? "Other"} · {item.neighborhood} · {item.distanceMin} min walk
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {claimed ? (
                        <span style={{ height: 24, borderRadius: 999, padding: "0 10px", fontSize: 11, fontWeight: 700, color: MUTED, background: "#E5E5E6", display: "inline-flex", alignItems: "center" }}>
                          No longer available
                        </span>
                      ) : (
                        <span className="inline-flex items-center" style={{ height: 24, borderRadius: 999, padding: "0 10px", fontSize: 11, fontWeight: 700, color: ORANGE, background: "#F0F0F1" }}>
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div style={{ height: 1, background: "#E5E5E6", margin: "0 8px" }} />
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
