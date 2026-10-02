"use client";

import { useEffect, useRef, useState } from "react";

const DATA_CHANGED_EVENT = "zyba:data-changed";

export function notifyZybaDataChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT));
}

export function useFreshDataSignal(minIntervalMs = 1500) {
  const [signal, setSignal] = useState(0);
  const lastRefreshRef = useRef(Date.now());

  useEffect(() => {
    const trigger = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRefreshRef.current < minIntervalMs) return;
      lastRefreshRef.current = now;
      setSignal((value) => value + 1);
    };

    document.addEventListener("visibilitychange", trigger);
    window.addEventListener("focus", trigger);
    window.addEventListener("pageshow", trigger);
    window.addEventListener(DATA_CHANGED_EVENT, trigger);

    return () => {
      document.removeEventListener("visibilitychange", trigger);
      window.removeEventListener("focus", trigger);
      window.removeEventListener("pageshow", trigger);
      window.removeEventListener(DATA_CHANGED_EVENT, trigger);
    };
  }, [minIntervalMs]);

  return signal;
}

export function useFreshData(
  refresh: () => void | Promise<void>,
  options: { minIntervalMs?: number } = {}
) {
  const refreshRef = useRef(refresh);
  const lastRefreshRef = useRef(0);
  const minIntervalMs = options.minIntervalMs ?? 1500;

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    const runRefresh = () => {
      if (document.visibilityState !== "visible") return;

      const now = Date.now();
      if (now - lastRefreshRef.current < minIntervalMs) return;

      lastRefreshRef.current = now;
      void refreshRef.current();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") runRefresh();
    };

    const handleFocus = () => runRefresh();
    const handlePageShow = () => runRefresh();
    const handleDataChanged = () => runRefresh();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener(DATA_CHANGED_EVENT, handleDataChanged);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener(DATA_CHANGED_EVENT, handleDataChanged);
    };
  }, [minIntervalMs]);
}
