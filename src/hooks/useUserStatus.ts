"use client";

import { useState, useEffect } from "react";

export type OnlineStatus = "online" | "idle" | "dnd" | "invisible";

export interface UserStatusConfig {
  status: OnlineStatus;
  color: string;        // Tailwind bg class
  hexColor: string;     // Hex for inline styles
  label: string;        // Bahasa Indonesia label
  dotIcon?: string;     // Optional inner mark (e.g., "-" for dnd)
}

export const STATUS_CONFIG: Record<OnlineStatus, UserStatusConfig> = {
  online: {
    status: "online",
    color: "bg-[#23a55a]",
    hexColor: "#23a55a",
    label: "Aktif",
  },
  idle: {
    status: "idle",
    color: "bg-[#f0b232]",
    hexColor: "#f0b232",
    label: "Sedang Istirahat",
  },
  dnd: {
    status: "dnd",
    color: "bg-[#f23f43]",
    hexColor: "#f23f43",
    label: "Sedang Fokus",
  },
  invisible: {
    status: "invisible",
    color: "bg-[#80848e]",
    hexColor: "#80848e",
    label: "Mode Tenang",
  },
};

/**
 * Reads the user's online status from localStorage.
 * Reactive — re-reads on storage events from other tabs.
 */
export function useUserStatus(): UserStatusConfig {
  const [status, setStatus] = useState<OnlineStatus>("online");

  useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem("zyba_user_online_status") as OnlineStatus | null;
        if (saved && Object.keys(STATUS_CONFIG).includes(saved)) {
          setStatus(saved);
        }
      } catch {}
    };

    read();

    // React to changes from other components (e.g., ProfilePopover)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "zyba_user_online_status") read();
    };
    window.addEventListener("storage", onStorage);

    // Also listen for a custom event fired from the same tab
    const onCustom = () => read();
    window.addEventListener("zyba_status_change", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("zyba_status_change", onCustom);
    };
  }, []);

  return STATUS_CONFIG[status];
}
