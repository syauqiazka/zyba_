"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarCheck,
  Bot,
  Zap,
  Users,
} from "lucide-react";

const NAV_TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/daily-assessment", label: "Check-In", icon: CalendarCheck },
  { href: "/companion", label: "Companion", icon: Bot },
  { href: "/activity", label: "Planner", icon: Zap },
  { href: "/community", label: "Komunitas", icon: Users },
];

export default function MobileBottomNav({
  hiddenWhenSidebarOpen = false,
}: {
  hiddenWhenSidebarOpen?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-brown-900/10 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[max(0.375rem,env(safe-area-inset-bottom))] transition-all duration-300 ${
        hiddenWhenSidebarOpen
          ? "translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
      aria-label="Navigasi Utama Mobile"
    >
      {NAV_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/dashboard" && pathname?.startsWith(tab.href));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 select-none min-w-[56px] ${
              isActive
                ? "text-orange-500 font-bold scale-[1.04]"
                : "text-brown-700/60 hover:text-brown-900"
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isActive ? "bg-orange-50 text-orange-500" : ""
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
