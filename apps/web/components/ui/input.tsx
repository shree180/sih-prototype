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
        "flex h-9 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900",
        "placeholder:text-navy-400",
        "transition-all duration-150",
        "focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
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
        "flex min-h-[80px] w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900",
        "placeholder:text-navy-400",
        "transition-all duration-150",
        "focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
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
      "text-xs font-semibold text-navy-700 tracking-wide",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Input, Textarea, Label };
