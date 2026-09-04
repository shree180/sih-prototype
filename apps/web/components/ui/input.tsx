import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-14 w-full rounded-md border border-[var(--ink-200)] bg-[var(--surface-primary)] px-14 py-2 text-sm text-[var(--ink-900)]",
        "placeholder:text-[var(--ink-400)]",
        "transition-all duration-150",
        "focus:border-[var(--accent-500)] focus:outline-none focus:ring-0 focus:ring-inset focus:ring-2 focus:ring-[var(--accent-500)/14]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-md border border-[var(--ink-200)] bg-[var(--surface-primary)] px-14 py-2 text-sm text-[var(--ink-900)]",
        "placeholder:text-[var(--ink-400)]",
        "transition-all duration-150",
        "focus:border-[var(--accent-500)] focus:outline-none focus:ring-0 focus:ring-inset focus:ring-2 focus:ring-[var(--accent-500)/14]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-[var(--ink-900)] tracking-wide",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Input, Textarea, Label };