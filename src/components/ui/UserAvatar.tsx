"use client";

import React, { useState } from "react";
import { isAvatarUrl, getFallbackEmoji, getInitials, resolveAvatar } from "@/lib/avatarUtils";

export interface StatusConfig {
  status: "online" | "idle" | "dnd" | "invisible";
  hexColor: string;
  label: string;
}

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  statusConfig?: StatusConfig;
  showStatus?: boolean;
  alt?: string;
}

const SIZE_MAP = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

const DOT_SIZE_MAP = {
  xs: "w-2 h-2 border-[1.5px]",
  sm: "w-2.5 h-2.5 border-[2px]",
  md: "w-3 h-3 border-[2px]",
  lg: "w-4 h-4 border-[2.5px]",
  xl: "w-5 h-5 border-[3px]",
};

export default function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
  statusConfig,
  showStatus = true,
  alt = "Avatar",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error when src changes
  React.useEffect(() => {
    setImgError(false);
  }, [src]);

  const isPresetEmoji = Boolean(src && !isAvatarUrl(src));
  const presetEmoji = isPresetEmoji ? resolveAvatar(src) : null;
  const hasValidImage = Boolean(src && isAvatarUrl(src) && !imgError);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const dotSizeClass = DOT_SIZE_MAP[size] || DOT_SIZE_MAP.md;

  const initials = getInitials(name);
  const fallbackDisplay = presetEmoji || (name ? initials : getFallbackEmoji(src));

  return (
    <div className={`relative shrink-0 select-none rounded-full ${className}`}>
      <div
        className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center font-display font-bold border border-brown-900/10 shadow-2xs transition-transform ${
          hasValidImage
            ? "bg-cream"
            : isPresetEmoji
            ? "bg-cream text-base"
            : "bg-gradient-to-tr from-orange-100 to-green-100 text-brown-900"
        }`}
      >
        {hasValidImage ? (
          <img
            src={src!}
            alt={alt || name || "User Avatar"}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex items-center justify-center leading-none select-none">
            {fallbackDisplay}
          </span>
        )}
      </div>

      {/* Online / Presence status dot */}
      {showStatus && statusConfig && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${dotSizeClass} rounded-full border-white flex items-center justify-center z-10`}
          style={{ backgroundColor: statusConfig.hexColor }}
          title={statusConfig.label}
        >
          {statusConfig.status === "dnd" && (
            <div className="w-1.5 h-[1.5px] bg-white rounded-full" />
          )}
          {statusConfig.status === "invisible" && (
            <div className="w-1 h-1 rounded-full bg-white/80" />
          )}
        </div>
      )}
    </div>
  );
}
