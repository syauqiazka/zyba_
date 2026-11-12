import React from "react";
import { Sparkles, LucideIcon } from "lucide-react";
import Button from "./Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-[20px] border border-brown-900/10 bg-white/70 p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-100/60 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4 shadow-xs">
        <Icon className="w-7 h-7" strokeWidth={1.8} />
      </div>

      <h3 className="font-display text-lg font-bold text-brown-900 mb-1.5">
        {title}
      </h3>
      <p className="font-body text-xs sm:text-sm text-brown-700 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        <>
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="primary" size="md">
                {actionLabel}
              </Button>
            </a>
          ) : (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default EmptyState;

