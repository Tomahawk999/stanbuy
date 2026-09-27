"use client";

import { useEffect, useRef, useState } from "react";

const INK = "#0F1A1C";
const ORANGE = "#0B0B0C";

export default function PillSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="rd-pill flex cursor-pointer items-center border-none"
        style={{ height: 32, borderRadius: 999, padding: "0 12px", gap: 4, fontSize: 12, fontWeight: 600, color: INK, background: "#E5EBEE" }}
      >
        {current.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ transform: open ? "rotate(180deg)" : undefined }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute flex flex-col"
          style={{ top: 40, left: 0, zIndex: 30, minWidth: 190, background: "#ffffff", borderRadius: 12, padding: 6, boxShadow: "0 8px 24px rgba(15,26,28,0.16)", border: "1px solid #E5EBEE" }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="rd-nav-item flex w-full cursor-pointer items-center border-none bg-transparent text-left"
              style={{ height: 34, borderRadius: 8, padding: "0 10px", fontSize: 13, fontWeight: o.value === value ? 700 : 500, color: o.value === value ? ORANGE : INK }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
