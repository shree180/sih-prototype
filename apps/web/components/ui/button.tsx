import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button — adapted to the DRM04 Design System v2.1 tokens.
 * Source pattern: https://ui.shadcn.com/docs/components/button
 * (asChild/Slot omitted: no radix dependency. Use `buttonVariants` to style
 * a Next.js <Link> as a button instead.)
 *
 * Variants follow shadcn naming (default/secondary/destructive/outline/
 * ghost/link) with DRM04 aliases kept for existing call sites:
 * `primary` = default, `danger` = destructive, `md` = default size.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-500)] text-white shadow-xs hover:bg-[var(--accent-400)] active:bg-[var(--accent-600)]",
        primary:
          "bg-[var(--accent-500)] text-white shadow-xs hover:bg-[var(--accent-400)] active:bg-[var(--accent-600)]",
        secondary:
          "border border-[var(--ink-200)] bg-[var(--surface-primary)] text-[var(--ink-900)] shadow-xs hover:bg-[var(--surface-secondary)] active:bg-[var(--ink-100)]",
        destructive:
          "bg-[var(--danger-500)] text-white shadow-xs hover:bg-[var(--danger-600)] active:bg-[var(--danger-600)]",
        danger:
          "bg-[var(--danger-500)] text-white shadow-xs hover:bg-[var(--danger-600)] active:bg-[var(--danger-600)]",
        outline:
          "border border-[var(--ink-200)] bg-[var(--surface-primary)] text-[var(--ink-700)] shadow-xs hover:bg-[var(--surface-secondary)] hover:text-[var(--ink-900)]",
        ghost:
          "text-[var(--ink-600)] hover:bg-[var(--surface-secondary)] hover:text-[var(--ink-900)]",
        link: "text-[var(--accent-600)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 has-[>svg]:px-3",
        md: "h-11 px-4 has-[>svg]:px-3",
        xs: "h-8 gap-1.5 rounded-md px-2.5 text-xs has-[>svg]:px-2",
        sm: "h-10 gap-1.5 rounded-md px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        data-variant={variant ?? "default"}
        data-size={size ?? "default"}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
