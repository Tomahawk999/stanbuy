"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useStanStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_IMAGES } from "@/lib/data";
import { Item } from "@/lib/types";
import { useNow } from "@/lib/useNow";
import PageShell from "@/components/PageShell";
import StarRating from "@/components/StarRating";

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

function QA({ q, a, first }: { q: string; a: string; first?: boolean }) {
  return (
    <details className="rd-nav-item" style={{ padding: "14px 16px", borderTop: first ? "none" : "1px solid #E5EBEE" }}>
      <summary
        className="flex cursor-pointer items-center justify-between"
        style={{ listStyle: "none", fontSize: 14, fontWeight: 600, color: INK, gap: 12 }}
      >
        {q}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" style={{ flex: "none" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <p style={{ margin: "8px 0 0", fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{a}</p>
    </details>
  );
}

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  // Remounts the whole view (and resets its state cleanly) whenever the
  // route's id changes, instead of manually resetting state in an effect.
  return <ItemDetailView key={params.id} id={params.id} />;
}

function ItemDetailView({ id }: { id: string }) {
  const router = useRouter();
  const reservations = useStanStore((s) => s.reservations);
  const reserveItem = useStanStore((s) => s.reserveItem);
  const confirmPickup = useStanStore((s) => s.confirmPickup);
  const freezeUntil = useStanStore((s) => s.freezeUntil);
  const savedIds = useStanStore((s) => s.savedIds);
  const toggleSave = useStanStore((s) => s.toggleSave);
  const currentUser = useStanStore((s) => s.currentUser);
  const [item, setItem] = useState<Item | null | undefined>(undefined);
  const [sellerListingCount, setSellerListingCount] = useState(0);
  const [moreNearby, setMoreNearby] = useState<Item[]>([]);
  const now = useNow();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/items/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setItem(data.item);
        setSellerListingCount(data.sellerListingCount);
        setMoreNearby(data.moreNearby);
      })
      .catch(() => {
        if (!cancelled) setItem(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (item === undefined) {
    return (
      <PageShell>
        <div style={{ padding: "80px 0", textAlign: "center", fontSize: 14, color: MUTED }}>Loading…</div>
      </PageShell>
    );
  }

  if (!item) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center gap-3 px-8 text-center" style={{ padding: "80px 0" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Listing not found</div>
          <Link href="/" style={{ color: ORANGE, fontWeight: 600, fontSize: 14 }}>
            Back to home
          </Link>
        </div>
      </PageShell>
    );
  }

  const reservation = [...reservations].reverse().find((r) => r.itemId === item.id && r.status === "active");
  const lastReservation = [...reservations].reverse().find((r) => r.itemId === item.id && r.status === "picked_up");

  const categoryLabel = CATEGORIES.find((c) => c.id === item.category)?.label ?? "Other";

  const showIdle = item.status === "available";
  const showReserved = item.status === "reserved" && !!reservation;
  const showDone = item.status === "claimed" && !!lastReservation;
  const isFrozen = !!freezeUntil && now !== null && freezeUntil > now;
  const saved = savedIds.includes(item.id);

  const handleReserve = async () => {
    if (!currentUser) {
      router.push(`/auth?next=/item/${item.id}`);
      return;
    }
    const result = await reserveItem(item.id);
    if (result.ok) {
      setItem((cur) => (cur ? { ...cur, status: "reserved" } : cur));
    } else if (result.reason === "frozen") {
      alert("Your Reliability Score is too low right now — you can't reserve until the freeze lifts.");
    } else if (result.reason === "own-item") {
      alert("You can't reserve your own listing.");
    } else if (result.reason === "unavailable") {
      alert("This listing is no longer available.");
      setItem((cur) => (cur ? { ...cur, status: "reserved" } : cur));
    }
  };

  const handleToggleSave = async () => {
    if (!currentUser) {
      router.push(`/auth?next=/item/${item.id}`);
      return;
    }
    await toggleSave(item.id);
  };

  const handleConfirmPickup = async () => {
    if (!reservation) return;
    await confirmPickup(reservation.id);
    setItem((cur) => (cur ? { ...cur, status: "claimed" } : cur));
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = { title: item.title, text: `${item.title} — free on Stanbuy`, url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <PageShell maxWidth={980} activeCategory={item.category}>
      <div className="flex flex-col lg:flex-row" style={{ gap: 28, paddingBottom: 40 }}>
        <div className="min-w-0 flex-1">
          {item.sellerScore >= 100 && (
            <div style={{ fontSize: 12, fontWeight: 700, color: INK, marginBottom: 6 }}>Neighbor favorite</div>
          )}
          <h1 style={{ fontSize: 24, fontWeight: 700, color: INK, margin: "0 0 8px", lineHeight: 1.3 }}>
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center" style={{ gap: 6, fontSize: 13, color: INK, marginBottom: 10 }}>
            <span className="flex items-center" style={{ gap: 4 }}>
              <span style={{ color: "#E8A200" }}>★</span>
              <span style={{ fontWeight: 600 }}>{(item.sellerScore / 20).toFixed(1)}</span>
            </span>
            <span style={{ color: MUTED }}>·</span>
            <Link href={`/?category=${item.category}`} style={{ fontWeight: 600, color: INK, textDecoration: "underline" }}>
              {categoryLabel}
            </Link>
            <span style={{ color: MUTED }}>·</span>
            <span style={{ color: MUTED }}>{item.neighborhood}</span>
            {now !== null && (
              <>
                <span style={{ color: MUTED }}>·</span>
                <span style={{ color: MUTED }}>Posted {timeAgo(item.createdAt, now)}</span>
              </>
            )}
          </div>

          <div
            className="relative overflow-hidden"
            style={{ height: 420, borderRadius: 16, background: "#0F1A1C" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image ?? CATEGORY_IMAGES[item.category]}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "blur(28px) brightness(0.7)", transform: "scale(1.2)" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image ?? CATEGORY_IMAGES[item.category]}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: INK, margin: "16px 0 0" }}>{item.description}</p>

          <div style={{ height: 1, background: "#E5EBEE", margin: "24px 0" }} />

          <h2 style={{ fontSize: 20, fontWeight: 800, color: INK, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
            Good to know
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px 24px" }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.6" className="flex-none"><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" /><circle cx="12" cy="13.5" r="3.3" /></svg>
              <span style={{ fontSize: 14, color: INK }}>Quantity: {item.quantity}</span>
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.6" className="flex-none"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.3" /></svg>
              <span style={{ fontSize: 14, color: INK }}>{item.distanceMin} min walk · {item.neighborhood}</span>
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.6" className="flex-none"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
              <span style={{ fontSize: 14, color: INK }}>Pickup window: 1 hour</span>
            </div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.6" className="flex-none"><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 3.5v3M16 3.5v3M3.5 10h17" /></svg>
              <span style={{ fontSize: 14, color: INK }}>{sellerListingCount} listings from {item.seller}</span>
            </div>
          </div>

          <div style={{ height: 1, background: "#E5EBEE", margin: "24px 0" }} />

          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: INK, margin: 0, letterSpacing: "-0.01em" }}>
                Where you&apos;ll pick it up
              </h2>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}&travelmode=walking`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
                style={{ gap: 6, fontSize: 13, fontWeight: 700, color: ORANGE }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 11 18-8-8 18-2-8-8-2Z" />
                </svg>
                Get directions
              </a>
            </div>
            <div style={{ height: 240, borderRadius: 16, overflow: "hidden" }}>
              <NeighborhoodMap items={[item]} />
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
              Exact pickup address is shared once you reserve. The map shows the approximate area in{" "}
              {item.neighborhood} only.
            </p>
          </div>

          <div style={{ height: 1, background: "#E5EBEE", margin: "24px 0" }} />

          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: INK, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
              Questions about this listing
            </h2>
            <div className="rd-panel flex flex-col" style={{ borderRadius: 16, background: "#ffffff", border: "1px solid #E5EBEE" }}>
              <QA
                first
                q="How do reservations work?"
                a={`Reserving locks this item for 1 hour. Show the pickup code to ${item.seller.split(" ")[0]} when you collect it. If you don't scan in time, your Reliability Score drops 15% — fall below 80% and you can't reserve for 7 days.`}
              />
              <QA
                q="Is this really free?"
                a="Yes — the food itself is always free on Stanbuy. During the launch pilot, pickups are $0.00. Afterwards, a $0.99 fee per pickup covers handoff and platform logistics only, never the food."
              />
              <QA
                q="What if I can't make it in time?"
                a="The listing releases automatically back to the neighborhood after 1 hour so another neighbor can claim it. Your Reliability Score drops 15% for the miss."
              />
            </div>
          </div>
        </div>

        <div className="hidden flex-none lg:block lg:w-[320px]">
          <div className="rd-panel" style={{ position: "sticky", top: 72, background: "#ffffff", border: "1px solid #E5EBEE", borderRadius: 16, padding: 20 }}>
            <div className="flex items-baseline" style={{ gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: ORANGE }}>Free</span>
              <span style={{ fontSize: 14, color: MUTED, textDecoration: "line-through" }}>$0.99</span>
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>
              Free during the launch pilot. Afterwards, $0.99 per pickup to cover handoff logistics.
            </div>

            <div style={{ marginTop: 16, fontSize: 15, fontWeight: 700, color: showIdle ? "#1A7A3C" : MUTED }}>
              {showIdle ? "Available now" : showReserved ? "Reserved by you" : "No longer available"}
            </div>

            <div className="flex flex-col" style={{ gap: 8, marginTop: 10 }}>
              {showIdle && (
                <button
                  type="button"
                  onClick={handleReserve}
                  disabled={isFrozen}
                  className="w-full cursor-pointer border-none"
                  style={{
                    background: isFrozen ? "#E5EBEE" : ORANGE,
                    color: isFrozen ? MUTED : "#ffffff",
                    borderRadius: 12,
                    padding: 13,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {isFrozen ? "Reserving is paused — score too low" : "Reserve"}
                </button>
              )}

              <div className="flex" style={{ gap: 8 }}>
                <button
                  type="button"
                  onClick={handleToggleSave}
                  aria-pressed={saved}
                  className="rd-pill flex flex-1 cursor-pointer items-center justify-center"
                  style={{ height: 40, borderRadius: 12, background: "#ffffff", color: INK, fontSize: 14, fontWeight: 600, gap: 6, border: "1px solid #E5EBEE" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? ORANGE : "none"} stroke={saved ? ORANGE : "currentColor"} strokeWidth="2">
                    <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.2C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.3 12 21 12 21Z" />
                  </svg>
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rd-pill flex flex-1 cursor-pointer items-center justify-center"
                  style={{ height: 40, borderRadius: 12, background: "#ffffff", color: INK, fontSize: 14, fontWeight: 600, gap: 6, border: "1px solid #E5EBEE" }}
                >
                  {copied ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A7A3C" strokeWidth="2.2"><path d="M5 13l4 4L19 7" /></svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" />
                      </svg>
                      Share
                    </>
                  )}
                </button>
              </div>

              {showReserved && reservation && (
                <div style={{ background: "#ffffff", borderRadius: 12, padding: 18, marginTop: 4 }}>
                  <div className="mb-[10px] flex justify-center">
                    <div style={{ background: "#ffffff", borderRadius: 8, padding: 8, border: "1px solid #E5EBEE" }}>
                      <QRCodeSVG value={reservation.code} size={104} fgColor={INK} bgColor="#ffffff" />
                    </div>
                  </div>
                  <div className="mb-[10px] text-center" style={{ fontSize: 12, color: MUTED }}>
                    Code <b style={{ color: INK, letterSpacing: "0.05em" }}>{reservation.code}</b>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmPickup}
                    className="w-full cursor-pointer border-none"
                    style={{ background: ORANGE, color: "#ffffff", borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 700 }}
                  >
                    I&apos;ve picked it up
                  </button>
                </div>
              )}

              {showDone && (
                <div style={{ background: "#ffffff", borderRadius: 12, padding: "10px 14px", marginTop: 4, borderLeft: `3px solid ${ORANGE}` }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>Picked up</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Your Reliability Score is safe.</div>
                </div>
              )}

              {item.status === "reserved" && !reservation && (
                <div className="text-center" style={{ fontSize: 14, color: MUTED, padding: "6px 0" }}>
                  Reserved by another neighbor right now.
                </div>
              )}
            </div>

            <div style={{ height: 1, background: "#E5EBEE", margin: "16px 0" }} />

            <div className="flex flex-col" style={{ gap: 10, fontSize: 13 }}>
              <div className="flex items-center justify-between">
                <span style={{ color: MUTED }}>Category</span>
                <span style={{ fontWeight: 600, color: INK }}>{categoryLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: MUTED }}>Quantity</span>
                <span style={{ fontWeight: 600, color: INK }}>{item.quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: MUTED }}>Location</span>
                <span style={{ fontWeight: 600, color: INK }}>{item.neighborhood}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: MUTED }}>Seller</span>
                <span style={{ fontWeight: 600, color: ORANGE }}>{item.seller}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: MUTED }}>Reliability</span>
                <StarRating score={item.sellerScore} size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {moreNearby.length > 0 && (
        <div style={{ borderTop: "1px solid #E5EBEE", paddingTop: 28, paddingBottom: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: INK, marginBottom: 16, letterSpacing: "-0.01em" }}>
            More listings nearby
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 16 }}>
            {moreNearby.map((other) => (
              <Link key={other.id} href={`/item/${other.id}`} className="block" style={{ borderRadius: 18, padding: 4 }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: "1 / 1", borderRadius: 16, background: INK }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={other.image ?? CATEGORY_IMAGES[other.category]}
                    alt={other.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    className="absolute flex items-center"
                    style={{ left: 8, bottom: 8, height: 22, borderRadius: 999, padding: "0 9px", background: "#ffffff", fontSize: 10, fontWeight: 800, color: ORANGE }}
                  >
                    Free
                  </span>
                </div>
                <div style={{ padding: "8px 2px 0" }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: INK,
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {other.title}
                  </div>
                  <div className="flex items-center" style={{ gap: 4, marginTop: 4, fontSize: 12, color: MUTED }}>
                    <span style={{ color: "#E8A200" }}>★</span>
                    <span style={{ fontWeight: 600, color: INK }}>{(other.sellerScore / 20).toFixed(1)}</span>
                    <span>· {other.distanceMin} min walk</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
