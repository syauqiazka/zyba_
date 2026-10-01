"use client";

import React from "react";

export function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-brown-900/10 bg-white/70 p-5 flex flex-col gap-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-brown-900/10 rounded" />
            <div className="h-4 w-12 bg-brown-900/10 rounded-full" />
          </div>
          <div className="h-8 w-32 bg-brown-900/15 rounded mt-1" />
          <div className="h-2.5 w-40 bg-brown-900/10 rounded" />
        </div>
      ))}
    </div>
  );
}

export function TrendSkeleton() {
  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/70 p-6 animate-pulse flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="h-5 w-36 bg-brown-900/10 rounded" />
        <div className="h-8 w-48 bg-brown-900/10 rounded-xl" />
      </div>
      <div className="h-52 w-full bg-cream/60 rounded-2xl border border-brown-900/5" />
    </div>
  );
}

export function AreasSkeleton() {
  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/70 p-6 animate-pulse flex flex-col gap-4">
      <div className="h-5 w-44 bg-brown-900/10 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-cream/40 border border-brown-900/5 flex flex-col gap-2.5">
            <div className="flex justify-between">
              <div className="h-4 w-28 bg-brown-900/10 rounded" />
              <div className="h-4 w-12 bg-brown-900/10 rounded" />
            </div>
            <div className="h-2 w-full bg-brown-900/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HabitsSkeleton() {
  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/70 p-6 animate-pulse flex flex-col gap-4">
      <div className="h-5 w-36 bg-brown-900/10 rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-cream/40 border border-brown-900/5 flex flex-col gap-2">
            <div className="h-3 w-16 bg-brown-900/10 rounded" />
            <div className="h-6 w-10 bg-brown-900/15 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
