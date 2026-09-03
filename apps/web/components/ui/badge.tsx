import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "glass" | "success" | "warning" | "danger" | "info" | "muted";
}

const variantStyles: Record<string, string> = {
  default: "bg-navy-50 text-navy-700 border-navy-100",
  glass: "glass-light text-navy-800",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger: "bg-red-50 text-red-700 border-red-100",
  info: "bg-sky-50 text-sky-700 border-sky-100",
  muted: "bg-navy-50 text-navy-500 border-navy-100",
};

function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
