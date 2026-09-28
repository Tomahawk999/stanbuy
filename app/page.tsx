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
const YELLOW = "#FFC244";

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

function GlovoItemCard({
  item,
  saved,
  onToggleSave,
  now,
  onHover,
}: {
  item: Item;
  saved: boolean;
  onToggleSave: (id: string) => void;
  now: number | null;
  onHover: (id: string | null) => void;
}) {
  const age = now !== null ? timeAgo(item.createdAt, now) : null;
  return (
    <Link
      href={`/item/${item.id}`}
      className="stan-glovo-card flex flex-col"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative" style={{ aspectRatio: "4 / 3" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image ?? CATEGORY_IMAGES[item.category]} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <span
          className="stan-yellow-badge absolute flex items-center"
          style={{ left: 10, top: 10, height: 24, borderRadius: 999, padding: "0 10px", fontSize: 11 }}
        >
          Free
        </span>
        <button
          type="button"
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            onToggleSave(item.id);
          }}
          className="absolute flex cursor-pointer items-center justify-center border-none"
          style={{ right: 8, top: 8, width: 32, height: 32, borderRadius: 999, background: "rgba(255,255,255,0.92)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? INK : "none"} stroke={INK} strokeWidth="1.8">
            <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.2C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.3 12 21 12 21Z" />
          </svg>
        </button>
        <span
          className="absolute flex items-center"
          style={{ left: 10, bottom: 10, height: 22, borderRadius: 999, padding: "0 9px", background: "rgba(11,11,12,0.75)", color: "#fff", fontSize: 11, fontWeight: 700, gap: 4 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
          {item.distanceMin} min
        </span>
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <div className="flex items-start justify-between" style={{ gap: 8 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: INK,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.title}
          </span>
        </div>
        <div className="flex flex-wrap items-center" style={{ gap: 5, marginTop: 6, fontSize: 12, color: MUTED }}>
          <span className="flex items-center" style={{ gap: 3 }}>
            <span style={{ color: YELLOW }}>★</span>
            <span style={{ fontWeight: 700, color: INK }}>{(item.sellerScore / 20).toFixed(1)}</span>
          </span>
          <span>· {categoryLabel(item.category)}</span>
          <span>· Qty {item.quantity}</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: MUTED }}>
          {item.seller} · {item.neighborhood}
          {age && ` · ${age}`}
        </div>
      </div>
    </Link>
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
  const [view, setView] = useState<"list" | "map">("list");

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
    <div className="min-h-dvh bg-white" style={{ color: INK }}>
      <SiteHeader query={query} onQueryChange={setQuery} />

      <div style={{ padding: "16px 16px 0", maxWidth: 1280, margin: "0 auto" }}>
        {urlCategory && (
          <div className="flex items-center" style={{ gap: 14, marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CATEGORY_IMAGES[urlCategory as Item["category"]]}
              alt=""
              style={{ width: 52, height: 52, borderRadius: 999, objectFit: "cover", border: "3px solid #ffffff", boxShadow: "0 0 0 1px #E5E5E6" }}
            />
            <div className="min-w-0 flex-1">
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>{categoryLabel(urlCategory)}</h1>
              <div style={{ fontSize: 13, color: MUTED }}>
                {categoryCounts[urlCategory] ?? 0} available near {NEIGHBORHOOD}
              </div>
            </div>
            <Link href="/" className="stan-chip flex items-center" style={{ ...PILL, height: 36, fontSize: 13 }}>
              All categories
            </Link>
          </div>
        )}

        <div className="flex overflow-x-auto" style={{ gap: 10, paddingBottom: 4 }}>
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const active = urlCategory === cat.id;
            return (
              <Link
                key={cat.id}
                href={active ? "/" : `/?category=${cat.id}`}
                className="stan-chip flex flex-none items-center"
                data-active={active}
                style={{ gap: 8, height: 40, padding: "0 14px 0 8px", fontSize: 13, fontWeight: 700 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CATEGORY_IMAGES[cat.id as Item["category"]]}
                  alt=""
                  style={{ width: 26, height: 26, borderRadius: 999, objectFit: "cover", flex: "none" }}
                />
                {cat.label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center" style={{ gap: 10, padding: "14px 0" }}>
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
          <div className="ml-auto flex items-center" style={{ gap: 10 }}>
            <span style={{ fontSize: 12, color: MUTED }}>
              {visible.length} {visible.length === 1 ? "listing" : "listings"} · {NEIGHBORHOOD}
            </span>
            <div className="flex" style={{ gap: 4, background: "#F5F5F6", borderRadius: 999, padding: 3 }}>
              <button
                type="button"
                onClick={() => setView("list")}
                className="stan-chip cursor-pointer"
                data-active={view === "list"}
                style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 700, border: "none" }}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className="stan-chip cursor-pointer"
                data-active={view === "map"}
                style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 700, border: "none" }}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === "map" ? (
        <div className="relative" style={{ height: "calc(100dvh - 200px)", margin: "0 16px 16px", borderRadius: 20, overflow: "hidden" }}>
          <NeighborhoodMap items={visible} highlightedId={hoveredId} onHover={setHoveredId} />
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
        </div>
      ) : (
        <div style={{ padding: "4px 16px 40px", maxWidth: 1280, margin: "0 auto" }}>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: 16 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #E5E5E6" }}>
                  <div style={{ aspectRatio: "4 / 3", background: "#F0F0F1" }} />
                  <div style={{ padding: 14 }}>
                    <div style={{ height: 14, borderRadius: 6, background: "#F0F0F1", marginBottom: 8 }} />
                    <div style={{ height: 12, width: "60%", borderRadius: 6, background: "#F0F0F1" }} />
                  </div>
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
                  className="stan-chip mt-4 inline-flex items-center"
                  style={{ ...PILL, height: 40, fontSize: 14, padding: "0 18px" }}
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-center" style={{ padding: "40px 16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/empty-listings.png" alt={`No listings near ${NEIGHBORHOOD} yet`} style={{ width: 260, height: "auto" }} />
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: 16 }}>
              {visible.map((item) => (
                <GlovoItemCard
                  key={item.id}
                  item={item}
                  saved={savedIds.includes(item.id)}
                  onToggleSave={handleToggleSave}
                  now={now}
                  onHover={setHoveredId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
