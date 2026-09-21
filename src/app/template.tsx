"use client";

import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out w-full">
      {children}
    </div>
  );
}
