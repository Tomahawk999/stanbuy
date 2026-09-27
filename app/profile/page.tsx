"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useStanStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_IMAGES } from "@/lib/data";
import { useNow } from "@/lib/useNow";
import PageShell from "@/components/PageShell";

const INK = "#0B0B0C";
const MUTED = "#63666A";
const ORANGE = "#0B0B0C";

function timeAgo(ts: number, now: number): string {
  const minutes = Math.max(0, Math.round((now - ts) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function StatRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 12, padding: "9px 0" }}>
      <span className="flex flex-none items-center justify-center" style={{ width: 20, color: INK }}>{icon}</span>
      <span style={{ fontSize: 14, color: INK }}>{children}</span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const items = useStanStore((s) => s.items);
  const reservations = useStanStore((s) => s.reservations);
  const savedIds = useStanStore((s) => s.savedIds);
  const score = useStanStore((s) => s.reliabilityScore);
  const currentUser = useStanStore((s) => s.currentUser);
  const loading = useStanStore((s) => s.loading);
  const [tab, setTab] = useState<"selling" | "sold">("selling");
  const now = useNow();

  useEffect(() => {
    if (!loading && !currentUser) router.replace("/auth?next=/profile");
  }, [loading, currentUser, router]);

  if (!currentUser) {
    return (
      <PageShell>
        <div style={{ padding: "80px 0", textAlign: "center", fontSize: 14, color: MUTED }}>
          {loading ? "Loading…" : "Redirecting to sign in…"}
        </div>
      </PageShell>
    );
  }

  const mine = items.filter((i) => i.mine);
  const activeMine = mine.filter((i) => i.status !== "claimed");
  const soldMine = mine.filter((i) => i.status === "claimed");
  const sold = soldMine.length;
  const visibleMine = [...(tab === "selling" ? activeMine : soldMine)].sort((a, b) => b.createdAt - a.createdAt);

  const activity = [...reservations]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6)
    .map((r) => {
      const relatedItem = items.find((i) => i.id === r.itemId);
      const label = r.status === "picked_up" ? "Picked up" : r.status === "expired" ? "Reservation expired" : "Reserved";
      return { id: r.id, label, title: relatedItem?.title ?? "Listing", createdAt: r.createdAt };
    });

  return (
    <PageShell>
      <div className="flex flex-col sm:flex-row" style={{ gap: 40, padding: "24px 8px 40px" }}>
        <aside className="flex-none" style={{ width: "100%", maxWidth: 280 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: INK, margin: 0, letterSpacing: "-0.01em" }}>{currentUser.name}</h1>

          <div style={{ height: 1, background: "#E5E5E6", margin: "20px 0" }} />

          <div className="grid grid-cols-3" style={{ gap: 8, textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{(score / 20).toFixed(1)}</div>
              <div className="flex items-center justify-center" style={{ gap: 3, fontSize: 11, color: MUTED }}>
                <span style={{ color: "#0B0B0C" }}>★</span> Rating
              </div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{sold}</div>
              <div style={{ fontSize: 11, color: MUTED }}>Sold</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{currentUser.memberSince}</div>
              <div style={{ fontSize: 11, color: MUTED }}>Since</div>
            </div>
          </div>

          <div style={{ height: 1, background: "#E5E5E6", margin: "20px 0" }} />

          <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 4 }}>{currentUser.name.split(" ")[0]}&apos;s confirmed info</div>
          <StatRow icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A7A3C" strokeWidth="2.2"><path d="M5 13l4 4L19 7" /></svg>}>
            {currentUser.email}
          </StatRow>
          <StatRow icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.3" /></svg>}>
            Lives in {currentUser.neighborhood}
          </StatRow>

          <div style={{ height: 1, background: "#E5E5E6", margin: "20px 0" }} />

          <Link href="/saved" className="flex items-center justify-between" style={{ padding: "9px 0", fontSize: 14, fontWeight: 600, color: INK }}>
            Saved listings
            <span style={{ color: MUTED }}>{savedIds.length} →</span>
          </Link>
          <Link href="/legal?tab=score" className="flex items-center justify-between" style={{ padding: "9px 0", fontSize: 14, fontWeight: 600, color: INK }}>
            How Reliability Score works
            <span style={{ color: MUTED }}>→</span>
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-4 inline-flex w-full cursor-pointer items-center justify-center"
            style={{ height: 42, borderRadius: 10, border: "1px solid #E5E5E6", background: "#ffffff", fontSize: 14, fontWeight: 700, color: INK }}
          >
            Log out
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center" style={{ gap: 24, borderBottom: "1px solid #E5E5E6" }}>
            {(["selling", "sold"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="cursor-pointer border-none bg-transparent"
                style={{
                  padding: "0 0 12px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: tab === t ? INK : MUTED,
                  borderBottom: tab === t ? `2px solid ${ORANGE}` : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {t === "selling" ? `Selling (${activeMine.length})` : `Sold (${sold})`}
              </button>
            ))}
          </div>

          {visibleMine.length === 0 ? (
            <div style={{ fontSize: 14, color: MUTED, padding: "20px 4px" }}>
              {tab === "selling" ? "You haven't listed anything yet." : "Nothing sold yet."}
            </div>
          ) : (
            <div style={{ paddingTop: 4 }}>
              {visibleMine.map((item) => (
                <div key={item.id}>
                  <Link href={`/item/${item.id}`} className="rd-post flex items-center" style={{ gap: 14, borderRadius: 16, padding: "14px 4px" }}>
                    <div className="relative flex-none overflow-hidden" style={{ width: 84, height: 84, borderRadius: 14 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image ?? CATEGORY_IMAGES[item.category]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1.3 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                        {CATEGORIES.find((c) => c.id === item.category)?.label ?? "Other"} · {item.neighborhood} · {item.distanceMin} min walk
                      </div>
                    </div>
                  </Link>
                  <div style={{ height: 1, background: "#E5E5E6", margin: "0 4px" }} />
                </div>
              ))}
            </div>
          )}

          <div id="activity" style={{ marginTop: 32, paddingTop: 4, scrollMarginTop: 80 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: INK, margin: "0 0 12px", padding: "0 4px", letterSpacing: "-0.01em" }}>
              Recent activity
            </h2>
            {activity.length === 0 ? (
              <div style={{ fontSize: 14, color: MUTED, padding: "0 4px" }}>
                No reservations yet — browse nearby listings to get started.
              </div>
            ) : (
              <div style={{ padding: "0 4px" }}>
                {activity.map((a, i) => (
                  <div key={a.id} style={{ padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid #E5E5E6" }}>
                    <div style={{ fontSize: 14, color: INK }}>
                      <span style={{ fontWeight: 600 }}>{a.label}</span> · {a.title}
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{now !== null ? timeAgo(a.createdAt, now) : ""}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
