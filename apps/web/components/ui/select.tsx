import * as React from "react";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", children, ...props }, ref) => (
  <select
    ref={ref}
    className={`w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm transition-colors focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 ${className}`}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
