"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStanStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_IMAGES, NEIGHBORHOOD, CENTER } from "@/lib/data";
import type { Item } from "@/lib/types";
import { useNow } from "@/lib/useNow";
import SiteHeader from "@/components/SiteHeader";
import SideNav from "@/components/SideNav";
import SiteFooter from "@/components/SiteFooter";
import PillSelect from "@/components/PillSelect";

const NeighborhoodMap = dynamic(() => import("@/components/NeighborhoodMap"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "#E5EBEE" }} />,
});

const INK = "#0F1A1C";
const MUTED = "#576F76";
const ORANGE = "#FB4402";

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

function CategoryIcon({ item, size = 24 }: { item: Item; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={CATEGORY_IMAGES[item.category]}
      alt=""
      style={{ width: size, height: size, borderRadius: 999, objectFit: "cover", flex: "none" }}
    />
  );
}

function VerifiedBadge() {
  return (
    <span
      aria-label="Trusted neighbor"
      title="Trusted neighbor"
      className="flex flex-none items-center justify-center"
      style={{ width: 14, height: 14, borderRadius: 999, background: ORANGE }}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 7" />
      </svg>
    </span>
  );
}

function ItemCard({
  item,
  saved,
  isNew,
  onToggleSave,
  width,
}: {
  item: Item;
  saved: boolean;
  isNew: boolean;
  onToggleSave: (id: string) => void;
  width?: number;
}) {
  return (
    <Link
      href={`/item/${item.id}`}
      className="block"
      style={width ? { width, flex: "none" } : undefined}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "1 / 1", borderRadius: 16, background: INK }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image ?? CATEGORY_IMAGES[item.category]}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleSave(item.id);
          }}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save"}
          className="absolute flex cursor-pointer items-center justify-center border-none"
          style={{ top: 8, right: 8, width: 30, height: 30, borderRadius: 999, background: "#ffffff" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? ORANGE : "none"} stroke={saved ? ORANGE : INK} strokeWidth="2">
            <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.2C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.3 12 21 12 21Z" />
          </svg>
        </button>
      </div>

      <div style={{ padding: "10px 4px 0" }}>
        {(isNew || item.sellerScore >= 100) && (
          <div style={{ fontSize: 11, fontWeight: 800, color: isNew ? ORANGE : INK, letterSpacing: "0.03em", marginBottom: 3 }}>
            {isNew ? "NEW" : "NEIGHBOR FAVORITE"}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-start" style={{ gap: 2 }}>
          <div
            className="min-w-0 flex-1"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 39,
            }}
          >
            {item.title}
          </div>
          <div className="flex flex-none items-center sm:ml-2" style={{ gap: 3, marginTop: 1 }}>
            <span style={{ color: "#E8A200", fontSize: 13 }}>★</span>
            <span style={{ fontWeight: 600, fontSize: 13, color: INK }}>{(item.sellerScore / 20).toFixed(1)}</span>
            {item.sellerScore >= 95 && <VerifiedBadge />}
          </div>
        </div>
        <div className="flex flex-wrap items-center truncate" style={{ gap: 4, fontSize: 12, color: MUTED, marginTop: 4 }}>
          <span style={{ color: ORANGE, fontWeight: 800 }}>Free</span>
          <span>· {categoryLabel(item.category)} · {item.distanceMin} min walk · Qty {item.quantity}</span>
        </div>
      </div>
    </Link>
  );
}

function ScrollArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className="absolute flex cursor-pointer items-center justify-center border-none"
      style={{
        top: "38%",
        [direction === "left" ? "left" : "right"]: -16,
        width: 34,
        height: 34,
        borderRadius: 999,
        background: "#ffffff",
        color: INK,
        boxShadow: "0 2px 8px rgba(15,26,28,0.18)",
        zIndex: 2,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {direction === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

function ItemRow({
  title,
  items,
  savedIds,
  onToggleSave,
  now,
}: {
  title: string;
  items: Item[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  now: number | null;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -600 : 600, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative" style={{ marginBottom: 28 }}>
      <div className="flex items-center justify-between" style={{ padding: "0 4px 12px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: INK, margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
      </div>
      <div className="group relative">
        <div ref={scrollerRef} className="flex overflow-x-auto scroll-smooth" style={{ gap: 16, padding: "0 4px 4px", scrollbarWidth: "none" }}>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              saved={savedIds.includes(item.id)}
              isNew={now !== null && now - item.createdAt <= 15 * 60 * 1000}
              onToggleSave={onToggleSave}
              width={220}
            />
          ))}
        </div>
        {items.length > 3 && (
          <>
            <ScrollArrow direction="left" onClick={() => scroll("left")} />
            <ScrollArrow direction="right" onClick={() => scroll("right")} />
          </>
        )}
      </div>
    </div>
  );
}

const PILL: React.CSSProperties = {
  height: 32,
  borderRadius: 999,
  padding: "0 12px",
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
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
  const [layout, setLayout] = useState<"grid" | "list">("grid");

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

  const recent = useMemo(() => [...available].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4), [available]);

  const filtersActive = maxDistance !== null || minRating !== null || query.trim() !== "";
  const showSections = layout === "grid" && !filtersActive && !urlCategory;

  const sections = useMemo(() => {
    if (!showSections) return [];
    const byDistance = [...available].sort((a, b) => a.distanceMin - b.distanceMin);
    const rows: { title: string; items: Item[] }[] = [{ title: `Nearby in ${NEIGHBORHOOD}`, items: byDistance.slice(0, 10) }];
    if (recent.length > 0) {
      rows.push({ title: "New today", items: [...available].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10) });
    }
    CATEGORIES.filter((c) => c.id !== "all").forEach((cat) => {
      const inCat = byDistance.filter((it) => it.category === cat.id);
      if (inCat.length > 0) rows.push({ title: cat.label, items: inCat.slice(0, 10) });
    });
    return rows;
  }, [showSections, available, recent.length]);

  const handleToggleSave = (itemId: string) => {
    if (!currentUser) {
      router.push(`/auth?next=/`);
      return;
    }
    toggleSave(itemId);
  };

  return (
    <div className="min-h-dvh bg-white" style={{ color: INK }}>
      <SiteHeader query={query} onQueryChange={setQuery} />

      <div className="flex">
        <SideNav activeCategory={urlCategory} counts={categoryCounts} />

        <main className="flex min-w-0 flex-1 justify-center" style={{ gap: 24, padding: "0 16px" }}>
          <div className="min-w-0 flex-1" style={{ maxWidth: 756, paddingTop: 12, paddingBottom: 40 }}>
            {urlCategory && (
              <div className="flex items-center" style={{ gap: 14, padding: "12px 16px 16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CATEGORY_IMAGES[urlCategory as Item["category"]]}
                  alt=""
                  style={{ width: 56, height: 56, borderRadius: 999, objectFit: "cover", border: "3px solid #ffffff", boxShadow: "0 0 0 1px #E5EBEE" }}
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

            <div className="flex overflow-x-auto" style={{ gap: 22, padding: "6px 16px 0", borderBottom: "1px solid #E5EBEE" }}>
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
              <div className="flex items-center" style={{ gap: 2 }}>
                {(["grid", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLayout(mode)}
                    aria-label={mode === "grid" ? "Grid view" : "List view"}
                    aria-pressed={layout === mode}
                    className="rd-ghost flex cursor-pointer items-center justify-center border-none"
                    style={{ width: 32, height: 32, borderRadius: 999, color: layout === mode ? INK : MUTED, background: layout === mode ? "#E5EBEE" : undefined }}
                  >
                    {mode === "grid" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2" y="2" width="8" height="8" />
                        <rect x="14" y="2" width="8" height="8" />
                        <rect x="2" y="14" width="8" height="8" />
                        <rect x="14" y="14" width="8" height="8" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="ml-auto" style={{ fontSize: 12, color: MUTED, paddingRight: 8 }}>
                {visible.length} {visible.length === 1 ? "listing" : "listings"} · {NEIGHBORHOOD}
              </div>
            </div>

            <div style={{ height: 1, background: "#E5EBEE" }} />

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: "20px 16px", padding: "16px 8px 0" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ padding: 6 }}>
                    <div style={{ aspectRatio: "1 / 1", borderRadius: 20, background: "#F0F3F4" }} />
                    <div style={{ height: 14, borderRadius: 6, background: "#F0F3F4", marginTop: 12, width: "85%" }} />
                    <div style={{ height: 12, borderRadius: 6, background: "#F0F3F4", marginTop: 8, width: "55%" }} />
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
            ) : showSections ? (
              <div style={{ padding: "16px 8px 0" }}>
                {sections.map((s) => (
                  <ItemRow key={s.title} title={s.title} items={s.items} savedIds={savedIds} onToggleSave={handleToggleSave} now={now} />
                ))}
              </div>
            ) : layout === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: "20px 16px", padding: "16px 8px 0" }}>
                {visible.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    saved={savedIds.includes(item.id)}
                    isNew={now !== null && now - item.createdAt <= 15 * 60 * 1000}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div style={{ padding: "8px 8px 0" }}>
                {visible.map((item) => {
                  const saved = savedIds.includes(item.id);
                  return (
                    <div key={item.id}>
                      <Link
                        href={`/item/${item.id}`}
                        className="rd-post flex items-center"
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{ borderRadius: 16, padding: "10px 8px", gap: 14 }}
                      >
                        <div className="relative flex-none overflow-hidden" style={{ width: 92, height: 92, borderRadius: 14 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image ?? CATEGORY_IMAGES[item.category]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: INK,
                              lineHeight: 1.3,
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.title}
                          </div>
                          <div className="flex items-center" style={{ gap: 4, marginTop: 4, fontSize: 12, color: MUTED }}>
                            <span style={{ color: "#E8A200" }}>★</span>
                            <span style={{ fontWeight: 600, color: INK }}>{(item.sellerScore / 20).toFixed(1)}</span>
                            {item.sellerScore >= 95 && <VerifiedBadge />}
                            <span>· {item.distanceMin} min walk · {categoryLabel(item.category)}</span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: ORANGE, marginTop: 4 }}>Free</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleSave(item.id);
                          }}
                          aria-pressed={saved}
                          aria-label={saved ? "Remove from saved" : "Save"}
                          className="flex flex-none cursor-pointer items-center justify-center border-none"
                          style={{ width: 34, height: 34, borderRadius: 999, background: "#F6F8F9" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? ORANGE : "none"} stroke={saved ? ORANGE : INK} strokeWidth="2">
                            <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.2C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.3 12 21 12 21Z" />
                          </svg>
                        </button>
                      </Link>
                      <div style={{ height: 1, background: "#E5EBEE", margin: "0 8px" }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="hidden flex-none xl:block" style={{ width: 316, paddingTop: 16 }}>
            <div style={{ position: "sticky", top: 72 }}>
              <div className="rd-panel" style={{ background: "#F6F8F9", borderRadius: 16, padding: 16 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 12, letterSpacing: "0.08em", color: MUTED, textTransform: "uppercase" }}>Nearby</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${CENTER[0]},${CENTER[1]}&travelmode=walking`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center"
                    style={{ gap: 5, fontSize: 12, fontWeight: 700, color: ORANGE }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
                    </svg>
                    Get directions
                  </a>
                </div>
                <div className="relative overflow-hidden" style={{ height: 240, borderRadius: 12 }}>
                  <NeighborhoodMap items={visible} highlightedId={hoveredId} onHover={setHoveredId} countLabel={`${visible.length} nearby`} />
                </div>
              </div>

              {recent.length > 0 && (
              <div className="rd-panel" style={{ background: "#F6F8F9", borderRadius: 16, padding: 16, marginTop: 16 }}>
                <div style={{ fontSize: 12, letterSpacing: "0.08em", color: MUTED, textTransform: "uppercase", marginBottom: 6 }}>
                  Recently posted
                </div>
                {recent.map((item, i) => (
                  <Link
                    key={item.id}
                    href={`/item/${item.id}`}
                    className="flex items-start"
                    style={{ gap: 12, padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid #E5EBEE" }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center" style={{ gap: 6, fontSize: 12, color: MUTED }}>
                        <CategoryIcon item={item} size={20} />
                        <span style={{ fontWeight: 600, color: INK }}>{categoryLabel(item.category)}</span>
                        {now !== null && <span>• {timeAgo(item.createdAt, now)}</span>}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: MUTED,
                          marginTop: 4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                        Free · Qty {item.quantity} · {item.distanceMin} min walk
                      </div>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image ?? CATEGORY_IMAGES[item.category]}
                      alt=""
                      style={{ width: 72, height: 72, borderRadius: 8, objectFit: "cover", flex: "none" }}
                    />
                  </Link>
                ))}
              </div>
              )}

            </div>
          </aside>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
