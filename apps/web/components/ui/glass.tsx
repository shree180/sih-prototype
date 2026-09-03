import * as React from "react";
import { cn } from "@/lib/utils";

type GlassVariant = "light" | "dark" | "tinted" | "subtle";

const glassStyles: Record<GlassVariant, string> = {
  light: "glass-light",
  dark: "glass-dark",
  tinted: "glass-tinted",
  subtle: "bg-white/40 backdrop-blur-md border border-white/30",
};

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  as?: React.ElementType;
}

const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, variant = "light", as: Component = "div", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(glassStyles[variant], "rounded-2xl", className)}
      {...props}
    />
  )
);
Glass.displayName = "Glass";

export { Glass };
