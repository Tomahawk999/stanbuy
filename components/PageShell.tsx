"use client";

import SiteHeader from "./SiteHeader";
import SideNav from "./SideNav";
import SiteFooter from "./SiteFooter";

export default function PageShell({
  children,
  maxWidth = 756,
  activeCategory,
  query,
  onQueryChange,
}: {
  children: React.ReactNode;
  maxWidth?: number;
  activeCategory?: string | null;
  query?: string;
  onQueryChange?: (value: string) => void;
}) {
  return (
    <div className="min-h-dvh bg-white" style={{ color: "#0B0B0C" }}>
      <SiteHeader query={query} onQueryChange={onQueryChange} />
      <div className="flex">
        <SideNav activeCategory={activeCategory ?? null} />
        <main className="flex min-w-0 flex-1 justify-center" style={{ padding: "0 16px" }}>
          <div className="min-w-0 w-full" style={{ maxWidth, paddingTop: 20 }}>
            {children}
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
