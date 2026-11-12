import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "subtle" | "ghost" | "danger" | "warm";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brown-900 text-cream hover:bg-brown-900/90 active:scale-[0.98] border border-brown-900/10 shadow-xs",
  secondary:
    "bg-white/90 text-brown-900 border border-brown-900/15 hover:bg-cream hover:border-brown-900/25 active:scale-[0.98] shadow-xs",
  subtle:
    "text-brown-700 hover:text-brown-900 hover:bg-brown-900/5 active:bg-brown-900/10 border border-transparent",
  ghost:
    "text-brown-700 hover:text-brown-900 hover:bg-transparent active:opacity-70 border border-transparent",
  danger:
    "bg-danger text-white hover:bg-danger/90 active:scale-[0.98] border border-danger/20 shadow-xs",
  warm:
    "bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] border border-orange-600/20 shadow-xs",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs min-h-[32px] gap-1.5",
  md: "px-5 py-2.5 text-sm min-h-[40px] gap-2",
  lg: "px-7 py-3.5 text-base min-h-[48px] gap-2.5 font-bold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current opacity-80" />
            <span className="truncate">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
            <span className="truncate">{children}</span>
            {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

