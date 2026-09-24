"use client";

import React, { useState } from "react";
import { CompanionProvider, useCompanion } from "./context/CompanionContext";
import CompanionSidebar from "./components/CompanionSidebar";

/**
 * Companion Layout — manages sidebar visibility state (hide/show).
 * Sidebar is ONLY rendered here per AGENTS.md 10.7.
 * Page.tsx only renders ChatHeader + ChatMessages + ChatInput (no duplicate panel).
 */
function CompanionLayoutInner({ children }: { children: React.ReactNode }) {
  const { conversations, activeConvId, setActiveConvId, handleCreateNewChat } = useCompanion();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-cream relative">
      {/* Mobile hamburger — fixed top-left, always visible on mobile */}
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden fixed top-3 left-3 z-[60] w-10 h-10 rounded-xl bg-white border border-brown-900/10 shadow-md flex items-center justify-center text-brown-900"
        aria-label="Buka menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Backdrop overlay for mobile */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden by default on mobile, slides in when open */}
      <div
        className={`fixed md:relative top-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <CompanionSidebar
          conversations={conversations}
          activeConvId={activeConvId ?? undefined}
          onSelectConv={(id) => { setActiveConvId(id); setMobileSidebarOpen(false); }}
          onNewChat={() => { handleCreateNewChat(); setMobileSidebarOpen(false); }}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible((v) => !v)}
        />
      </div>

      {/* Main content — add top padding on mobile to clear hamburger button */}
      <main className="flex-1 min-w-0 h-full overflow-hidden flex flex-col pt-14 md:pt-0 px-3 pb-3 md:p-6 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

export default function CompanionLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanionProvider>
      <CompanionLayoutInner>{children}</CompanionLayoutInner>
    </CompanionProvider>
  );
}
