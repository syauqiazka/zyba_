"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * NavigationProgress — top progress bar (NProgress-style) untuk Next.js App Router.
 * Muncul saat user mengklik link internal, selesai saat pathname berubah.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeRef = useRef(false);

  const clearTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    completeRef.current = false;
    setProgress(0);
    setVisible(true);

    let current = 0;
    clearTick();
    intervalRef.current = setInterval(() => {
      // Easing: fast at first, slows down as it approaches 85%
      const remaining = 85 - current;
      const step = Math.max(0.5, remaining * 0.08 + Math.random() * 3);
      current = Math.min(85, current + step);
      setProgress(current);
    }, 120);
  }, [clearTick]);

  const completeProgress = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    clearTick();
    setProgress(100);
    // Small delay so the bar "fills" before fading out
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 380);
  }, [clearTick]);

  // Listen for clicks on internal <a> tags to start the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, hash, mailto, tel links
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto") ||
        href.startsWith("tel")
      )
        return;

      // Ignore same-page navigation
      if (href === pathname) return;

      // Ignore modifier keys (open in new tab etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      startProgress();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, startProgress]);

  // Complete when route changes
  useEffect(() => {
    completeProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => () => clearTick(), [clearTick]);

  if (!visible) return null;

  return (
    <>
      {/* Top progress bar */}
      <div
        role="progressbar"
        aria-label="Memuat halaman"
        className="fixed top-0 left-0 z-[9999] h-[3px] transition-all ease-out pointer-events-none"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "200ms" : "120ms",
          background:
            "linear-gradient(90deg, #F2884B 0%, #E8C24A 60%, #8FAE5D 100%)",
          boxShadow: "0 0 10px rgba(242, 136, 75, 0.7), 0 0 4px rgba(242, 136, 75, 0.4)",
        }}
      />
      {/* Subtle glow dot at the tip */}
      <div
        className="fixed top-0 z-[9999] w-4 h-4 rounded-full pointer-events-none"
        style={{
          left: `calc(${progress}% - 8px)`,
          top: "-5px",
          background: "rgba(242, 136, 75, 0.6)",
          boxShadow: "0 0 8px rgba(242, 136, 75, 0.6)",
          transition: "left 120ms ease-out",
        }}
      />
    </>
  );
}
