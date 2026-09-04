import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Badge — adapted to the DRM04 Design System v2.1 tokens.
 * Source pattern: https://ui.shadcn.com/docs/components/badge
 *
 * Status rule (§6): badges always pair color + text label, never color alone.
 * `glass` was removed: translucent white pills are unreadable on light
 * surfaces. Use `outline` or a semantic variant instead.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-500)] focus-visible:ring-offset-1 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-[var(--ink-200)] bg-[var(--surface-primary)] text-[var(--ink-700)]",
        secondary:
          "border-[var(--ink-200)] bg-[var(--surface-secondary)] text-[var(--ink-600)]",
        muted:
          "border-[var(--ink-200)] bg-[var(--surface-secondary)] text-[var(--ink-500)]",
        outline:
          "border-[var(--ink-300)] bg-transparent text-[var(--ink-700)]",
        success:
          "border-[var(--success-500)]/30 bg-[var(--success-100)] text-[var(--success-600)]",
        warning:
          "border-[var(--warning-500)]/30 bg-[var(--warning-100)] text-[var(--warning-600)]",
        danger:
          "border-[var(--danger-500)]/30 bg-[var(--danger-100)] text-[var(--danger-600)]",
        info: "border-[var(--info-500)]/30 bg-[var(--info-100)] text-[var(--info-600)]",
        destructive:
          "border-[var(--danger-500)]/30 bg-[var(--danger-100)] text-[var(--danger-600)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant ?? "default"}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
