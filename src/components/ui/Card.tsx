import React, { forwardRef } from "react";

export type CardVariant = "default" | "sunken" | "elevated" | "warm" | "vital";
export type CardRadius = "default" | "major" | "sm";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  radius?: CardRadius;
  interactive?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white/95 border border-brown-900/10 shadow-xs",
  sunken: "bg-[#EDE6D6] border border-brown-900/10",
  elevated: "bg-white border border-brown-900/10 shadow-sm hover:shadow-md transition-shadow",
  warm: "bg-orange-100/60 border border-orange-500/20 shadow-xs",
  vital: "bg-green-100/60 border border-green-500/20 shadow-xs",
};

// Hierarki Anti-Slop: Tidak boleh rounded-[32px]
const radiusStyles: Record<CardRadius, string> = {
  sm: "rounded-xl",
  default: "rounded-[20px]",
  major: "rounded-[24px]",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      radius = "default",
      interactive = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${variantStyles[variant]} ${radiusStyles[radius]} ${
          interactive
            ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-brown-900/25 cursor-pointer"
            : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;

