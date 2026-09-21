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
      {/* Mobile hamburger */}
      <button type="button" onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white border border-brown-900/10 shadow-sm flex items-center justify-center text-brown-900"
        aria-label="Buka menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      {mobileSidebarOpen && <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`fixed md:relative top-0 left-0 z-50 h-screen transition-transform duration-300 md:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <CompanionSidebar
          conversations={conversations}
          activeConvId={activeConvId ?? undefined}
          onSelectConv={(id) => { setActiveConvId(id); setMobileSidebarOpen(false); }}
          onNewChat={() => { handleCreateNewChat(); setMobileSidebarOpen(false); }}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible((v) => !v)}
        />
      </div>
      <main className="flex-1 min-w-0 h-full overflow-hidden flex flex-col p-4 md:p-6 transition-all duration-300">
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
