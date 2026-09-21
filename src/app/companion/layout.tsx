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

  return (
    <div className="flex h-screen overflow-hidden bg-cream animate-in fade-in slide-in-from-right-3 duration-300">
      <CompanionSidebar
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConv={setActiveConvId}
        onNewChat={handleCreateNewChat}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible((v) => !v)}
      />
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
