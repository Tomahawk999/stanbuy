"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStanStore } from "@/lib/store";
import { Category } from "@/lib/types";
import PageShell from "@/components/PageShell";
import { CATEGORIES, CATEGORY_IMAGES } from "@/lib/data";

const INK = "#0B0B0C";
const MUTED = "#63666A";
const ORANGE = "#0B0B0C";

function CategoryPicker({ value, onChange }: { value: Category; onChange: (v: Category) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = CATEGORIES.filter((c) => c.id !== "all") as { id: Category; label: string }[];
  const current = options.find((o) => o.id === value) ?? options[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="rd-ghost flex cursor-pointer items-center border-none"
        style={{ gap: 8, padding: "6px 10px 6px 6px", borderRadius: 999, background: "#F5F5F6" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CATEGORY_IMAGES[current.id]} alt="" style={{ width: 26, height: 26, borderRadius: 999, objectFit: "cover", flex: "none" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{current.label}</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2.4" strokeLinecap="round" style={{ transform: open ? "rotate(180deg)" : undefined, flex: "none" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute flex flex-col"
          style={{ top: "calc(100% + 8px)", left: 0, minWidth: 220, zIndex: 30, background: "#ffffff", borderRadius: 14, padding: 6, boxShadow: "0 8px 24px rgba(15,26,28,0.16)", border: "1px solid #E5E5E6" }}
        >
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className="rd-nav-item flex w-full cursor-pointer items-center border-none bg-transparent text-left"
              style={{ height: 44, borderRadius: 10, padding: "0 10px", gap: 10, fontSize: 14, fontWeight: o.id === value ? 700 : 500, color: o.id === value ? ORANGE : INK }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CATEGORY_IMAGES[o.id]} alt="" style={{ width: 24, height: 24, borderRadius: 999, objectFit: "cover", flex: "none" }} />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const BTN: React.CSSProperties = {
    width: 26,
    height: 26,
    borderRadius: 999,
    border: "1px solid #E5E5E6",
    background: "#ffffff",
    color: INK,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
    flex: "none",
  };
  return (
    <div className="flex items-center" style={{ gap: 10, padding: "6px 10px 6px 6px", borderRadius: 999, background: "#F5F5F6" }}>
      <button type="button" aria-label="Decrease quantity" style={BTN} onClick={() => onChange(Math.max(1, value - 1))}>
        −
      </button>
      <span style={{ fontSize: 13, fontWeight: 700, color: INK, minWidth: 14, textAlign: "center" }}>{value}</span>
      <button type="button" aria-label="Increase quantity" style={BTN} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

export default function SellPage() {
  const publishItem = useStanStore((s) => s.publishItem);
  const currentUser = useStanStore((s) => s.currentUser);
  const loading = useStanStore((s) => s.loading);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("bakery");
  const [quantity, setQuantity] = useState(1);
  const [neighborhood, setNeighborhood] = useState("");
  const [published, setPublished] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !currentUser) router.replace("/auth?next=/sell");
  }, [loading, currentUser, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError("Image is too large — please pick one under 8 MB.");
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canPublish = title.trim().length > 0 && neighborhood.trim().length > 0 && !publishing;

  const publish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    setPublishError(null);
    const result = await publishItem({
      title: title.trim(),
      description: description.trim() || "No description provided.",
      category,
      neighborhood: neighborhood.trim(),
      quantity: Math.max(1, quantity),
      image: photo ?? undefined,
    });
    setPublishing(false);
    if (!result.ok) {
      setPublishError(result.error ?? "Could not publish your listing. Try again.");
      return;
    }
    setPublishedId(result.id ?? null);
    setPublished(true);
  };

  if (!currentUser) {
    return (
      <PageShell>
        <div style={{ padding: "80px 0", textAlign: "center", fontSize: 14, color: MUTED }}>
          {loading ? "Loading…" : "Redirecting to sign in…"}
        </div>
      </PageShell>
    );
  }

  if (published) {
    return (
      <PageShell>
        <div className="mx-auto flex flex-col items-center text-center" style={{ maxWidth: 520, padding: "100px 20px 60px" }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: INK, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            You&apos;re posted.
          </h1>
          <p style={{ fontSize: 16, color: MUTED, margin: "12px 0 0", lineHeight: 1.5 }}>
            Neighbors nearby can see it in their feed right now — first come, first served.
          </p>
          <div className="flex" style={{ gap: 10, marginTop: 28 }}>
            <button
              type="button"
              onClick={() => {
                setPublished(false);
                setPublishedId(null);
                setTitle("");
                setDescription("");
                setNeighborhood("");
                setPhoto(null);
                setQuantity(1);
              }}
              className="cursor-pointer border-none"
              style={{ background: "#F5F5F6", color: INK, borderRadius: 8, padding: "13px 24px", fontSize: 15, fontWeight: 700 }}
            >
              Post another
            </button>
            <Link
              href={publishedId ? `/item/${publishedId}` : "/"}
              className="inline-block"
              style={{ background: ORANGE, color: "#ffffff", border: "none", borderRadius: 8, padding: "13px 28px", fontSize: 15, fontWeight: 700 }}
            >
              See it live
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth={640}>
      <div className="flex items-center justify-between" style={{ padding: "0 8px 16px" }}>
        <div className="flex items-center" style={{ gap: 12 }}>
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Cancel"
            className="rd-ghost flex cursor-pointer items-center justify-center border-none"
            style={{ width: 36, height: 36, borderRadius: 999, color: INK, flex: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: INK, margin: 0 }}>New post</h1>
        </div>
        <button
          type="button"
          onClick={publish}
          disabled={!canPublish}
          className="cursor-pointer border-none"
          style={{
            background: canPublish ? ORANGE : "#E5E5E6",
            color: canPublish ? "#ffffff" : MUTED,
            borderRadius: 8,
            padding: "9px 22px",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {publishing ? "Posting…" : "Post"}
        </button>
      </div>

      {publishError && (
        <div style={{ margin: "0 8px 14px", fontSize: 13, fontWeight: 600, color: "#C4351E" }}>{publishError}</div>
      )}

      <div style={{ margin: "0 8px 8px" }}>
        <div style={{ padding: "14px 16px" }}>
          <CategoryPicker value={category} onChange={setCategory} />
        </div>
        <div style={{ height: 1, background: "#F0F0F1" }} />

        <div style={{ padding: "14px 16px 4px" }}>
          <input
            id="sell-title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="box-border w-full border-none bg-transparent outline-none"
            style={{ fontSize: 22, fontWeight: 700, color: INK, padding: "6px 0" }}
          />
        </div>

        <div style={{ padding: "0 16px 14px" }}>
          <textarea
            id="sell-desc"
            placeholder="Tell neighbors more — why it's left over, condition, anything they should know"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="box-border w-full resize-none border-none bg-transparent outline-none"
            style={{ fontSize: 15, color: INK, lineHeight: 1.5, minHeight: 60 }}
          />
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        {photo ? (
          <div className="relative" style={{ margin: "0 16px 16px", borderRadius: 14, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" style={{ width: "100%", maxHeight: 360, objectFit: "cover", display: "block" }} />
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              aria-label="Remove photo"
              className="absolute flex cursor-pointer items-center justify-center border-none"
              style={{ top: 10, right: 10, width: 32, height: 32, borderRadius: 999, background: "rgba(15,26,28,0.55)", color: "#ffffff" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full cursor-pointer items-center justify-center border-none"
            style={{ margin: "0 16px 16px", width: "calc(100% - 32px)", height: 96, borderRadius: 14, border: "2px dashed #CBCBCD", background: "#F5F5F6", gap: 8, color: INK, fontSize: 14, fontWeight: 700 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" />
              <circle cx="12" cy="13.5" r="3.3" />
            </svg>
            Add a photo
          </button>
        )}
        {photoError && <div style={{ margin: "0 16px 14px", fontSize: 13, color: "#C4351E" }}>{photoError}</div>}

        <div style={{ height: 1, background: "#F0F0F1" }} />
        <div className="flex flex-wrap items-center" style={{ gap: 10, padding: "14px 16px" }}>
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <input
            id="sell-neighborhood"
            type="text"
            placeholder="Where can neighbors pick it up? *"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="min-w-0 flex-1 border-none bg-transparent outline-none"
            style={{ borderRadius: 999, padding: "6px 12px", background: "#F5F5F6", fontSize: 13, fontWeight: 600, color: INK }}
          />
        </div>
      </div>
    </PageShell>
  );
}
