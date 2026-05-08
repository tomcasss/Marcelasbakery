import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "./ui/utils";

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  className?: string;
}

export function LoadingState({
  message = "Cargando...",
  fullPage = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3",
        fullPage && "min-h-screen bg-background",
        !fullPage && "py-12 px-4",
        className
      )}
    >
      <LoadingSpinner size="md" />
      {message && <span className="text-muted-foreground font-medium">{message}</span>}
    </div>
  );
}
