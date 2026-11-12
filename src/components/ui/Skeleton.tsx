import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
  radius?: "sm" | "default" | "major" | "full";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rectangular",
  radius = "default",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const radiusStyles = {
    sm: "rounded-lg",
    default: "rounded-xl",
    major: "rounded-[20px]",
    full: "rounded-full",
  };

  const variantStyles = {
    rectangular: radiusStyles[radius],
    circular: "rounded-full",
    text: "rounded-md h-4 w-full",
  };

  return (
    <div
      className={`bg-brown-900/[0.06] animate-pulse ${variantStyles[variant]} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Skeleton;

