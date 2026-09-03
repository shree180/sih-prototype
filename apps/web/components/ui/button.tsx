import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline" | "glass";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-500 text-white hover:bg-amber-400 active:bg-amber-600 shadow-sm hover:shadow-glow",
  secondary:
    "bg-navy-50 text-navy-900 hover:bg-navy-100 active:bg-navy-200 border border-navy-100",
  danger:
    "bg-red-500 text-white hover:bg-red-400 active:bg-red-600 shadow-sm",
  ghost:
    "text-navy-600 hover:bg-navy-50 active:bg-navy-100",
  outline:
    "border border-navy-200 text-navy-700 hover:bg-navy-50 active:bg-navy-100",
  glass:
    "glass-light text-navy-900 hover:bg-white/70 active:bg-white/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-9 px-4 text-sm rounded-lg gap-2",
  lg: "h-11 px-6 text-sm rounded-xl gap-2",
  icon: "h-9 w-9 rounded-lg flex items-center justify-center",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
          "disabled:opacity-50 disabled:pointer-events-none",
          "active:scale-[0.97]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
