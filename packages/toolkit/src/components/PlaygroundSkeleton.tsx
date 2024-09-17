import { Skeleton } from "@instill-ai/design-system";

export const PlaygroundSkeleton = () => {
  return (
    <div className="flex flex-row gap-12 w-full">
      <div className="flex flex-col gap-4 flex-1">
        <Skeleton className="h-6 w-60 rounded" />
        <Skeleton className="h-5 w-96 rounded" />
        <Skeleton className="h-32 w-full rounded" />
        <Skeleton className="h-32 w-full rounded" />
        <Skeleton className="h-10 w-32 rounded self-end" />
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <Skeleton className="h-6 w-60 rounded" />
        <Skeleton className="h-5 w-96 rounded" />
        <Skeleton className="h-32 w-full rounded" />
      </div>
    </div>
  );
};
