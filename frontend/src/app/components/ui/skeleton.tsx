import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted rounded-lg animate-shimmer", className)}
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <Skeleton className="h-32" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12" />
      ))}
    </div>
  );
}

function SkeletonForm() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
      <Skeleton className="h-20" />
      <Skeleton className="h-12" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonForm };
