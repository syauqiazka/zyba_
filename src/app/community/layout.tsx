"use client";

import React, { useState } from "react";
import { CommunityProvider } from "./context/CommunityContext";
import CommunitySidebar from "./components/CommunitySidebar";

/**
 * Community Layout — Instagram-style contextual sidebar + mobile off-canvas drawer.
 * Sidebar is rendered ONLY here in layout.tsx (AGENTS.md 11.5).
 * Follows Bagian 15 & 15.1:
 * - Mobile (<md): hamburger toggle fixed top-4 left-4, off-canvas drawer with backdrop,
 *   content padded with pt-16, reset with md:pt-0 on desktop.
 * - Desktop (>=md): sidebar sticky top-0 h-screen, no hamburger, no extra top padding.
 */
function CommunityLayoutInner({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-cream relative">
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white border border-brown-900/10 shadow-sm flex items-center justify-center text-brown-900 hover:bg-cream transition-colors"
        aria-label="Buka menu"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile backdrop overlay */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar: off-canvas drawer on mobile, sticky on desktop */}
      <div
        className={`fixed md:sticky top-0 left-0 z-50 h-screen transition-transform duration-300 md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <CommunitySidebar onClose={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Main content: mobile has pt-16 to avoid hamburger overlap, reset with md:pt-0 per Bagian 15.1 */}
      <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col pt-16 md:pt-0">
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
