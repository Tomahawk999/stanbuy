"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, CATEGORY_IMAGES } from "@/lib/data";
import type { Category } from "@/lib/types";

const INK = "#0B0B0C";
const MUTED = "#63666A";

const MAIN_LINKS = [
  {
    href: "/browse",
    label: "Home",
    icon: <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" />,
  },
  {
    href: "/saved",
    label: "Saved",
    icon: <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.2C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.3 12 21 12 21Z" />,
  },
  {
    href: "/sell",
    label: "Sell something",
    icon: <path d="M12 5v14M5 12h14" />,
  },
  {
    href: "/profile",
    label: "Your listings",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 20c1.4-4 4.2-6 7-6s5.6 2 7 6" />
      </>
    ),
  },
];

const RESOURCE_LINKS = [
  { href: "/", label: "About Stanbuy" },
  { href: "/legal", label: "Help Center" },
  { href: "/legal?tab=score", label: "Reliability Score" },
  { href: "/legal?tab=terms", label: "Terms & policies" },
];

function SectionHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="rd-nav-item flex w-full cursor-pointer items-center justify-between border-none bg-transparent"
      style={{ height: 40, padding: "0 16px", borderRadius: 8, fontSize: 12, letterSpacing: "0.08em", color: MUTED, textTransform: "uppercase" }}
    >
      {label}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transform: open ? "none" : "rotate(180deg)", transition: "transform 0.15s ease" }}
      >
        <path d="M6 15l6-6 6 6" />
      </svg>
    </button>
  );
}

export default function SideNav({
  activeCategory,
  counts,
}: {
  activeCategory?: string | null;
  counts?: Record<string, number>;
}) {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(true);

  return (
    <nav
      aria-label="Main"
      className="hidden flex-none overflow-y-auto lg:block"
      style={{ width: 272, position: "sticky", top: 56, height: "calc(100dvh - 56px)", borderRight: "1px solid #E5E5E6", padding: "12px 16px" }}
    >
      <div className="flex flex-col" style={{ gap: 2 }}>
        {MAIN_LINKS.map((link) => {
          const active = link.href === "/browse" ? pathname === "/browse" && !activeCategory : pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="rd-nav-item flex items-center"
              style={{
                height: 40,
                padding: "0 16px",
                gap: 12,
                borderRadius: 8,
                fontSize: 14,
                color: INK,
                background: active ? "#E5E5E6" : undefined,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {link.icon}
              </svg>
              {link.label}
            </Link>
          );
        })}
      </div>

      <div style={{ height: 1, background: "#E5E5E6", margin: "12px 0" }} />

      <SectionHeader label="Categories" open={categoriesOpen} onToggle={() => setCategoriesOpen((v) => !v)} />
      {categoriesOpen && (
        <div className="flex flex-col" style={{ gap: 2 }}>
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const active = activeCategory === cat.id;
            const count = counts?.[cat.id];
            return (
              <Link
                key={cat.id}
                href={active ? "/browse" : `/browse?category=${cat.id}`}
                className="rd-nav-item flex items-center"
                style={{
                  height: 40,
                  padding: "0 16px",
                  gap: 10,
                  borderRadius: 8,
                  fontSize: 14,
                  color: INK,
                  background: active ? "#E5E5E6" : undefined,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CATEGORY_IMAGES[cat.id as Category]}
                  alt=""
                  style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover", flex: "none" }}
                />
                <span className="flex-1">{cat.label}</span>
                {count !== undefined && <span style={{ fontSize: 12, color: MUTED }}>{count}</span>}
              </Link>
            );
          })}
        </div>
      )}

      <div style={{ height: 1, background: "#E5E5E6", margin: "12px 0" }} />

      <SectionHeader label="Resources" open={resourcesOpen} onToggle={() => setResourcesOpen((v) => !v)} />
      {resourcesOpen && (
        <div className="flex flex-col" style={{ gap: 2 }}>
          {RESOURCE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rd-nav-item flex items-center"
              style={{ height: 40, padding: "0 16px", borderRadius: 8, fontSize: 14, color: INK }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
