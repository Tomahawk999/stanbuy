"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HamburgerMenu from "./HamburgerMenu";
import { useStanStore } from "@/lib/store";

const INK = "#0B0B0C";
const MUTED = "#63666A";

function LanguagePicker() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        aria-label="Language and region"
        aria-expanded={open}
        className="rd-ghost flex cursor-pointer items-center justify-center border-none"
        style={{ width: 40, height: 40, borderRadius: 999, color: INK }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18Z" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute flex flex-col"
          style={{ top: "calc(100% + 8px)", right: 0, minWidth: 180, zIndex: 30, background: "#ffffff", borderRadius: 14, padding: 6, boxShadow: "0 8px 24px rgba(15,26,28,0.16)", border: "1px solid #E5E5E6" }}
        >
          <div style={{ padding: "8px 10px", fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Language
          </div>
          <div
            className="flex items-center justify-between"
            style={{ height: 38, borderRadius: 8, padding: "0 10px", fontSize: 14, fontWeight: 600, color: "#0B0B0C", background: "#F0F0F1" }}
          >
            English (US)
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B0B0C" strokeWidth="2.4" strokeLinecap="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader({
  query,
  onQueryChange,
}: {
  query?: string;
  onQueryChange?: (value: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const savedCount = useStanStore((s) => s.savedIds.length);
  const router = useRouter();
  const controlled = query !== undefined && onQueryChange !== undefined;
  const value = controlled ? query : localQuery;

  return (
    <>
      <header className="sticky top-0" style={{ background: "#ffffff", borderBottom: "1px solid #E5E5E6", zIndex: 1002 }}>
        <div className="flex items-center" style={{ height: 56, padding: "0 16px", gap: 12 }}>
          <div className="flex flex-none items-center" style={{ gap: 8 }}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="rd-ghost flex cursor-pointer items-center justify-center border-none lg:hidden"
              style={{ width: 40, height: 40, borderRadius: 999, color: INK }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <Link href="/" aria-label="Stanbuy home" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/stanbuy-logo.png" alt="Stanbuy" style={{ height: 26, display: "block" }} />
            </Link>
          </div>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (!controlled) router.push(value.trim() ? `/?q=${encodeURIComponent(value.trim())}` : "/");
            }}
            className="rd-search mx-auto flex min-w-0 flex-1 items-center"
            style={{ maxWidth: 560, height: 40, borderRadius: 999, background: "#F2F2F3", padding: "0 16px", gap: 10, boxShadow: "inset 0 0 0 1px #E5E5E6" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" className="flex-none">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <label htmlFor="site-search" className="sr-only">Search Stanbuy</label>
            <input
              id="site-search"
              type="text"
              placeholder="Search Stanbuy"
              value={value}
              onChange={(e) => (controlled ? onQueryChange?.(e.target.value) : setLocalQuery(e.target.value))}
              className="min-w-0 flex-1"
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, color: INK }}
            />
          </form>

          <div className="flex flex-none items-center" style={{ gap: 4 }}>
            <Link
              href="/saved"
              aria-label="Saved"
              className="rd-ghost relative flex items-center justify-center"
              style={{ width: 40, height: 40, borderRadius: 999, color: INK }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.2C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.3 12 21 12 21Z" />
              </svg>
              {savedCount > 0 && (
                <span
                  className="absolute flex items-center justify-center"
                  style={{ top: 4, right: 2, minWidth: 16, height: 16, borderRadius: 999, background: "#0B0B0C", color: "#ffffff", fontSize: 10, fontWeight: 700, padding: "0 4px" }}
                >
                  {savedCount}
                </span>
              )}
            </Link>
            <Link
              href="/sell"
              className="rd-ghost flex items-center"
              style={{ height: 40, borderRadius: 999, padding: "0 12px", gap: 6, color: INK, fontSize: 14, fontWeight: 600 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              <span className="hidden sm:inline">Sell</span>
            </Link>
            <LanguagePicker />
            <Link
              href="/profile"
              aria-label="Your account"
              className="rd-ghost flex items-center justify-center"
              style={{ width: 40, height: 40, borderRadius: 999, color: MUTED }}
            >
              <span className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 999, background: "#E5E5E6", color: INK }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="3.6" />
                  <path d="M5 20c1.4-4 4.2-6 7-6s5.6 2 7 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
