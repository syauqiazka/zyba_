"use client";

import React from "react";
import { CommunityProvider } from "./context/CommunityContext";
import CommunitySidebar from "./components/CommunitySidebar";

/**
 * Community Layout — Instagram-style: sidebar overlays content on expand.
 * Sidebar is rendered ONLY here in layout.tsx (AGENTS.md 11.5).
 * The sidebar starts at w-16 (icon-only), expands to w-60 on hover.
 * We use `relative` + `absolute` positioning on the sidebar so it overlays
 * the content rather than pushing it — exactly like Instagram web.
 */
function CommunityLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-cream animate-in fade-in slide-in-from-right-3 duration-300 relative">
      {/* Sidebar — fixed-position within this container, overlays the feed */}
      <CommunitySidebar />

      {/* Main content — has a left margin matching the collapsed sidebar width (w-16 = 64px) */}
      <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col ml-0">
        {children}
      </div>
    </div>
  );
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommunityProvider>
      <CommunityLayoutInner>{children}</CommunityLayoutInner>
    </CommunityProvider>
  );
}
