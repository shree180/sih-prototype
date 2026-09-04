import { cn } from "@/lib/utils";
import { FileX } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[var(--surface-secondary)] text-[var(--ink-400)] mb-4">
        {icon || <FileX className="h-7 w-7" />}
      </div>
      <h3 className="text-sm font-semibold text-[var(--ink-900)]">{title}</h3>
      {description && (
        <p className="mt-1.5 text-xs text-[var(--ink-500)] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export { EmptyState };
