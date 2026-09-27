"use client";

import { Suspense, useMemo, useState } from "react";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStanStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_IMAGES, NEIGHBORHOOD, CENTER } from "@/lib/data";
import type { Item } from "@/lib/types";
import { useNow } from "@/lib/useNow";
import SiteHeader from "@/components/SiteHeader";
import PillSelect from "@/components/PillSelect";

const NeighborhoodMap = nextDynamic(() => import("@/components/NeighborhoodMap"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "#E5E5E6" }} />,
});

const INK = "#0B0B0C";
const MUTED = "#63666A";
const ORANGE = "#0B0B0C";

function timeAgo(createdAt: number, now: number | null): string | null {
  if (now === null) return null;
  const minutes = Math.max(0, Math.round((now - createdAt) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Other";
}

function RedditPost({
  item,
  saved,
  onToggleSave,
  now,
}: {
  item: Item;
  saved: boolean;
  onToggleSave: (id: string) => void;
  now: number | null;
}) {
  const age = now !== null ? timeAgo(item.createdAt, now) : null;
  return (
    <div
      className="rd-reddit-post flex"
      style={{ border: "1px solid #E5E5E6", borderRadius: 12, background: "#ffffff", marginBottom: 14 }}
    >
      <Link href={`/item/${item.id}`} className="min-w-0 flex-1" style={{ padding: "18px 20px" }}>
        <div className="flex flex-wrap items-center" style={{ gap: 4, fontSize: 12, color: MUTED }}>
          <span style={{ fontWeight: 700, color: INK }}>{categoryLabel(item.category)}</span>
          <span>· {item.neighborhood}</span>
          {age && <span>· {age}</span>}
          <span>· Posted by {item.seller}</span>
          <span className="flex items-center" style={{ gap: 2 }}>
            <span style={{ color: "#0B0B0C" }}>★</span>
            <span style={{ fontWeight: 600, color: INK }}>{(item.sellerScore / 20).toFixed(1)}</span>
          </span>
        </div>

        <div className="flex items-start" style={{ gap: 16, marginTop: 6 }}>
          <div className="min-w-0 flex-1">
            <div style={{ fontSize: 18, fontWeight: 800, color: INK, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{item.title}</div>
            <div
              style={{
                fontSize: 13,
                color: MUTED,
                marginTop: 6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description}
            </div>
          </div>
          <div className="relative flex-none overflow-hidden" style={{ width: 108, height: 108, borderRadius: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image ?? CATEGORY_IMAGES[item.category]} alt="" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="flex flex-wrap items-center" style={{ gap: 20, marginTop: 14, fontSize: 12, fontWeight: 700, color: "#575859" }}>
          <span className="flex items-center" style={{ gap: 4, color: ORANGE }}>
            Free · {item.distanceMin} min walk · Qty {item.quantity}
          </span>
          <span className="flex items-center rd-ghost" style={{ gap: 6, padding: "8px 10px", borderRadius: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" /></svg>
            Share
          </span>
          <span
            className="flex cursor-pointer items-center rd-ghost"
            style={{ gap: 6, padding: "8px 10px", borderRadius: 8, color: saved ? ORANGE : "#575859" }}
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(item.id);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? ORANGE : "none"} stroke={saved ? ORANGE : "currentColor"} strokeWidth="1.8">
              <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" />
            </svg>
            {saved ? "Saved" : "Save"}
          </span>
        </div>
      </Link>
    </div>
  );
}

const PILL: React.CSSProperties = {
  height: 36,
  borderRadius: 8,
  padding: "0 14px",
  gap: 6,
  fontSize: 13,
  fontWeight: 700,
  color: INK,
  border: "none",
};


export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const items = useStanStore((s) => s.items);
  const savedIds = useStanStore((s) => s.savedIds);
  const toggleSave = useStanStore((s) => s.toggleSave);
  const currentUser = useStanStore((s) => s.currentUser);
  const loading = useStanStore((s) => s.loading);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlQuery = searchParams.get("q");
  const [query, setQuery] = useState(urlQuery ?? "");
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const now = useNow();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"distance" | "newest">("distance");

  // Sync local query with the URL's ?q= when it changes externally (e.g. a
  // Link navigation), without clobbering it on every keystroke.
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (urlQuery !== null) setQuery(urlQuery);
  }

  const available = useMemo(() => items.filter((it) => it.status === "available"), [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return available
      .filter(
        (it) =>
          (!q || it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q)) &&
          (!urlCategory || it.category === urlCategory) &&
          (maxDistance === null || it.distanceMin <= maxDistance) &&
          (minRating === null || it.sellerScore / 20 >= minRating),
      )
      .sort((a, b) => (sortBy === "newest" ? b.createdAt - a.createdAt : a.distanceMin - b.distanceMin));
  }, [available, query, urlCategory, maxDistance, minRating, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    available.forEach((it) => {
      counts[it.category] = (counts[it.category] ?? 0) + 1;
    });
    return counts;
  }, [available]);

  const filtersActive = maxDistance !== null || minRating !== null || query.trim() !== "";

  const handleToggleSave = (itemId: string) => {
    if (!currentUser) {
      router.push(`/auth?next=/`);
      return;
    }
    toggleSave(itemId);
  };

  return (
    <div className="h-dvh overflow-hidden bg-white" style={{ color: INK }}>
      <SiteHeader query={query} onQueryChange={setQuery} />

      <div className="flex">
        <main className="relative min-w-0 flex-1" style={{ height: "calc(100dvh - 56px)" }}>
          <div className="absolute inset-0">
            <NeighborhoodMap items={visible} highlightedId={hoveredId} onHover={setHoveredId} />
          </div>

          <div
            className="absolute overflow-y-auto rd-panel"
            style={{
              top: 16,
              bottom: 16,
              left: 16,
              width: 400,
              maxWidth: "calc(100% - 32px)",
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: "0 12px 36px rgba(0,0,0,0.16)",
              zIndex: 10,
              paddingTop: 12,
              paddingBottom: 24,
            }}
          >
            {urlCategory && (
              <div className="flex items-center" style={{ gap: 14, padding: "12px 16px 16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CATEGORY_IMAGES[urlCategory as Item["category"]]}
                  alt=""
                  style={{ width: 56, height: 56, borderRadius: 999, objectFit: "cover", border: "3px solid #ffffff", boxShadow: "0 0 0 1px #E5E5E6" }}
                />
                <div className="min-w-0 flex-1">
                  <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{categoryLabel(urlCategory)}</h1>
                  <div style={{ fontSize: 13, color: MUTED }}>
                    {categoryCounts[urlCategory] ?? 0} available near {NEIGHBORHOOD}
                  </div>
                </div>
                <Link href="/" className="rd-pill flex items-center" style={{ ...PILL, height: 36, fontSize: 14 }}>
                  All categories
                </Link>
              </div>
            )}

            <div className="flex overflow-x-auto" style={{ gap: 22, padding: "6px 16px 0", borderBottom: "1px solid #E5E5E6" }}>
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                const active = urlCategory === cat.id;
                return (
                  <Link
                    key={cat.id}
                    href={active ? "/" : `/?category=${cat.id}`}
                    className="flex flex-none flex-col items-center"
                    style={{
                      gap: 6,
                      padding: "2px 0 10px",
                      borderBottom: active ? `2px solid ${ORANGE}` : "2px solid transparent",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CATEGORY_IMAGES[cat.id as Item["category"]]}
                      alt=""
                      style={{ width: 26, height: 26, borderRadius: 999, objectFit: "cover", flex: "none", opacity: active ? 1 : 0.75 }}
                    />
                    <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? ORANGE : MUTED, whiteSpace: "nowrap" }}>
                      {cat.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center" style={{ gap: 10, padding: "14px 8px 10px" }}>
              <PillSelect
                value={sortBy}
                onChange={(v) => setSortBy(v)}
                options={[
                  { value: "distance", label: "Nearest" },
                  { value: "newest", label: "Newest" },
                ]}
              />
              <PillSelect
                value={maxDistance === null ? "" : String(maxDistance)}
                onChange={(v) => setMaxDistance(v ? Number(v) : null)}
                options={[
                  { value: "", label: "Any distance" },
                  { value: "3", label: "Under 3 min walk" },
                  { value: "5", label: "Under 5 min walk" },
                  { value: "10", label: "Under 10 min walk" },
                ]}
              />
              <PillSelect
                value={minRating === null ? "" : String(minRating)}
                onChange={(v) => setMinRating(v ? Number(v) : null)}
                options={[
                  { value: "", label: "Any rating" },
                  { value: "4.5", label: "4.5★ & up" },
                  { value: "4", label: "4★ & up" },
                  { value: "3.5", label: "3.5★ & up" },
                ]}
              />
              <div className="ml-auto" style={{ fontSize: 12, color: MUTED, paddingRight: 8 }}>
                {visible.length} {visible.length === 1 ? "listing" : "listings"} · {NEIGHBORHOOD}
              </div>
            </div>

            <div style={{ height: 1, background: "#E5E5E6" }} />

            {loading ? (
              <div style={{ padding: "16px 8px 0" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ border: "1px solid #E5E5E6", borderRadius: 8, padding: 14, marginBottom: 10, display: "flex", gap: 12 }}>
                    <div style={{ height: 14, borderRadius: 6, background: "#F0F0F1", flex: 1 }} />
                    <div style={{ width: 96, height: 96, borderRadius: 8, background: "#F0F0F1" }} />
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              filtersActive || urlCategory ? (
                <div className="text-center" style={{ padding: "56px 16px" }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Nothing matches</div>
                  <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>Try a different search, category or filter.</div>
                  <Link
                    href="/"
                    onClick={() => {
                      setQuery("");
                      setMaxDistance(null);
                      setMinRating(null);
                    }}
                    className="rd-pill mt-4 inline-flex items-center"
                    style={{ ...PILL, height: 40, fontSize: 14, padding: "0 18px" }}
                  >
                    Clear filters
                  </Link>
                </div>
              ) : (
                <div className="text-center" style={{ padding: "56px 16px" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: INK }}>
                    No listings near {NEIGHBORHOOD} yet
                  </div>
                  <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>
                    Be the first neighbor to share something.
                  </div>
                  <Link
                    href="/sell"
                    className="rd-pill mt-4 inline-flex items-center"
                    style={{ ...PILL, height: 40, fontSize: 14, padding: "0 18px", background: ORANGE, color: "#ffffff" }}
                  >
                    Post the first listing
                  </Link>
                </div>
              )
            ) : (
              <div style={{ padding: "16px 4px 0" }}>
                {visible.map((item) => (
                  <RedditPost key={item.id} item={item} saved={savedIds.includes(item.id)} onToggleSave={handleToggleSave} now={now} />
                ))}
              </div>
            )}
          </div>

          <div
            className="absolute rd-panel"
            style={{ top: 16, right: 16, zIndex: 10, background: "#ffffff", borderRadius: 16, padding: "14px 18px", boxShadow: "0 12px 36px rgba(0,0,0,0.16)" }}
          >
            <div style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>Listings nearby</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>{visible.length}</div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${CENTER[0]},${CENTER[1]}&travelmode=walking`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center"
              style={{ gap: 5, marginTop: 6, fontSize: 12, fontWeight: 700, color: INK }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 11 18-8-8 18-2-8-8-2Z" />
              </svg>
              Get directions
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
