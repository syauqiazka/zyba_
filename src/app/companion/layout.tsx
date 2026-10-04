"use client";

import React, { useState } from "react";
import { CompanionProvider, useCompanion } from "./context/CompanionContext";
import CompanionSidebar from "./components/CompanionSidebar";
import MobileBottomNav from "@/components/ui/MobileBottomNav";

/**
 * Companion Layout — manages sidebar visibility state (hide/show).
 * Sidebar is ONLY rendered here per AGENTS.md 10.7.
 * Page.tsx only renders ChatHeader + ChatMessages + ChatInput (no duplicate panel).
 */
function CompanionLayoutInner({ children }: { children: React.ReactNode }) {
  const {
    conversations,
    activeConvId,
    setActiveConvId,
    handleCreateNewChat,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useCompanion();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="flex h-[100dvh] min-h-0 bg-cream relative w-full max-w-full overflow-hidden overscroll-none">
      {/* Backdrop overlay for mobile */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden by default on mobile, slides in when open */}
      <div
        className={`fixed md:relative top-0 left-0 z-50 h-[100dvh] transition-transform duration-300 ease-in-out shrink-0
          ${mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <CompanionSidebar
          conversations={conversations}
          activeConvId={activeConvId ?? undefined}
          onSelectConv={(id) => { setActiveConvId(id); setMobileSidebarOpen(false); }}
          onNewChat={() => { handleCreateNewChat(); setMobileSidebarOpen(false); }}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible((v) => !v)}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Main content — full screen on mobile, comfortable card container on desktop */}
      <main className="flex-1 min-w-0 w-full h-full min-h-0 overflow-hidden flex flex-col p-0 md:p-3 lg:p-6 transition-all duration-300">
        {children}
      </main>
      <MobileBottomNav />
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
