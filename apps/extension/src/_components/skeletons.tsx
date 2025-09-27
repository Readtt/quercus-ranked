import { Skeleton } from "@workspace/ui/components/skeleton";

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
    <div className="space-y-2">
      {Array.from({ length: 1 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      ))}
    </div>
    <div className="flex items-center gap-2 text-xs">
      <span className="w-2 h-2 rounded-full bg-muted-foreground/60" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

export const AssignmentListSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 1 }).map((_, i) => (
      <div key={i} className="p-3 rounded-lg border bg-card">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </div>
    ))}
  </div>
);