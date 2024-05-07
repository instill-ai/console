import { Skeleton } from "@instill-ai/design-system";

export const CardModelSkeleton = () => {
  return (
    <div className="flex flex-row gap-x-6 rounded-md border border-semantic-bg-line p-4 bg-white">
      <Skeleton className="h-40 w-40 rounded" />
      <div className="flex flex-col grow gap-y-2">
        <Skeleton className="h-6 w-60 rounded" />
        <Skeleton className="h-6 w-3/6 rounded" />
        <Skeleton className="h-6 w-40 rounded mt-auto" />
      </div>
    </div>
  )
}